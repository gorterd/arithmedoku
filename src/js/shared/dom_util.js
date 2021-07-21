import { areEqualArrays, funcSwitch, generateClassName, genStepper, stringSwitch } from "./general_util"

export const extractPosFromSquare = square =>
  square?.dataset.pos.split(',')

export const mountDropdown = (button, dropdown, showClass) => {
  document.addEventListener('click', e => {
    const outsideDropdown = !dropdown.contains(e.target)
    const onButton = outsideDropdown && button.contains(e.target)
    const isShowing = dropdown.classList.contains(showClass)

    if (
      (isShowing && outsideDropdown)
      || (!isShowing && onButton)
    ) {
      if (isShowing) button.blur()
      dropdown.classList.toggle(showClass)
    }
  })
}

export const addNoFocusClickListener = (element, listener) =>
  element.addEventListener('mousedown', e => {
    e.preventDefault()
    listener(e)
  })

export const getTemplateNode = (template, firstChild = true) =>
  firstChild ? template.content.firstElementChild : template.content

export const getTemplateById = (id, firstChild = true) =>
  getTemplateNode(document.getElementById(id), firstChild)

export function isEquivalentNode(nodeA, nodeB, options = {}) {
  return (
    nodeA.nodeName === nodeB.nodeName
    && haveEquivalentAttributes(nodeA, nodeB, options)
    && haveEquivalentChildren(nodeA, nodeB, options)
  )
}

export function haveEquivalentChildren(nodeOrListA, nodeOrListB, options = {}) {
  const childrenA = nodeOrListA instanceof Node
    ? Array.from(nodeOrListA.childNodes)
    : nodeOrListA
  const childrenB = nodeOrListB instanceof Node
    ? Array.from(nodeOrListB.childNodes)
    : nodeOrListB

  if (childrenA.length !== childrenB.length) {
    return false
  } else if (childrenA.length === 0) {
    return true
  } else {
    for (let i = 0; i < childrenA.length; i++) {
      let childA = childrenA[i]
      let childB = childrenB[i]

      if (!isEquivalentNode(childA, childB, options)) {
        return false
      }
    }

    return true
  }
}

function haveEquivalentAttributes(nodeA, nodeB, options = {}) {
  let attributesA = nodeA.getAttributeNames()
  let attributesB = nodeB.getAttributeNames()

  if (options.attributes) {
    attributesA = attributesA.filter(attr => options.attributes.includes(attr))
    attributesB = attributesB.filter(attr => options.attributes.includes(attr))
  }

  if (attributesA.length !== attributesB.length) {
    return false
  }

  return attributesA.every(attr =>
    nodeA.getAttribute(attr) === nodeB.getAttribute(attr)
  )
}

export function updateChildrenToMatch(nodeA, nodeOrListB, comparator) {
  const childrenB = nodeOrListB instanceof Node
    ? Array.from(nodeOrListB.children)
    : nodeOrListB
  const getNextAChild = genStepper(Array.from(nodeA.children))
  const getNextBChild = genStepper(childrenB)

  let childA = getNextAChild()
  let childB = getNextBChild()
  while (typeof childA !== 'undefined' || typeof childB !== 'undefined') {
    if (typeof childA === 'undefined') {
      nodeA.append(childB)
      childB = getNextBChild()
    } else if (typeof childB === 'undefined') {
      childA.remove()
      childA = getNextAChild()
    } else {
      switch (comparator(childA, childB)) {
        case -1:
          childA.remove()
          childA = getNextAChild()
          break
        case 0:
          updateAttributesToMatch(childA, childB)
          childA = getNextAChild()
          childB = getNextBChild()
          break
        case 1:
          nodeA.insertBefore(childB.cloneNode(true), childA)
          childB = getNextBChild()
          break
      }
    }
  }
}

function updateAttributesToMatch(nodeA, nodeB) {
  nodeA.getAttributeNames().forEach(attr => {
    const [valA, valB] = [nodeA, nodeB].map(node => node.getAttribute(attr))
    if (valA !== valB) nodeA.setAttribute(attr, valB)
  })
}

// function _highlightEle(ele, {
//   padding = 0,
//   paddingLeft,
//   paddingRight,
//   paddingTop,
//   paddingBottom,
//   captionTemplate = null,
//   captionAnchor = [1, 0],
//   centerCaption = true,
//   fuzzy = true,
//   top,
//   left,
//   right,
//   bottom,
// } = {}) {
//   paddingLeft = paddingLeft || padding
//   paddingRight = paddingRight || padding
//   paddingTop = paddingTop || padding
//   paddingBottom = paddingBottom || padding

//   const {
//     top: eleTop,
//     right: eleRight,
//     left: eleLeft,
//     bottom: eleBottom,
//     height: eleHeight,
//     width: eleWidth,
//   } = ele.getBoundingClientRect()

//   const paddedTop = toPixels(eleTop - paddingTop)
//   const paddedRight = toPixels(eleRight + paddingRight)
//   const paddedBottom = toPixels(eleBottom + paddingBottom)
//   const paddedLeft = toPixels(eleLeft - paddingLeft)
//   const paddedHeight = toPixels(eleHeight + paddingTop + paddingBottom)
//   const paddedWidth = toPixels(eleWidth + paddingLeft + paddingRight)

//   const above = {
//     top: 0,
//     left: 0,
//     right: 0,
//     height: paddedTop,
//   }

//   const below = {
//     top: paddedBottom,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   }

