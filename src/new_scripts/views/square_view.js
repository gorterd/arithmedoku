import { autorun } from 'mobx'

export default function createSquare(square, template) {
  const squareEle = template.cloneNode(true)
  squareEle.dataset.pos = square.dataPos
  makeSquareReactive(square, squareEle)
  return squareEle
}

function makeSquareReactive(square, squareEle) {
  const {
    labelEle,
    valueEle,
    possibilityEles
  } = getSquareElements(squareEle)

  const possibilityReactions = Array.from(possibilityEles).map(possibilityEle =>
    () => {
      const val = parseInt(possibilityEle.dataset.val)
      possibilityEle.className = square.possibilityClassName(val)
    }
  )

  const reactions = [
    function renderValNode() {
      valueEle.innerText = square.value
    },
    function renderClassName() {
      squareEle.className = square.className
    },
    function renderLabel() {
      labelEle.innerText = square.label
    },
    function renderInlineStyle() {
      squareEle.style = square.inlineStyle
    },
    function focusSquare() {
      if (square.isFocused) {
        squareEle.focus()
      }
    },
    ...possibilityReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

function getSquareElements(squareEle) {
  return {
    labelEle: squareEle.querySelector('.square_label'),
    valueEle: squareEle.querySelector('.square_value'),
    possibilityEles: squareEle.querySelectorAll('.square_possibility')
  }
}