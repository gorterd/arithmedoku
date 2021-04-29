import { areEqualArrays, indexOfArray, nextId, stringSwitch } from "./general_util"

function spotlightEles(...args) {
  const options = args.pop()
  const eles = args

}

function spotlightEle() {

}

bounds = [
  {
    top: 100,
    bottom: 200,
    left: 100,
    right: 200,
  },
  {
    top: 150,
    bottom: 250,
    left: 150,
    right: 250,
  },
]

// visitedIndices = {

// }

// start = [100, 100]

// no intercept -- same sign
// intercept -- opposition sign
// vertices = []

// curPos = start
// curShapeIdx = 0
// vertical = true
// dir = [0, 1]

// const clockwiseOrder = [
//   [1, 0],
//   [0, 1],
//   [-1, 0],
//   [0, -1]
// ]
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
  constructor(bounds) {
    this.bounds = bounds
    this.subPaths = []
    this.visited = {}
    this.curBoundIdx = null
    this.curBoundSide = null
    this.clockwise = null
  }

  generateSubPaths() {
    while (!this.isComplete) {
      this.addNextSubPath()
    }
  }

  addNextSubPath() {
    const subPath = []
    this.beginSubPath(subPath)

    while (!this.isCompleteSubPath(subPath)) {
      this.addNextPoint(subPath)
    }

    this.subPaths.push(subPath)
  }

  addNextPoint(subPath) {
    const curDim = this.getDim(this.curBoundIdx, this.curBoundSide)
    const nextCurBoundSide = getNextSide(curBoundSide, this.clockwise)
    let closestDim = this.getDim(this.curBoundIdx, nextCurBoundSide)

    if (curDim === closestDim) {
      this.curBoundSide = nextCurBoundSide
      return
    }

    let closestBoundIdx = this.curBoundIdx
    const interceptSide = getOpposideSide(nextCurBoundSide)
    this.boundsIndices.forEach(idx => {
      const interceptDim = this.getDim(idx, interceptSide)

      if (
        Math.sign(interceptDim - curDim) === sideSigns[nextCurBoundSide]
        && Math.sign(closestDim - interceptDim) === sideSigns[nextCurBoundSide]
      ) {
        closestDim = interceptDim
        closestBoundIdx = idx
      }
    })

    const isNewBound = closestBoundIdx !== this.curBoundIdx
    const [prevX, prevY] = this.getLastPoint(subPath)
    const nextSide = isNewBound ? nextCurBoundSide : interceptSide
    const nextPoint = stringSwitch(nextSide, ({ _case }) => {
      _case(['left', 'right'], () => [closestDim, prevY])
      _case(['top', 'bottom'], () => [prevX, closestDim])
    })

    // side effects
    subPath.push(nextPoint)
    this.visited[closestBoundIdx] = true
    this.curBoundIdx = closestBoundIdx
    this.curBoundSide = nextSide
    this.clockwise = isNewBound ? !this.clockwise : this.clockwise
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

    this.clockwise = true
    this.curBoundSide = 'right'

    const { left, top } = this.curBound
    subPath.push([left, top])
  }

  getFirstPoint(subPath) {
    return subPath[0]
  }

  getLastPoint(subPath) {
    return subPath[subPath.length - 1]
  }

  isCompleteSubPath(subPath) {
    return subPath.length > 1 && areEqualArrays(
      this.getFirstPoint(subPath),
      this.getLastPoint(subPath)
    )
  }

  get curBound() {
    return this.bounds[this.curBoundIdx]
  }

  get isComplete() {
    return this.getNextBoundIdx() !== undefined
  }

  get boundsIndices() {
    return Array.from({ length: this.bounds.length }).map((_, idx) => idx)
  }
}

function getNextSide(curSide, clockwise) {
  const idx = clockwiseOrder.indexOf(curSide)
  const diff = clockwise ? 1 : -1
  const nextSideIdx = (idx + diff + 4) % 4
  return clockwiseOrder[nextSideIdx]
}

function getOpposideSide(side) {
  const idx = clockwiseOrder.indexOf(side)
  const oppositeIdx = (idx + 2) % 4
  return clockwiseOrder[oppositeIdx]
}

