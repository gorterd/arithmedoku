import { extractPosFromSquare } from '../../shared/dom_util'

export default function mountClickListeners({ gameStore, env: { elements } }) {
  document.addEventListener('click', e => {
    if (
      !e.path.includes(elements.puzzle)
      && !e.path.includes(elements.infoBox)
    ) {
      gameStore.clearFocus()
      gameStore.ui.clearSelectedSquares()
    }
  })

  elements.puzzle.addEventListener('click', e => {
    const square = e.target.closest('.square')
    if (!square) return

    const squareId = square.dataset.id
    if (e.shiftKey) {
      gameStore.ui.selectThroughSquare(squareId)
    } else if (e.metaKey) {
      gameStore.ui.toggleSelectedSquare(squareId)
    } else {
      gameStore.selectSquareById(squareId)
      gameStore.selectSquareByPos(extractPosFromSquare(square))
    }
  })
}