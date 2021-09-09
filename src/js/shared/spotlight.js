import { applyStyle } from "./dom_util"
import { areEqualArrays, removeFromArray, stringSwitch } from "./general_util"

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
  captionOffsetX: '0px',
  captionOffsetY: '0px',
  captionPosition: 'none',
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

  static blank(options) {
    return new Spotlight({
      ...defaultOptions,
      ...options
    })
  }

  constructor(options, generate = true) {
    Object.assign(this, options)
    if (generate) this.generate()
  }

  generate() {
    if (!this.eles) return

    this.bounds = this.eles.map((ele, idx) => getPaddedBoundingRect(ele,
      this.padding instanceof Array ? this.padding[idx] : this.padding
    ))

    this.subPaths = []
    this.unvisitedBounds = Array.from(Array(this.bounds.length), (_, i) => i)
    this._anchorBounds = null

    while (this.unvisitedBounds.length > 0) this._addNextSubPath()
  }

  updateSVG(svg = this.svg) {
    if (!svg) throw new Error('no svg provided')
    this.svg = svg

    const vbw = window.innerWidth + overflowPx
    const vbh = window.innerHeight + overflowPx

    svg.setAttribute('viewBox', `0 0 ${vbw} ${vbh}`)
    svg.querySelector('path').setAttribute('d', this._getD(vbw, vbh))
    svg.querySelector('feGaussianBlur').setAttribute('stdDeviation', this.blur)
  }

  updateCaption(caption = this.caption) {
    if (!caption) throw new Error('no caption element provided')
    this.caption = caption

    applyStyle(caption, this.captionStyle, true)
  }

  dup(options) {
    return new Spotlight({ ...this, ...options }, false)
  }

  _addNextSubPath() {
    this.curBoundIdx = this.unvisitedBounds.shift()
    this.curBoundSide = 'top'

    const { left, top } = this.bounds[this.curBoundIdx]
    const subPath = [[left, top]]

    this._addNextPoint(subPath)
    while (!areEqualArrays(subPath[0], subPath[subPath.length - 1])) {
      this._addNextPoint(subPath)
    }

    this.subPaths.push(subPath.map(point =>
      point.map(i => i + overflowPx / 2)
    ))
  }

  _addNextPoint(subPath) {
    const [staticIdx, changingIdx] =
      stringSwitch(this.curBoundSide, ({ _case }) => {
        _case(['left', 'right'], () => [0, 1])
        _case(['top', 'bottom'], () => [1, 0])
      })

    const curPoint = subPath[subPath.length - 1]
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

    for (let idx = 0; idx < this.bounds.length; idx++) {
      const [staticDimLower, staticDimUpper] =
        this._getOtherDimRange(idx, interceptSide)

      if (curStaticDim < staticDimLower || curStaticDim > staticDimUpper) {
        continue
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
    }

    const nextPoint = [null, null]
    nextPoint[staticIdx] = curStaticDim
    nextPoint[changingIdx] = closestDim

    subPath.push(nextPoint)
    removeFromArray(this.unvisitedBounds, closestBoundIdx)

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

  _getOtherDimRange(boundIdx, side) {
    const bound = this.bounds[boundIdx]

    return stringSwitch(side, ({ _case }) => {
      _case(['left', 'right'], () => [bound.top, bound.bottom])
      _case(['top', 'bottom'], () => [bound.left, bound.right])
    })
  }

  _getD(vbw, vbh) {
    return `M 0,0 L ${vbw},0 ${vbw},${vbh} 0,${vbh} 0,0 ${this.innerPath}`
  }

  _getSubPathD(subPath) {
    const m = `M ${subPath[0].join()}`
    const l = subPath.length > 1
      ? `L ${subPath.slice(1).map(p => p.join()).join(' ')}`
      : ''
    return `${m} ${l}`
  }

  _getRoundedSubPathD(subPath) {
    const pathParts = []
    for (let i = 0; i < subPath.length - 1; i++) {
      const hook = i === subPath.length - 2
        ? this._getPathHook([...subPath.slice(-2), subPath[1]])
        : this._getPathHook(subPath.slice(i, i + 3))

      pathParts.push(...hook)
    }

    return `M ${pathParts[pathParts.length - 1]} ${pathParts.join(' ')}`
  }

  _getPathHook([prev, cur, next]) {
    const startPoint = this._getNudgedPoint(cur, prev)
    const endPoint = this._getNudgedPoint(cur, next)
    const radii = [0, 1].map(i => Math.abs(startPoint[i] - endPoint[i]))

    const goingDown = next[1] > prev[1]
    const onRight = cur[0] * 2 > prev[0] + next[0]
    const clockwise = goingDown === onRight ? 1 : 0

    return [
      'L', startPoint,
      'A', radii, 0, 0, clockwise, endPoint
    ]
  }

  _getNudgedPoint(a, b) {
    return [0, 1].map(i => {
      const diff = b[i] - a[i]
      const mag = Math.min(this.borderRadius, Math.abs(diff) / 2)
      return a[i] + mag * Math.sign(diff)
    })
  }

  get innerPath() {
    if (!this.eles) return ''

    const getSubPathD = this.borderRadius
      ? this._getRoundedSubPathD
      : this._getSubPathD

    return this.subPaths.map(getSubPathD.bind(this)).join(' ') + ' z'
  }

  get anchorBounds() {
    if (!this._anchorBounds) {
      if (!this.eles) {
        this._anchorBounds = { top: 0, right: 0, left: 0, bottom: 0 }
      } else if (this.bounds.length > 1 && typeof this.anchorEle === 'number') {
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

    const upperTop = `${boundsTop}px`
    const midTop = `${(boundsTop + boundsBottom) / 2}px`
    const lowerTop = `${boundsBottom}px`
    const startLeft = `${boundsLeft}px`
    const midLeft = `${(boundsLeft + boundsRight) / 2}px`
    const endLeft = `${boundsRight}px`

    return {
      top: { top: upperTop, left: midLeft },
      topRight: { top: upperTop, left: endLeft },
      right: { top: midTop, left: endLeft },
      bottomRight: { top: lowerTop, left: endLeft },
      bottom: { top: lowerTop, left: midLeft },
      bottomLeft: { top: lowerTop, left: startLeft },
      left: { top: midTop, left: startLeft },
      topLeft: { top: upperTop, left: startLeft },
      middle: { top: midTop, left: midLeft },
    }
  }

  get captionStyle() {
    const positionStyle = this.positionStyles[this.captionPosition]

    const xShift = stringSwitch(this.captionPosition, ({ _case, _default }) => {
      _case(/(L|l)eft/, () => '-100%')
      _case(['top', 'bottom', 'middle'], () => '-50%')
      _default(() => '0px')
    })

    const yShift = stringSwitch(this.captionPosition, ({ _case, _default }) => {
      _case(/top/, () => '-100%')
      _case(['left', 'right', 'middle'], () => '-50%')
      _default(() => '0px')
    })

    const translateX = `calc(${xShift} + ${this.captionOffsetX})`
    const translateY = `calc(${yShift} + ${this.captionOffsetY})`

    return {
      ...positionStyle,
      transform: `translateX(${translateX}) translateY(${translateY})`
    }
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

export default Spotlight