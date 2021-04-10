import { autorun } from 'mobx'

export default function setupSquareInfo(gameStore, squareInfoEle) {
  const squareInfoElements = getSquareInfoElements(squareInfoEle)
  setupListeners(gameStore, squareInfoElements)
  makeReactive(gameStore, squareInfoElements)
}

function setupListeners(gameStore, {
  possibilityEles,
  selectOnly,
  clear
}) {
  possibilityEles.forEach(possibilityEle => {
    const val = parseInt(possibilityEle.dataset.val)
    possibilityEle.addEventListener('click', () => {
      if (gameStore.ui.isStaging) {
        gameStore.toggleStagedPossibility(val)
      } else {
        gameStore.toggleFocusedSquarePossibility(val)
      }
    })
  })

  selectOnly.addEventListener('click', () => {
    if (gameStore.ui.isStaging) {
      gameStore.stopStaging()
    } else {
      gameStore.beginStaging()
    }
  })

  clear.addEventListener('click', () => {
    if (gameStore.ui.isStaging) {
      gameStore.clearStagedPossibilities()
    } else if (gameStore.ui.focusedSquare.hasEliminations) {
      gameStore.resetFocusedSquarePossibilities()
    }
  })
}

function makeReactive(gameStore, {
  possibilityEles,
  selectOnly,
  clear
}) {
  const possibilityReactions = Array.from(possibilityEles).map(possibilityEle =>
    () => {
      const val = parseInt(possibilityEle.dataset.val)
      possibilityEle.className = gameStore.ui.squareInfoPossibilityClassName(val)
    }
  )
  const reactions = [
    function renderButtonClassNames() {
      selectOnly.className = gameStore.ui.squareInfoButtonClassName
      clear.className = gameStore.ui.squareInfoButtonClassName
    },
    ...possibilityReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

function getSquareInfoElements(squareInfoEle) {
  return {
    possibilityEles: squareInfoEle.querySelectorAll('.square-info_possibility'),
    selectOnly: squareInfoEle.querySelector('#square-info_select-only'),
    clear: squareInfoEle.querySelector('#square-info_clear'),
  }
}