//   const toLeft = {
//     top: paddedTop,
//     height: paddedHeight,
//     left: 0,
//     width: paddedLeft,
//   }

//   const toRight = {
//     top: paddedTop,
//     height: paddedHeight,
//     right: 0,
//     left: paddedRight,
//   }

//   const [
//     aboveEle,
//     belowEle,
//     toLeftEle,
//     toRightEle,
//   ] = [above, below, toLeft, toRight].map(style => {
//     const ele = document.createElement('div')

//     ele.className = 'dim'
//     Object.entries(style).forEach(([prop, val]) => {
//       ele.style[prop] = val
//     })

//     document.body.append(ele)
//     return ele
//   })

//   let fuzzyEle
//   if (fuzzy) {
//     fuzzyEle = document.createElement('div')
//     fuzzyEle.className = 'highlight-shadow'
//     fuzzyEle.style.top = paddedTop
//     fuzzyEle.style.left = paddedLeft
//     fuzzyEle.style.height = paddedHeight
//     fuzzyEle.style.width = paddedWidth
//     document.body.append(fuzzyEle)
//   }

//   const removeEles = () => [
//     aboveEle,
//     belowEle,
//     toLeftEle,
//     toRightEle,
//     fuzzyEle,
//   ].forEach(ele => ele && ele.remove())

//   if (captionTemplate && captionAnchor) {
//     try {
//       const [anchor, style, dataShift] = prepareCaptionEle({
//         aboveEle,
//         belowEle,
//         toLeftEle,
//         toRightEle,
//         captionAnchor,
//         top,
//         right,
//         bottom,
//         left,
//         midX: toPixels(eleRight - (eleWidth / 2))
//       })

//       const captionEle = captionTemplate.cloneNode(true)

//       Object.entries(style).forEach(([prop, val]) => {
//         if (val !== undefined) captionEle.style[prop] = val
//       })

//       if (centerCaption) captionEle.classList.add('caption')
//       if (dataShift) captionEle.dataset.shift = dataShift

//       anchor.append(captionEle)
//     } catch (e) {
//       removeEles()
//       throw e
//     }
//   }

//   return removeEles
// }

// function _prepareCaptionEle({
//   aboveEle,
//   belowEle,
//   toLeftEle,
//   toRightEle,
//   captionAnchor,
//   top,
//   right,
//   bottom,
//   left,
//   midX
// }) {
//   const anchorMap = {
//     top: [0, -1],
//     topRight: [1, -1],
//     right: [1, 0],
//     bottomRight: [1, 1],
//     bottom: [0, 1],
//     bottomLeft: [-1, 1],
//     left: [-1, 0],
//     topLeft: [-1, -1],
//   }

//   if (typeof captionAnchor === 'string') {
//     captionAnchor = anchorMap[captionAnchor]
//   }

//   if (!(captionAnchor instanceof Array)) {
//     throw new Error('captionAnchor must be an ordered pair array or valid string')
//   }

//   const [anchor, {
//     top: defaultTop,
//     right: defaultRight,
//     bottom: defaultBottom,
//     left: defaultLeft,
//   }, dataShift] = funcSwitch(captionAnchor, areEqualArrays, ({ _case }) => {
//     _case([[0, -1]], () => [aboveEle, { bottom: 0, left: midX }, 'left'])
//     _case([[1, -1]], () => [toRightEle, { bottom: '100%', left: 0 }])
//     _case([[1, 0]], () => [toRightEle, { top: '50%', left: 0 }, 'up'])
//     _case([[1, 1]], () => [toRightEle, { top: '100%', left: 0 }])
//     _case([[0, 1]], () => [belowEle, { top: 0, left: midX }, 'left'])
//     _case([[-1, 1]], () => [toLeftEle, { top: '100%', right: 0 }])
//     _case([[-1, 0]], () => [toLeftEle, { top: '50%', right: 0 }, 'up'])
//     _case([[-1, -1]], () => [toLeftEle, { bottom: '100%', right: 0 }])
//   })

//   return [anchor, {
//     top: mergeProp(defaultTop, top),
//     right: mergeProp(defaultRight, right),
//     bottom: mergeProp(defaultBottom, bottom),
//     left: mergeProp(defaultLeft, left),
//   }, dataShift]
// }

export const generateHighlightFuncs = (...eles) => {
  let unhighlight = null

  return [
    (options = {}) => {
      if (!unhighlight) {
        unhighlight = highlightEles(...eles, options)
      }
    },
    () => {
      if (unhighlight) {
        unhighlight()
        unhighlight = null
      }
    }
  ]
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

export const createSVGElement = tag =>
  document.createElementNS('http://www.w3.org/2000/svg', tag)

export const applyStyle = (ele, style, clear = false) => {
  if (clear) ele.style = null
  Object.entries(style).forEach(([attr, val]) => {
    ele.style[attr] = val
    // console.log(ele.style[attr], val)
  })
}

window.cap = document.createElement('div')
window.cap.style.width = '200px'
window.cap.style.height = '200px'
window.cap.style.background = 'red'
window.cap.style.position = 'absolute'
window.cap.style.zIndex = 100
window.opts = { captionTemplate: cap, captionAnchor: 'bottom' }
window.ghf = generateHighlightFuncs
window.hh = highlightEles
window.sa = () => [
  document.querySelector('.square[data-id="71"]'),
  document.querySelector('.square[data-id="72"]'),
  document.querySelector('.square[data-id="73"]'),
]