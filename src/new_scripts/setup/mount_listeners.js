import { ARROW_REGEX, NUM_REGEX } from '../util/constants'
import { extractPosFromEvent } from '../util/dom_util'
import { getDirFromCode, getNumFromCode, stringSwitch } from '../util/general_util'


export default ({ gameStore, puzzleEle, infoBoxEle }) => {
  document.addEventListener('click', e => {
    if (!puzzleEle.contains(e.target) && !infoBoxEle.contains(e.target)) {
      gameStore.clearFocus()
    }
  })

  puzzleEle.addEventListener('click', e => {
    gameStore.selectSquareByPos(extractPosFromEvent(e))
  })

  document.addEventListener('keydown', e => {
    if (!gameStore.ui.focusedSquare) return
    e.preventDefault()

    stringSwitch(e.code, (kase, def) => {
      kase(/^Alt/, () =>
        gameStore.beginStaging())
      kase(!e.altKey, e.ctrlKey, NUM_REGEX, () =>
        gameStore.toggleFocusedSquarePossibility(getNumFromCode(e.code)))
      kase(!e.altKey, NUM_REGEX, () =>
        gameStore.setFocusedSquare(getNumFromCode(e.code)))
      kase(e.altKey, NUM_REGEX, () =>
        gameStore.toggleStagedPossibility(getNumFromCode(e.code)))
      kase(!e.altKey, ARROW_REGEX, () =>
        gameStore.selectSquareByDir(getDirFromCode(e.code)))
      kase(!e.altKey, ['Delete', 'Backspace'], () =>
        gameStore.clearFocusedSquare())
      kase(e.altKey, ['Delete', 'Backspace'], () =>
        gameStore.clearStagedPossibilities())
    })
  })

  document.addEventListener('keyup', e => {
    if (e.key === 'Alt') {
      gameStore.stopStaging()
    }
  })
}