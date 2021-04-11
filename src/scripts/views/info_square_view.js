import { autorun } from 'mobx'
import { ICONS } from '../util/constants'

export default function setupSquareInfo(gameStore, squareInfoEle) {
  const squareInfoElements = getSquareInfoElements(squareInfoEle)
  setupListeners(gameStore, squareInfoElements)
  makeReactive(gameStore, squareInfoElements)
}

function setupListeners(gameStore, {
  possibilityEles,
  select,
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

      function restoreHover() {
        possibilityEle.classList.remove('prevent-hover')
        possibilityEle.removeEventListener('mouseleave', restoreHover)
      }

      possibilityEle.classList.add('prevent-hover')
      possibilityEle.addEventListener('mouseleave', restoreHover)
    })
  })

  select.addEventListener('click', () => {
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
  selectIcon,
  clearIcon
}) {
  const possibilityReactions = Array.from(possibilityEles).map(possibilityEle =>
    () => {
      const val = parseInt(possibilityEle.dataset.val)
      possibilityEle.className = gameStore.ui.squareInfoPossibilityClassName(val)

      const icons = gameStore.ui.squareInfoPossibilityIconClassNames(val)
      const { noHover, hover } = getPossibilityIcons(possibilityEle)
      noHover.className = icons.noHover
      hover.className = icons.hover
    }
  )
  const reactions = [
    function renderIconClassNames() {
      selectIcon.className = gameStore.ui.squareInfoSelectIconClassName
      clearIcon.className = gameStore.ui.squareInfoClearIconClassName
    },
    ...possibilityReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

function getSquareInfoElements(squareInfoEle) {
  return {
    possibilityEles: squareInfoEle.querySelectorAll('.square-info_possibility'),
    select: squareInfoEle.querySelector('#square-info_select-only'),
    selectIcon: squareInfoEle.querySelector('#square-info_select-only i'),
    clear: squareInfoEle.querySelector('#square-info_clear'),
    clearIcon: squareInfoEle.querySelector('#square-info_clear i'),
  }
}

function getPossibilityIcons(possibilityEle) {
  return {
    noHover: possibilityEle.querySelector('.no-hover i'),
    hover: possibilityEle.querySelector('.hover i'),
  }
}
