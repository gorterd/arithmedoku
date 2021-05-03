import { applyStyle, createSVGElement, getTemplateById } from "./dom_util"
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

class Spotlight {
  static fromEles(eles, options) {
    return new Spotlight({ eles, ...options })
  }

  static fromEle(ele, options) {
    return new Spotlight({ eles: [ele], ...options })
  }

  constructor({
    eles,
    padding = 0,
    captionPosition,
    captionOffset = {},
  } = {}) {
    this.eles = eles
    this.padding = padding
    this.captionPosition = captionPosition || 'right'
    this.captionOffset = { x: 0, y: 0, ...captionOffset }
    this.generate()
  }

  generate() {
    this.bounds = this.eles.map(ele => getPaddedBoundingRect(ele, this.padding))
    this.subPaths = []
    this.visited = {}
    this._anchorBounds = null

    let i = 0
    while (!this.isComplete && i < 5) {
      this._addNextSubPath()
      i++
    }
  }

  _addNextSubPath() {
    const subPath = []
    this._beginSubPath(subPath)

    let i = 0
    while (!this._isCompleteSubPath(subPath) && i < 100) {
      this._addNextPoint(subPath)
      i++
    }

    this.subPaths.push(subPath)
  }

  _addNextPoint(subPath) {
    const [staticIdx, changingIdx] =
      stringSwitch(this.curBoundSide, ({ _case }) => {
        _case(['left', 'right'], () => [0, 1])
        _case(['top', 'bottom'], () => [1, 0])
      })

    const curPoint = this._getLastPoint(subPath)
    const curStaticDim = curPoint[staticIdx]
    const curChangingDim = curPoint[changingIdx]

    const nextCurBoundSide = getNextSide(this.curBoundSide)
    let closestDim = this._getDim(this.curBoundIdx, nextCurBoundSide)

    if (curChangingDim === closestDim) {
      this.curBoundSide = nextCurBoundSide
      return
    }

    let closestBoundIdx = this.curBoundIdx
    const interceptSide = getOpposideSide(nextCurBoundSide)

    this.boundsIndices.forEach(idx => {
      const [staticDimLower, staticDimUpper] =
        this._getOtherDimRange(idx, interceptSide)

      if (curStaticDim < staticDimLower || curStaticDim > staticDimUpper) {
        return
      }

      const interceptDim = this._getDim(idx, interceptSide)

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

  _getDim(boundOrIdx, side) {
    return typeof boundOrIdx === 'number'
      ? this.bounds[boundOrIdx][side]
      : boundOrIdx[side]
  }

  _getNextBoundIdx() {
    return this.boundsIndices.find(idx => !this.visited[idx])
  }

  _beginSubPath(subPath) {
    this.curBoundIdx = this._getNextBoundIdx()
    this.visited[this.curBoundIdx] = true

    this.curBoundSide = 'top'

    const { left, top } = this.curBound
    subPath.push([left, top])
  }

  _getFirstPoint(subPath) {
    return subPath[0]
  }

  _getLastPoint(subPath) {
    return subPath[subPath.length - 1]
  }

  _getOtherDimRange(boundIdx, side) {
    const bound = this.bounds[boundIdx]

    return stringSwitch(side, ({ _case }) => {
      _case(['left', 'right'], () => [bound.top, bound.bottom])
      _case(['top', 'bottom'], () => [bound.left, bound.right])
    })
  }

  _isCompleteSubPath(subPath) {
    return subPath.length > 1 && areEqualArrays(
      this._getFirstPoint(subPath),
      this._getLastPoint(subPath)
    )
  }

  _getSubPathD(subPath) {
    const m = `M ${subPath[0].join()}`
    const l = `L ${subPath.slice(1).map(p => p.join()).join(' ')}`
    return `${m} ${l}`
  }

  getD(vw, vh) {
    const outerPath = `M 0,0 L ${vw},0 ${vw},${vh} 0,${vh} 0,0`
    const innerPaths = this.subPaths.map(this._getSubPathD).join(' ')
    return `${outerPath} ${innerPaths} z`
  }

  updateSVG({
    element: svg,
    regenerate = true,
  } = {}) {
    if (!svg) return
    if (regenerate) this.generate()

    const vw = window.innerWidth
    const vh = window.innerHeight

    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
    svg.querySelector('path').setAttribute('d', this.getD(vw, vh))
    return svg
  }

  updateCaption({
    element: caption,
    regenerate = true,
  } = {}) {
    if (!caption) return
    if (regenerate) this.generate()

    applyStyle(caption, this.captionStyle, true)

    return caption
  }

  get anchorBounds() {
    if (!this._anchorBounds) {
      if (this.bounds.length > 1 && typeof this.anchorEle === 'number') {
        this._anchorBounds = this.bounds[this.anchorEle]
      } else if (this.bounds.length > 1) {
        this._anchorBounds = this.bounds.reduce((anchorBounds, bound) => ({
          top: Math.min(anchorBounds.top, bound.top),
          left: Math.min(anchorBounds.left, bound.left),
          right: Math.max(anchorBounds.right, bound.right),
          bottom: Math.max(anchorBounds.bottom, bound.bottom),
        }))
      } else {
        this._anchorBounds = this.bounds[0]
      }
    }

    return this._anchorBounds
  }

  get positionStyles() {
    const {
      top: boundsTop,
      right: boundsRight,
      left: boundsLeft,
      bottom: boundsBottom,
    } = this.anchorBounds

    const upperTop = toPixels(boundsTop)
    const midTop = toPixels((boundsTop + boundsBottom) / 2)
    const lowerTop = toPixels(boundsBottom)
    const startLeft = toPixels(boundsLeft)
    const midLeft = toPixels((boundsLeft + boundsRight) / 2)
    const endLeft = toPixels(boundsRight)

    return {
      top: { top: upperTop, left: midLeft },
      topRight: { top: upperTop, left: endLeft },
      right: { top: midTop, left: endLeft },
      bottomRight: { top: lowerTop, left: endLeft },
      bottom: { top: lowerTop, left: midLeft },
      bottomLeft: { top: lowerTop, left: startLeft },
      left: { top: midTop, left: startLeft },
      topLeft: { top: upperTop, left: startLeft },
    }
  }

  get captionStyle() {
    const positionStyle = this.positionStyles[this.captionPosition]

    const xShift = stringSwitch(this.captionPosition, ({ _case, _default }) => {
      _case(/(L|l)eft/, () => '-100%')
      _case(['top', 'bottom'], () => '-50%')
      _default(() => '0')
    })

    const yShift = stringSwitch(this.captionPosition, ({ _case, _default }) => {
      _case(/top/, () => '-100%')
      _case(['left', 'right'], () => '-50%')
      _default(() => '0')
    })

    const { x: offsetX, y: offsetY } = this.captionOffset
    const translateX = offsetX ? `calc(${xShift} + ${offsetX})` : xShift
    const translateY = offsetY ? `calc(${yShift} + ${offsetY})` : yShift

    return {
      ...positionStyle,
      transform: `translateX(${translateX}) translateY(${translateY})`
    }
  }

  get curBound() {
    return this.bounds[this.curBoundIdx]
  }

  get isComplete() {
    return this._getNextBoundIdx() === undefined
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

function toPixels(num) {
  return `${num}px`
}

function getPaddedBoundingRect(ele, padding) {
  const bound = ele.getBoundingClientRect()
  return {
    top: bound.top - padding,
    left: bound.left - padding,
    right: bound.right + padding,
    bottom: bound.bottom + padding,
  }
}

export default Spotlight
