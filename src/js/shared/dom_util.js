import { genStepper } from "./general_util"

export const extractPosFromSquare = square => square?.dataset.pos.split(',')

export const mountDropdown = (button, dropdown, showClass) => {
  document.addEventListener('click', e => {
    const outsideDropdown = !dropdown.contains(e.target)
    const onButton = outsideDropdown && button.contains(e.target)
    const isShowing = button.classList.contains(showClass)

    if ((isShowing && outsideDropdown) || (!isShowing && onButton)) {
      if (isShowing) button.blur()
      button.classList.toggle(showClass)
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

function isEquivalentNode(nodeA, nodeB, options = {}) {
  return (
    nodeA.nodeName === nodeB.nodeName
    && haveEquivalentAttributes(nodeA, nodeB, options)
    && haveEquivalentChildren(nodeA, nodeB, options)
  )
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

export const applyStyle = (ele, style, clear = false) => {
  if (clear) ele.style = null
  Object.entries(style).forEach(([attr, val]) => {
    ele.style[attr] = val
  })
}