import { autorun } from 'mobx'

export default function mountSquare(square, template) {
  const ele = createSquare(square, template)
  makeSquareReactive(square, ele)
  return ele
}

function createSquare(square, template) {
  const ele = template.cloneNode(true)
  ele.dataset.pos = square.dataPos
  return ele
}

function makeSquareReactive(square, squareEle) {
  const labelEle = squareEle.querySelector('.square_label')
  const valueEle = squareEle.querySelector('.square_value')
  const possibilityEles = squareEle.querySelectorAll('.square_possibility')

  const possibilityReactions = Array.from(possibilityEles).map(possibilityEle =>
    () => {
      const val = possibilityEle.dataset.val
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
      if (square.isFocused) squareEle.focus()
    },
    ...possibilityReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
}
