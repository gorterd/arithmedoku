import { createSVGElement } from "./dom_util"
import { areEqualArrays, stringSwitch } from "./general_util"

const clockwiseOrder = [
  'top',
  'right',
  'bottom',
  'left',
]

const sideSigns = {
  top: -1,
  right: 1,
  bottom: 1,
  left: -1,
}

class EleTracer {
  static fromEles(eles, padding = 0) {
    const bounds = eles.map(ele => ele.getBoundingClientRect())
    return new EleTracer(bounds)
  }

  static fromEle(ele, padding = 0) {
    return new EleTracer([ele.getBoundingClientRect()])
  }

  constructor(bounds, generate = true) {
    this.bounds = bounds
    this.subPaths = []
    this.visited = {}
    this.curBoundIdx = null
    this.curBoundSide = null
    if (generate) this.generateSubPaths()
  }

  generateSubPaths() {
    let i = 0
    while (!this.isComplete && i < 5) {
      this.addNextSubPath()
      i++
    }
  }

  addNextSubPath() {
    const subPath = []
    this.beginSubPath(subPath)

    let i = 0
    while (!this.isCompleteSubPath(subPath) && i < 100) {
      this.addNextPoint(subPath)
      i++
    }

    this.subPaths.push(subPath)
  }

  addNextPoint(subPath) {
    const [staticIdx, changingIdx] =
      stringSwitch(this.curBoundSide, ({ _case }) => {
        _case(['left', 'right'], () => [0, 1])
        _case(['top', 'bottom'], () => [1, 0])
      })

    const curPoint = this.getLastPoint(subPath)
    const curStaticDim = curPoint[staticIdx]
    const curChangingDim = curPoint[changingIdx]

    const nextCurBoundSide = getNextSide(this.curBoundSide)
    let closestDim = this.getDim(this.curBoundIdx, nextCurBoundSide)

    if (curChangingDim === closestDim) {
      this.curBoundSide = nextCurBoundSide
      return
    }

    let closestBoundIdx = this.curBoundIdx
    const interceptSide = getOpposideSide(nextCurBoundSide)

    this.boundsIndices.forEach(idx => {
      const [staticDimLower, staticDimUpper] =
        this.getOtherDimRange(idx, interceptSide)

      if (curStaticDim < staticDimLower || curStaticDim > staticDimUpper) {
        return
      }

      const interceptDim = this.getDim(idx, interceptSide)

      if (
        Math.sign(interceptDim - curChangingDim) === sideSigns[nextCurBoundSide]
        && Math.sign(closestDim - interceptDim) === sideSigns[nextCurBoundSide]
      ) {
        closestDim = interceptDim
        closestBoundIdx = idx
      }
    })

    const nextPoint = [null, null]
    nextPoint[staticIdx] = curStaticDim
    nextPoint[changingIdx] = closestDim

    // side effects
    subPath.push(nextPoint)
    this.visited[closestBoundIdx] = true
    this.curBoundIdx = closestBoundIdx
    this.curBoundSide = closestBoundIdx !== this.curBoundIdx
      ? interceptSide
      : nextCurBoundSide
  }

  getDim(boundOrIdx, side) {
    return typeof boundOrIdx === 'number'
      ? this.bounds[boundOrIdx][side]
      : boundOrIdx[side]
  }

  getNextBoundIdx() {
    return this.boundsIndices.find(idx => !this.visited[idx])
  }

  beginSubPath(subPath) {
    this.curBoundIdx = this.getNextBoundIdx()
    this.visited[this.curBoundIdx] = true

    this.curBoundSide = 'top'

    const { left, top } = this.curBound
    subPath.push([left, top])
  }

  getFirstPoint(subPath) {
    return subPath[0]
  }

  getLastPoint(subPath) {
    return subPath[subPath.length - 1]
  }

  getOtherDimRange(boundIdx, side) {
    const bound = this.bounds[boundIdx]

    return stringSwitch(side, ({ _case }) => {
      _case(['left', 'right'], () => [bound.top, bound.bottom])
      _case(['top', 'bottom'], () => [bound.left, bound.right])
    })
  }

  isCompleteSubPath(subPath) {
    return subPath.length > 1 && areEqualArrays(
      this.getFirstPoint(subPath),
      this.getLastPoint(subPath)
    )
  }

  getD(vw, vh) {
    const outerPath = `M 0,0 L ${vw},0 ${vw},${vh} 0,${vh} 0,0`
    const innerPaths = this.subPaths.map(this.getSubPathD).join(' ')
    return `${outerPath} ${innerPaths} z`
  }

  getSubPathD(subPath) {
    const m = `M ${subPath[0].join()}`
    const l = `L ${subPath.slice(1).map(p => p.join()).join(' ')}`
    return `${m} ${l}`
  }

  getSVGPath(vw, vh) {
    const path = createSVGElement('path')
    path.setAttribute('fill-rule', 'evenodd')
    path.setAttribute('d', this.getD(vw, vh))
    return path
  }

  getSVG() {
    const vw = window.innerWidth
    const vh = window.innerHeight

    const svg = createSVGElement('svg')
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
    svg.appendChild(this.getSVGPath(vw, vh))
    svg.setAttribute('class', 'dim-svg')

    return svg
  }

  updateSVG(svg) {
    const vw = window.innerWidth
    const vh = window.innerHeight

    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
    svg.querySelector('path').setAttribute('d', this.getD(vw, vh))
    return svg
  }

  get curBound() {
    return this.bounds[this.curBoundIdx]
  }

  get isComplete() {
    return this.getNextBoundIdx() === undefined
  }

  get boundsIndices() {
    return Array.from({ length: this.bounds.length }).map((_, idx) => idx)
  }
}

function getNextSide(curSide) {
  const idx = clockwiseOrder.indexOf(curSide)
  const nextSideIdx = (idx + 1 + 4) % 4
  return clockwiseOrder[nextSideIdx]
}

function getOpposideSide(side) {
  const idx = clockwiseOrder.indexOf(side)
  const oppositeIdx = (idx + 2) % 4
  return clockwiseOrder[oppositeIdx]
}

window.ET = EleTracer
export default EleTracer
