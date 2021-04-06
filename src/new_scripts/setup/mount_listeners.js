import { ARROW_REGEX, NUM_REGEX } from '../util/constants'
import { extractPosFromEvent } from '../util/dom_util'
import { stringSwitch } from '../util/general_util'


export default ({ gameStore, puzzleEle }) => {
  puzzleEle.addEventListener('focusout', e => {
    window.setTimeout(() => {
      if (!puzzleEle.contains(document.activeElement)) {
        gameStore.clearFocus()
      }
    }, 30)
  })

  puzzleEle.addEventListener('click', e => {
    gameStore.selectSquareByPos(extractPosFromEvent(e))
  })

  let altMode = false
  let altNums = []
  document.addEventListener('keydown', e => {
    if (!gameStore.ui.focusedSquare) return
    const key = e.key

    stringSwitch(key, (kase, def) => {
      kase(e.altKey, !altMode, () => {
        altMode = true

        const onAltUp = function onAltUp(upEvent) {
          if (upEvent.key === 'Alt') {
            if (altNums.length > 0) {
              gameStore.setFocusedSquarePossibilities(altNums)
            }
            altMode = false
            altNums = []
            document.removeEventListener('keyup', onAltUp)
          }
        }

        document.addEventListener('keyup', onAltUp)
      })
      kase(!altMode, NUM_REGEX, e.ctrlKey, () =>
        gameStore.eliminateFocusedSquarePossibility(parseInt(key)))
      kase(altMode, NUM_REGEX, () => altNums.push(parseInt(key)))
      kase(!altMode, NUM_REGEX, () =>
        gameStore.setFocusedSquare(parseInt(key)))
      kase(!altMode, ARROW_REGEX, () =>
        gameStore.selectSquareByKey(key))
      kase(!altMode, ['Delete', 'Backspace'], () =>
        gameStore.clearFocusedSquare())
      def(() =>
        console.log(key, e.ctrlKey))
    })
  })
}