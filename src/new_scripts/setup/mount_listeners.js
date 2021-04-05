import { extractPosFromEvent } from '../util/dom_util'

export default ({ gameStore, puzzleEle, infoBoxEle }) => {
  puzzleEle.addEventListener('click', e => {
    gameStore.selectSquareByPos(extractPosFromEvent(e))
  })

  // TODO: add support for holding down s/e to set/eliminate square poss
  const arrowMatch = /^Arrow/
  const numMatch = /^\d/
  document.addEventListener('keydown', e => {
    const key = e.key

    if (arrowMatch.test(key)) {
      gameStore.selectSquareByKey(key)
    } else if (numMatch.test(key)) {
      gameStore.setFocusedSquare(parseInt(key))
    } else if (key === 'Delete' || key === 'Backspace') {
      gameStore.clearFocusedSquare()
    }
  })
}
