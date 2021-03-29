import { extractPosFromEvent } from '../dom_util'

export default ({ gameStore, puzzleEle, infoBoxEle }) => {
  puzzleEle.addEventListener('click', e => {
    gameStore.selectSquareByPos(extractPosFromEvent(e))
  })

  const arrowMatch = /^Arrow/
  const numMatch = /^\d/
  document.addEventListener('keydown', e => {
    const key = e.key

    switch (true) {
      case arrowMatch.test(key):
        gameStore.selectSquareByKey(key)
        break
      case numMatch.test(key):
        gameStore.fillFocusedSquare(parseInt(key))
        break
      case key === 'Delete' || key === 'Backspace':
        gameStore.eraseFocusedSquare()
        break
    }
  })
}
