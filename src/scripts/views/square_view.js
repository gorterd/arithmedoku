import { autorun } from 'mobx'

export function setupSquares({
  gameStore,
  env: {
    templates,
  },
  elements: {
    puzzleEle
  }
}) {
  const squareEles = new DocumentFragment()

  const disposers = gameStore.puzzle.squaresArray.map(square => {
    const squareEle = templates.square.cloneNode(true)
    const squareElements = getSquareElementsFromSquare(squareEle)

    setupSquare(square, squareElements)
    squareEles.appendChild(squareEle)

    return makeSquareReactive(square, squareElements)
  })

  puzzleEle.replaceChildren(squareEles)
  return () => disposers.forEach(disposer => disposer())
}

function setupSquare(square, {
  squareEle,
  label,
  cageTop,
  cageLeft,
}) {
  squareEle.dataset.pos = square.dataPos
  squareEle.dataset.id = square.id
  label.innerText = square.label

  if (!square.isCageTop) {
    cageTop.remove()
  }
  if (!square.isCageLeft) {
    cageLeft.remove()
  }
}

function makeSquareReactive(square, {
  squareEle,
  value,
  possibilityEles
}) {
  const possibilityReactions = Array.from(possibilityEles).map(possibilityEle =>
    () => {
      const val = parseInt(possibilityEle.dataset.val)
      possibilityEle.className = square.possibilityClassName(val)
    }
  )

  const reactions = [
    function renderValNode() {
      value.innerText = square.displayedValue
    },
    function renderClassName() {
      squareEle.className = square.className
    },
    ...possibilityReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return () => disposers.forEach(disposer => disposer())
}

export function getSquareElement(id) {
  return document.querySelector(squareSelector(id))
}

export function getSquareElementsFromId(id) {
  const { getChild, getChildren } = createSquareChildSelectors(id)

  return {
    squareEle: getSquareElement(id, parent),
    cageTop: getChild('.square_cage-top'),
    cageLeft: getChild('.square_cage-left'),
    label: getChild('.square_label'),
    value: getChild('.square_value'),
    possibilityEles: getChildren('.square_possibility')
  }
}

function createSquareChildSelectors(id) {
  const getSelector = subSelector => [squareSelector(id), subSelector].join(' ')

  return {
    getChild: subSelector => document.querySelector(getSelector(subSelector)),
    getChildren: subSelector => document.querySelectorAll(getSelector(subSelector))
  }
}

function squareSelector(id) {
  return `.square[data-id="${id}"]`
}


function getSquareElementsFromSquare(squareEle) {
  return {
    squareEle,
    cageTop: squareEle.querySelector('.square_cage-top'),
    cageLeft: squareEle.querySelector('.square_cage-left'),
    label: squareEle.querySelector('.square_label'),
    value: squareEle.querySelector('.square_value'),
    possibilityEles: squareEle.querySelectorAll('.square_possibility')
  }
}