function getNextPointAndDir(points, visited, curBoundIdx, curBoundSide, clockwise) {
  // const interceptSide = getInterceptSide(curBoundSide)
  // const nextCurBoundSide = getNextCurBoundSide(curBoundSide, clockwise)

  // const interceptDim = bounds.filter(bound => {
  //   const interceptDim = bound[interceptSide]
  //   return (
  //     Math.sign(interceptDim - curDim) === sideSigns[nextId]
  //     && Math.sign(nextCurBoundDim - interceptDim) === sideSigns[nextId]
  //   )
  // }).sort((boundA, boundB) => {
  //   return sideSigns[nextId] * Math.sign(boundA - boundB)
  // })[0]?.[interceptSide]

  const { interceptSide, nextCurBoundSide } = getNextSides(curBoundSide, clockwise)
  const curDim = bounds[curBoundIdx][curBoundSide]

  let closestDim = bounds[curBoundIdx][nextCurBoundSide]
  let closestBoundIdx = curBoundIdx
  bounds.forEach((bound, idx) => {
    const interceptDim = bound[interceptSide]

    if (
      Math.sign(interceptDim - curDim) === sideSigns[nextId]
      && Math.sign(closestDim - interceptDim) === sideSigns[nextId]
    ) {
      closestDim = interceptDim
      closestBoundIdx = idx
    }
  })

  const [prevX, prevY] = points[points.length - 1]
  const nextSide = closestBoundIdx === curBoundIdx
    ? nextCurBoundSide
    : interceptSide

  const nextPoint = stringSwitch(nextSide, ({ _case }) => {
    _case(['left', 'right'], () => [closestDim, prevY])
    _case(['top', 'bottom'], () => [prevX, closestDim])
  })

  // side effects
  points.push(nextPoint)
  visited[closestBoundIdx]
}

function getNextSides(curBoundSide, clockwise) {
  const idx = clockwiseOrder.indexOf(curBoundSide)
  const diff = clockwise ? 1 : -1
  const nextCurBoundSideIdx = (idx + diff + 4) % 4
  const interceptSideIdx = (nextCurBoundSideIdx + 2) % 4
  return {
    nextCurBoundSide: clockwiseOrder[nextCurBoundSideIdx],
    interceptSide: clockwiseOrder[interceptSideIdx]
  }
}



// find oY such that Math.sign(oY - cY) === dir



















function highlightEle(ele) {

  return () => {

  }
}

function highlightEles(...args) {
  // parse args
  const lastArg = args[args.length - 1]
  const eles = lastArg instanceof Node ? args : args.slice(0, -1)
  const {
    padding = 0,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    captionTemplate = null,
    captionPos = 'right',
    ...captionAttrs
  } = lastArg instanceof Node ? {} : lastArg

  // create highlight wrappers to frame highlighted eles
  const [wrapperStyles, outerWrapperStyle] = getPositionStyles(eles, {
    paddingTop: paddingTop || padding,
    paddingRight: paddingRight || padding,
    paddingBottom: paddingBottom || padding,
    paddingLeft: paddingLeft || padding,
  })

  const wrappers = wrapperStyles.map(style => {
    const wrapper = generateDivWithStyle(style)
    wrapper.className = generateClassName('highlight-wrapper', [
      [eles.length === 1, 'fuzzy']
    ])
    document.body.append(wrapper)
    return wrapper
  })

  // if multiple highlight elements, create outer wrapper to anchor caption to
  let outerWrapper = wrappers[0]
  if (wrappers.length > 1) {
    outerWrapper = generateDivWithStyle(outerWrapperStyle)
    outerWrapper.className = 'highlight-outer-wrapper'
    document.body.append(outerWrapper)
  }

  // create background dimming element
  const dimEle = document.createElement('div')
  dimEle.className = 'dim dim--full'
  document.body.append(dimEle)

  // lift highlighted eles above highlight wrappers
  eles.forEach(ele => {
    ele.style.zIndex = 8
    const elePosition = getComputedStyle(ele).getPropertyValue('position')
    if (elePosition === 'static') ele.style.position = 'relative'
  })

  // cleanup all DOM mutations
  const cleanup = () => {
    wrappers.forEach(wrapper => wrapper.remove())
    dimEle.remove()
    outerWrapper.remove()

    eles.forEach(ele => {
      ele.style.zIndex = null
      ele.style.position = null
    })
  }

  // if caption provided, prepare and attach
  if (captionTemplate && captionAnchor) {
    try {
      const [style, shift] = prepareCaptionEle({ captionAnchor, ...attrs })
      const captionEle = captionTemplate.cloneNode(true)

      Object.entries(style).forEach(([prop, val]) => {
        if (val !== undefined) captionEle.style[prop] = val
      })

      if (centerCaption && shift) captionEle.dataset.shift = shift
      captionEle.classList.add('caption')

      outerWrapper.append(captionEle)
    } catch (e) {
      cleanup()
      throw e
    }
  }

  return cleanup
}

