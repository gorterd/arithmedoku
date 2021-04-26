import { areEqualArrays, funcSwitch, genStepper, stringSwitch } from "./general_util"

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
      dropdown.classList.toggle(showClass)
    }
  })
}

export const getTemplateById = (id, {
  firstChild = true,
} = {}) => {
  const template = document.getElementById(id).content
  return firstChild ? template.firstElementChild : template
}

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

const toPixels = num => `${num}px`

function highlightEle(ele, {
  padding = 0,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  captionTemplate = null,
  captionAnchor = [1, 0],
  centerCaption = true,
  fuzzy = true,
  top,
  left,
  right,
  bottom,
} = {}) {
  paddingLeft = paddingLeft || padding
  paddingRight = paddingRight || padding
  paddingTop = paddingTop || padding
  paddingBottom = paddingBottom || padding

  const {
    top: eleTop,
    right: eleRight,
    left: eleLeft,
    bottom: eleBottom,
    height: eleHeight,
    width: eleWidth,
  } = ele.getBoundingClientRect()

  const paddedTop = toPixels(eleTop - paddingTop)
  const paddedRight = toPixels(eleRight + paddingRight)
  const paddedBottom = toPixels(eleBottom + paddingBottom)
  const paddedLeft = toPixels(eleLeft - paddingLeft)
  const paddedHeight = toPixels(eleHeight + paddingTop + paddingBottom)
  const paddedWidth = toPixels(eleWidth + paddingLeft + paddingRight)

  const above = {
    top: 0,
    left: 0,
    right: 0,
    height: paddedTop,
  }

  const below = {
    top: paddedBottom,
    left: 0,
    right: 0,
    bottom: 0,
  }

  const toLeft = {
    top: paddedTop,
    height: paddedHeight,
    left: 0,
    width: paddedLeft,
  }

  const toRight = {
    top: paddedTop,
    height: paddedHeight,
    right: 0,
    left: paddedRight,
  }

  const [
    aboveEle,
    belowEle,
    toLeftEle,
    toRightEle,
  ] = [above, below, toLeft, toRight].map(style => {
    const ele = document.createElement('div')

    ele.className = 'dim'
    Object.entries(style).forEach(([prop, val]) => {
      ele.style[prop] = val
    })

    document.body.append(ele)
    return ele
  })

  let fuzzyEle
  if (fuzzy) {
    fuzzyEle = document.createElement('div')
    fuzzyEle.className = 'highlight-shadow'
    fuzzyEle.style.top = paddedTop
    fuzzyEle.style.left = paddedLeft
    fuzzyEle.style.height = paddedHeight
    fuzzyEle.style.width = paddedWidth
    document.body.append(fuzzyEle)
  }

  const removeEles = () => [
    aboveEle,
    belowEle,
    toLeftEle,
    toRightEle,
    fuzzyEle,
  ].forEach(ele => ele && ele.remove())

  if (captionTemplate && captionAnchor) {
    try {
      const [anchor, style, dataShift] = prepareCaptionEle({
        aboveEle,
        belowEle,
        toLeftEle,
        toRightEle,
        captionAnchor,
        top,
        right,
        bottom,
        left,
        midX: toPixels(eleRight - (eleWidth / 2))
      })

      const captionEle = captionTemplate.cloneNode(true)

      Object.entries(style).forEach(([prop, val]) => {
        if (val !== undefined) captionEle.style[prop] = val
      })

      if (centerCaption) captionEle.classList.add('caption')
      if (dataShift) captionEle.dataset.shift = dataShift

      anchor.append(captionEle)
    } catch (e) {
      removeEles()
      throw e
    }
  }

  return removeEles
}

function prepareCaptionEle({
  aboveEle,
  belowEle,
  toLeftEle,
  toRightEle,
  captionAnchor,
  top,
  right,
  bottom,
  left,
  midX
}) {
  const anchorMap = {
    top: [0, -1],
    topRight: [1, -1],
    right: [1, 0],
    bottomRight: [1, 1],
    bottom: [0, 1],
    bottomLeft: [-1, 1],
    left: [-1, 0],
    topLeft: [-1, -1],
  }

  if (typeof captionAnchor === 'string') {
    captionAnchor = anchorMap[captionAnchor]
  }

  if (!(captionAnchor instanceof Array)) {
    throw new Error('captionAnchor must be an ordered pair array or valid string')
  }

  const [anchor, {
    top: defaultTop,
    right: defaultRight,
    bottom: defaultBottom,
    left: defaultLeft,
  }, dataShift] = funcSwitch(captionAnchor, areEqualArrays, ({ _case }) => {
    _case([[0, -1]], () => [aboveEle, { bottom: 0, left: midX }, 'left'])
    _case([[1, -1]], () => [toRightEle, { bottom: '100%', left: 0 }])
    _case([[1, 0]], () => [toRightEle, { top: '50%', left: 0 }, 'up'])
    _case([[1, 1]], () => [toRightEle, { top: '100%', left: 0 }])
    _case([[0, 1]], () => [belowEle, { top: 0, left: midX }, 'left'])
    _case([[-1, 1]], () => [toLeftEle, { top: '100%', right: 0 }])
    _case([[-1, 0]], () => [toLeftEle, { top: '50%', right: 0 }, 'up'])
    _case([[-1, -1]], () => [toLeftEle, { bottom: '100%', right: 0 }])
  })

  return [anchor, {
    top: mergeProp(defaultTop, top),
    right: mergeProp(defaultRight, right),
    bottom: mergeProp(defaultBottom, bottom),
    left: mergeProp(defaultLeft, left),
  }, dataShift]
}

function mergeProp(defaultProp, argProp) {
  if (defaultProp === undefined) {
    return argProp
  } else {
    return argProp ? `calc(${defaultProp} + ${argProp})` : defaultProp
  }
}

export const generateHighlightFuncs = (ele, defaultOptions) => {
  let unhighlight = null

  return [
    options => {
      if (!unhighlight) {
        unhighlight = highlightEle(ele, { ...defaultOptions, ...options })
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

window.cap = document.createElement('div')
window.cap.style.width = '200px'
window.cap.style.height = '200px'
window.cap.style.background = 'red'
window.cap.style.position = 'absolute'
window.cap.style.zIndex = 100
window.opts = { captionTemplate: cap, captionAnchor: 'bottom' }
window.ghf = generateHighlightFuncs