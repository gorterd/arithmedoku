import { autorun } from 'mobx'

export function setupSquares(gameStore, { elements, templates }) {
  const squareEles = new DocumentFragment()

  const disposers = gameStore.puzzle.squaresArray.map(square => {
    const squareEle = templates.square.cloneNode(true)
    const squareElements = getSquareElements(squareEle)

    setupSquare(square, squareElements)
    squareEles.appendChild(squareEle)

    return makeSquareReactive(square, squareElements)
  })

  elements.puzzle.replaceChildren(squareEles)
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

function getSquareElements(squareEle) {
  return {
    squareEle,
    cageTop: squareEle.querySelector('.square_cage-top'),
    cageLeft: squareEle.querySelector('.square_cage-left'),
    label: squareEle.querySelector('.square_label'),
    value: squareEle.querySelector('.square_value'),
    possibilityEles: squareEle.querySelectorAll('.square_possibility')
  }
}