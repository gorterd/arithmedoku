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

    stringSwitch(e.code, ({ _case, _ensure }) => {
      _case(!e.metaKey, !e.ctrlKey, /^Alt/, () =>
        gameStore.beginStaging())
      _case(!e.altKey, e.ctrlKey, NUM_REGEX, () =>
        gameStore.toggleFocusedSquarePossibility(getNumFromCode(e.code)))
      _case(!e.altKey, NUM_REGEX, () =>
        gameStore.setFocusedSquare(getNumFromCode(e.code)))
      _case(e.altKey, NUM_REGEX, () =>
        gameStore.toggleStagedPossibility(getNumFromCode(e.code)))
      _case(!e.altKey, ARROW_REGEX, () =>
        gameStore.selectSquareByDir(getDirFromCode(e.code)))
      _case(e.ctrlKey, ['Delete', 'Backspace'], () =>
        gameStore.resetFocusedSquarePossibilities())
      _case(!e.altKey, ['Delete', 'Backspace'], () =>
        gameStore.clearFocusedSquare())
      _case(e.altKey, ['Delete', 'Backspace'], () =>
        gameStore.clearStagedPossibilities())
      _ensure(() => {
        e.preventDefault()
      })
    })
  })

  document.addEventListener('keydown', e => {
    stringSwitch(e.code, ({ _case, _ensure }) => {
      _case([e.metaKey, e.ctrlKey], 'KeyZ', () => {
        gameStore.undo()
      })
      _case([e.metaKey, e.ctrlKey], 'KeyY', () => {
        gameStore.redo()
      })
      _ensure(() => {
        e.preventDefault()
      })
    })
  })

  document.addEventListener('keyup', e => {
    if (e.key === 'Alt') {
      gameStore.stopStaging()
    }
  })
}