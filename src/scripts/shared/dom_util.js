import { ICONS } from "./constants"
import { genStepper, nextId } from "./general_util"

export const extractPosFromSquare = square =>
  square?.dataset.pos.split(',')

export const extractPosFromEvent = e =>
  extractPosFromSquare(e.target.closest('.square'))

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
  console.log(id)
  const template = document.getElementById(id).content
  return firstChild ? template.firstElementChild : template
}

const createBasicIcon = (iconName) => {
  const icon = document.createElement('i')
  icon.className = ICONS[iconName]
  return icon
}

export const createIcon = (iconName, ...spanClasses) => {
  const iconSpan = document.createElement('span')
  const baseClass = 'possibility-icon'

  iconSpan.classList.add(baseClass, ...spanClasses.map(sc => baseClass + sc))
  iconSpan.appendChild(createBasicIcon(iconName))

  return iconSpan
}

export const addClasses = (eles, classNames, base = '') => {
  const fullClassNames = classNames.map(name => base + name)
  eles.forEach(ele => ele.classList.add(...fullClassNames))
}

export function isEquivalentNode(nodeA, nodeB, options = {}) {
  return (
    haveSameNodeName(nodeA, nodeB, options)
    && haveEquivalentAttributes(nodeA, nodeB, options)
    && haveEquivalentChildren(nodeA, nodeB, options)
  )
}

export function haveEquivalentChildren(nodeA, nodeB, options = {}) {
  const childrenA = nodeA.childNodes
  const childrenB = nodeB.childNodes

  if (childrenA.length !== childrenB.length) {
    return false
  } else if (childrenA.length === 0 && childrenB.length === 0) {
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

function haveSameNodeName(nodeA, nodeB, options = {}) {
  return nodeA.nodeName === nodeB.nodeName
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
          childA.className = childB.className
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