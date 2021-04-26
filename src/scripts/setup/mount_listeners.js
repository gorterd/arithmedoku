import { ARROW_REGEX, NUM_REGEX, LEFT_OR_RIGHT_REGEX } from '../shared/constants'
import { extractPosFromSquare } from '../shared/dom_util'
import {
  getDirFromCode,
  getNumFromCode,
  stringSwitch
} from '../shared/general_util'


export default ({ gameStore, puzzleEle, infoBoxEle }) => {
  document.addEventListener('click', e => {
    if (!e.path.includes(puzzleEle) && !e.path.includes(infoBoxEle)) {
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
      gameStore.selectSquareByPos(extractPosFromSquare(square))
    }
  })

  document.addEventListener('keydown', e => {
    if (!gameStore.ui.curSquare) return

    stringSwitch(e.code, ({ _case, _ensure }) => {
      _case(!e.metaKey, !e.ctrlKey, /^Alt/, () =>
        gameStore.beginStaging())
      _case(!e.altKey, e.ctrlKey, NUM_REGEX, () =>
        gameStore.toggleFocusedSquarePossibility(getNumFromCode(e.code)))
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
      _case(!e.altKey, e.shiftKey, LEFT_OR_RIGHT_REGEX, () =>
        gameStore.ui.changeFilterModeByDir(getDirFromCode(e.code)))
      _case('KeyA', () => gameStore.ui.setFilterMode('and'))
      _case('KeyE', () => gameStore.ui.setFilterMode('not'))
      _case('KeyO', () => gameStore.ui.setFilterMode('or'))
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

