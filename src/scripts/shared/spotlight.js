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

const overflowPx = 20

const defaultOptions = {
  padding: 0,
  blur: 2,
  captionOffsetX: 0,
  captionOffsetY: 0,
  captionPosition: 'right',
  onShow: () => () => { },
}

class Spotlight {
  static fromEles(eles, options) {
    return new Spotlight({
      eles,
      ...defaultOptions,
      ...options,
    })
  }

  static fromEle(ele, options) {
    return new Spotlight({
      eles: [ele],
      ...defaultOptions,
      ...options
    })
  }

  static fromSpotlight(spotlight, options) {
    return new Spotlight({
      ...spotlight,
      ...options
    })
  }

  constructor(options, generate = true) {
    Object.assign(this, options)
    if (generate) this.generate()
  }

  generate() {
    this.bounds = this.eles.map((ele, idx) => {
      const padding = this.padding instanceof Array
        ? this.padding[idx]
        : this.padding

      return getPaddedBoundingRect(ele, padding)
    })

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

    const overflowOffsetSubPath = subPath.map(point =>
      point.map(i => i + overflowPx / 2)
    )

    this.subPaths.push(overflowOffsetSubPath)
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
    const interceptSide = getOppositeSide(nextCurBoundSide)

    this.boundsIndices.forEach(idx => {
      const [staticDimLower, staticDimUpper] =
        this._getOtherDimRange(idx, interceptSide)

      if (curStaticDim < staticDimLower || curStaticDim > staticDimUpper) {
        return
      }

      const interceptDim = this._getDim(idx, interceptSide)

      const differentShapeSameEdge = (
        interceptDim === curChangingDim
        && idx !== this.curBoundIdx
      )

      const closerEdgeInCorrectDir = (
        Math.sign(interceptDim - curChangingDim) === sideSigns[nextCurBoundSide]
        && Math.sign(closestDim - interceptDim) === sideSigns[nextCurBoundSide]
      )

      if (differentShapeSameEdge || closerEdgeInCorrectDir) {
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
    this.curBoundSide = closestBoundIdx !== this.curBoundIdx
      ? interceptSide
      : nextCurBoundSide
    this.curBoundIdx = closestBoundIdx
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

  getD(vbw, vbh) {
    return `M 0,0 L ${vbw},0 ${vbw},${vbh} 0,${vbh} 0,0 ${this.innerPath}`
  }
  // getD(vbw, vbh) {
  //   const getSubPathD = this.borderRadius
  //     ? this._getRoundedSubPathD
  //     : this._getSubPathD

  //   const outerPath = `M 0,0 L ${vbw},0 ${vbw},${vbh} 0,${vbh} 0,0`
  //   const innerPaths = this.subPaths.map(getSubPathD.bind(this)).join(' ')
  //   return `${outerPath} ${innerPaths} z`
  // }

  updateSVG({
    element: svg,
    regenerate = true,
  } = {}) {
    if (!svg) return
    if (regenerate) this.generate()

    const vbw = window.innerWidth + overflowPx
    const vbh = window.innerHeight + overflowPx

    svg.setAttribute('viewBox', `0 0 ${vbw} ${vbh}`)
    svg.querySelector('path').setAttribute('d', this.getD(vbw, vbh))
    svg.querySelector('feGaussianBlur').setAttribute('stdDeviation', this.blur)
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

  dup(options) {
    return new Spotlight({ ...this, ...options }, false)
  }
  //0 0 1

  _getRoundedSubPathD(subPath) {
    // const m = `M ${this._getNudgedPoint(subPath[0], subPath[1])}`
    const hookPoints = [...subPath, subPath[1]]
    const pathParts = Array.from({ length: hookPoints.length - 2 })
      .reduce((parts, _, idx) => parts.concat(this._getPathHook(hookPoints.slice(idx, idx + 3))), [])

    return [
      'M', pathParts[pathParts.length - 1], ...pathParts
    ].join(' ')

    return `${m} ${hooks.join(' ')}`
  }

  _getPathHook([prev, cur, next]) {
    // const [startPoint, endPoint] = this._getNudgedPoints(prev, cur, next)
    // const  = this._getNudgedPoint(cur, next)
    const startPoint = this._getNudgedPoint(cur, prev)
    const endPoint = this._getNudgedPoint(cur, next)
    const radii = getAbsDiff(startPoint, endPoint)

    const clockwise =
      Math.sign(next[1] - prev[1])
      === Math.sign(cur[0] * 2 - prev[0] - next[0])

    //   const l = `L ${startPoint.join()}`
    // const a = `A ${radii.join(' ')} 0 0 ${clockwise ? '1' : '0'} ${endPoint.join(' ')}`
    // return `${l} ${a}`
    return [
      'L', startPoint,
      'A', radii, 0, 0, clockwise ? 1 : 0, endPoint
    ]
  }

  _getNudgedPoint(a, b) {
    return [0, 1].map(i => {
      const diff = b[i] - a[i]
      const mag = Math.min(this.borderRadius, Math.abs(diff) / 2)
      return a[i] + mag * Math.sign(diff)
    })
  }

  // _getNudgedPoints(prev, cur, next) {
  //   let mag = this.borderRadius
  //   const dirs = [prev, next].map(pos =>
  //     [0, 1].map(i => {
  //       const diff = pos[i] - cur[i]

  //       const maxDiffRadius = Math.abs(diff) / 2
  //       if (maxDiffRadius > 0 && maxDiffRadius < mag) {
  //         mag = maxDiffRadius
  //       }

  //       return Math.sign(diff)
  //     })
  //   )
  //   return dirs.map(dir => dir.map((sign, idx) => cur[idx] + sign * mag))
  //   const prevDir = [0, 1].map(i => Math.sign(prev[i] - cur[i]))
  //   const nextDir = [0, 1].map(i => Math.sign(next[i] - cur[i]))

  //   return [0, 1].map(i => {
  //     const diff = b[i] - a[i]
  //     const mag = Math.min(this.borderRadius, Math.abs(diff) / 2)
  //     return a[i] + mag * Math.sign(diff)
  //   })
  // }

  // get steps() {
  //   return this._steps.map(step => {
  //     return () => {

  //       const stepCleanup = step()
  //       return () => {
  //         stepCleanup()
  //       }
  //     }
  //   })
  // }

  get innerPath() {
    const getSubPathD = this.borderRadius
      ? this._getRoundedSubPathD
      : this._getSubPathD

    return this.subPaths.map(getSubPathD.bind(this)).join(' ') + ' z'
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

    const translateX = `calc(${xShift} + ${this.captionOffsetX})`
    const translateY = `calc(${yShift} + ${this.captionOffsetY})`

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

function getOppositeSide(side) {
  const idx = clockwiseOrder.indexOf(side)
  const oppositeIdx = (idx + 2) % 4
  return clockwiseOrder[oppositeIdx]
}

function toPixels(num) {
  return `${num}px`
}

function getPaddedBoundingRect(ele, padding) {
  const bound = ele.getBoundingClientRect()
  const defaultPadding = typeof padding === 'object'
    ? padding.default ?? 0
    : padding

  return {
    top: bound.top - (padding.top ?? defaultPadding),
    left: bound.left - (padding.left ?? defaultPadding),
    right: bound.right + (padding.right ?? defaultPadding),
    bottom: bound.bottom + (padding.bottom ?? defaultPadding),
  }
}

// _getRoundedSubPathD(subPath) {
//   const m = `M ${subPath[0].join()}`
//   const l = `L ${subPath.slice(1).map(p => p.join()).join(' ')}`
//   return `${m} ${l}`
// }

// function getNudgeDiff(a, b, px) {
//   return [0, 1].map(i => {
//     const diff = b[i] - a[i]
//     const mag = Math.min(px, Math.abs(diff) / 2)
//     return mag * Math.sign(diff)
//   })
// }

// function getNudgedPoint(a, b) {
//   return [0, 1].map(i => {
//     const diff = b[i] - a[i]
//     const mag = Math.min(this.borderRadius, Math.abs(diff) / 2)
//     return a[i] + mag * Math.sign(diff)
//   })
// }

function getAbsDiff(a, b) {
  return [0, 1].map(i => Math.abs(a[i] - b[i]))
}

// function getPathHook(prev, cur, next, radius) {
//   const startPoint = getNudgedPoint(cur, prev, radius)
//   const endPoint = getNudgedPoint(cur, next, radius)
//   const radii = getAbsDiff(startPoint, endPoint)

//   const l = `L ${startPoint.join()}`
//   const a = `A ${radii.join(' ')} 0 0 1 ${endPoint.join(' ')}`
//   return `${l} ${a}`
// }


// function vecAdd(...vecs) {
//   return Array.from({ length: vecs[0].length })
//     .map((_, idx) => vecs.reduce((sum, vec) => vec[idx] + sum, 0))
// }


export default Spotlight
window.Spotlight = Spotlight
// clockwise
// pos, pos -> higherx, lowery
// neg, pos -> higherx, highery
// pos, neg -> lowerx, lowery
// neg, neg -> lowerx, highery

// if sign of second matches sign of x diff