import { ARROW_REGEX, NUM_REGEX, LEFT_OR_RIGHT_REGEX } from '../../shared/constants'
import {
  getDirFromCode,
  getNumFromCode,
  stringSwitch,
} from '../../shared/general_util'

export default function mountKeyboardListeners({ gameStore }) {
  document.addEventListener('keydown', e => {
    if (!gameStore.ui.curSquare) return

    stringSwitch(e.code, ({ _case, _ensure }) => {
      _case(!e.metaKey, !e.ctrlKey, /^Alt/, !gameStore.ui.hasSelection, () =>
        gameStore.beginStaging())
      _case(!e.altKey, e.ctrlKey, NUM_REGEX, () =>
        gameStore.ui.hasSelection
          ? gameStore.toggleSelectionPossibility(getNumFromCode(e.code))
          : gameStore.toggleFocusedSquarePossibility(getNumFromCode(e.code)))
      _case(!e.altKey, e.shiftKey, NUM_REGEX, () =>
        gameStore.toggleFilterPossibility(getNumFromCode(e.code)))
      _case(!e.altKey, NUM_REGEX, () =>
        gameStore.setFocusedSquare(getNumFromCode(e.code)))
      _case(e.altKey, NUM_REGEX, () =>
        gameStore.toggleStagedPossibility(getNumFromCode(e.code)))
      _case(!e.altKey, !e.shiftKey, ARROW_REGEX, () =>
        gameStore.selectSquareByDir(getDirFromCode(e.code)))
      _case(e.ctrlKey, ['Delete', 'Backspace'], () =>
        gameStore.resetFocusedSquarePossibilities())
      _case(e.shiftKey, ['Delete', 'Backspace'], () =>
        gameStore.clearFilter())
      _case(!e.altKey, ['Delete', 'Backspace'], () =>
        gameStore.clearFocusedSquare())
      _case(e.altKey, ['Delete', 'Backspace'], () =>
        gameStore.clearStagedPossibilities())
      _case(!e.altKey, e.shiftKey, e.metaKey, LEFT_OR_RIGHT_REGEX, () =>
        gameStore.ui.changeFilterModeByDir(getDirFromCode(e.code)))
      _case(!e.altKey, e.shiftKey, !e.metaKey, ARROW_REGEX, () =>
        gameStore.ui.tentativelySelectInDir(getDirFromCode(e.code)))
      _case('KeyA', () => gameStore.ui.setFilterMode('and'))
      _case('KeyE', () => gameStore.ui.setFilterMode('not'))
      _case('KeyO', () => gameStore.ui.setFilterMode('or'))
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
    console.log(e.code)
    stringSwitch(e.code, ({ _case }) => {
      _case(/Shift/, () => gameStore.ui.lockInTentativeSelections())
      _case(/Alt/, () => gameStore.stopStaging())
    })
  })
}