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
  const optionEles = squareEle.querySelectorAll('.square_option')

  const optionReactions = Array.from(optionEles).map(optionEle =>
    () => optionEle.className = square.optionClassName(optionEle.dataset.val)
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
    ...optionReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
  window.disposers = disposers
}
