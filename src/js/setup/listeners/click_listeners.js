import { extractPosFromSquare } from '../../shared/dom_util'

export default function mountClickListeners({
  gameStore,
  elements: {
    puzzleEle,
    infoEle
  }
}) {
  document.addEventListener('click', e => {
    if (
      !e.path.includes(puzzleEle)
      && !e.path.includes(infoEle)
    ) {
      gameStore.clearFocus()
      gameStore.ui.clearSelectedSquares()
    }
  })

  puzzleEle.addEventListener('click', e => {
    const square = e.target.closest('.square')
    if (!square) return

    const squareId = square.dataset.id
    if (e.shiftKey) {
      gameStore.ui.selectThroughSquare(squareId)
    } else if (e.metaKey) {
      gameStore.ui.toggleSelectedSquare(squareId)
    } else {
      gameStore.selectSquareById(squareId)
    }
  })
}