function prepareCaptionEle({
  captionAnchor,
  top,
  right,
  bottom,
  left,
}) {
  const {
    top: defaultTop,
    right: defaultRight,
    bottom: defaultBottom,
    left: defaultLeft,
    shift
  } = stringSwitch(captionAnchor, ({ _case }) => {
    _case('top', () => ({ bottom: '100%', left: '50%', shift: 'left' }))
    _case('topRight', () => ({ bottom: '100%', left: '100%' }))
    _case('right', () => ({ top: '50%', left: '100%', shift: 'up' }))
    _case('bottomRight', () => ({ top: '100%', left: '100%' }))
    _case('bottom', () => ({ top: '100%', left: '50%', shift: 'left' }))
    _case('bottomLeft', () => ({ top: '100%', right: '100%' }))
    _case('left', () => ({ top: '50%', right: '100%', shift: 'up' }))
    _case('topLeft', () => ({ bottom: '100%', right: '100%' }))
    _default(() => { throw new Error('Invalid captionAnchor ') })
  })

  return [{
    top: mergeProp(defaultTop, top),
    right: mergeProp(defaultRight, right),
    bottom: mergeProp(defaultBottom, bottom),
    left: mergeProp(defaultLeft, left),
  }, shift]
}

function generateDivWithStyle(style) {
  const div = document.createElement('div')

  Object.entries(style).forEach(([prop, val]) => {
    if (val !== undefined) div.style[prop] = val
  })

  return div
}

function getPositionStyles(eles, {
  paddingTop = 0,
  paddingRight = 0,
  paddingBottom = 0,
  paddingLeft = 0,
} = {}) {
  const toPx = num => `${num}px`

  let outerTop, outerRight, outerBottom, outerLeft
  const attributes = eles.map(ele => {
    const { top, right, bottom, left } = ele.getBoundingClientRect()

    if (outerTop === undefined || top < outerTop) outerTop = top
    if (outerRight === undefined || right > outerRight) outerRight = right
    if (outerBottom === undefined || bottom > outerBottom) outerBottom = bottom
    if (outerLeft === undefined || left < outerLeft) outerLeft = left

    return {
      top: toPx(top - paddingTop),
      left: toPx(left - paddingLeft),
      height: toPx(bottom - top + paddingTop + paddingBottom),
      width: toPx(right - left + paddingRight + paddingLeft),
    }
  })

  return [attributes, {
    top: toPx(outerTop - paddingTop),
    left: toPx(outerLeft - paddingLeft),
    height: toPx(outerBottom - outerTop + paddingTop + paddingBottom),
    width: toPx(outerRight - outerLeft + paddingRight + paddingLeft),
  }]
}

function mergeProp(defaultProp, argProp) {
  if (defaultProp === undefined) {
    return argProp
  } else {
    return argProp ? `calc(${defaultProp} + ${argProp})` : defaultProp
  }
}


// window.cap = document.createElement('div')
// window.cap.style.width = '200px'
// window.cap.style.height = '200px'
// window.cap.style.background = 'red'
// window.cap.style.position = 'absolute'
// window.cap.style.zIndex = 100
// window.opts = { captionTemplate: cap, captionAnchor: 'bottom' }
// window.ghf = generateHighlightFuncs
// window.hh = highlightEles
// window.sa = () => [
//   document.querySelector('.square[data-id="71"]'),
//   document.querySelector('.square[data-id="72"]'),
//   document.querySelector('.square[data-id="73"]'),
// ]