import { autorun } from 'mobx'

export default function createSquare(square, template) {
  const squareEle = template.cloneNode(true)
  const squareElements = getSquareElements(squareEle)

  setupSquare(square, squareElements)
  makeSquareReactive(square, squareElements)

  return squareEle
}

function setupSquare(square, {
  squareEle,
  label,
  cageTop,
  cageLeft,
}) {
  squareEle.dataset.pos = square.dataPos
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
  return disposers
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