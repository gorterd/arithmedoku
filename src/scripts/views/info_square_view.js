import { autorun } from 'mobx'

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

    function restoreHover() {
      possibilityEle.classList.remove('prevent-hover')
      possibilityEle.removeEventListener('mouseleave', restoreHover)
    }

    possibilityEle.addEventListener('click', () => {
      if (!gameStore.ui.curSquare || gameStore.ui.hasFocusedSquareValue) {
        return
      }

      if (gameStore.ui.isStaging) {
        gameStore.toggleStagedPossibility(val)
      } else {
        gameStore.toggleFocusedSquarePossibility(val)
      }

      possibilityEle.classList.add('prevent-hover')
      possibilityEle.addEventListener('mouseleave', restoreHover)
    })
  })

  select.addEventListener('click', () => {
    if (!gameStore.ui.curSquare || gameStore.ui.hasFocusedSquareValue) {
      return
    } else if (gameStore.ui.isStaging) {
      gameStore.stopStaging()
    } else {
      gameStore.beginStaging()
    }
  })

  clear.addEventListener('click', () => {
    if (!gameStore.ui.curSquare) {
      return
    } else if (gameStore.ui.isStaging) {
      gameStore.clearStagedPossibilities()
    } else {
      if (gameStore.ui.hasFocusedSquareValue) {
        gameStore.clearFocusedSquare()
      }

      if (gameStore.ui.curSquare.hasEliminations) {
        gameStore.resetFocusedSquarePossibilities()
      }
    }
  })
}

function makeReactive(gameStore, {
  possibilityEles,
  selectIcon,
  clearIcon,
  select,
  clear,
}) {
  const possibilityReactions = Array.from(possibilityEles).map(possibilityEle => {
    const val = parseInt(possibilityEle.dataset.val)
    return () => {
      possibilityEle.className = gameStore.ui.squareInfoPossibilityClassName(val)
      const iconClassNames = gameStore.ui.squareInfoPossibilityIconClassNames(val)
      const { noHover, hover } = getPossibilityIcons(possibilityEle)
      noHover.className = iconClassNames.noHover
      hover.className = iconClassNames.hover
    }
  })

  const reactions = [
    function renderIconClassNames() {
      selectIcon.className = gameStore.ui.squareInfoSelectIconClassName
      clearIcon.className = gameStore.ui.squareInfoClearIconClassName
    },
    function renderButtonsClassName() {
      select.className = gameStore.ui.squareInfoSelectClassName
      clear.className = gameStore.ui.squareInfoClearClassName
    },
    function renderDisabledSelect() {
      if (gameStore.ui.squareInfoSelectIsDisabled) {
        select.disabled = true
      } else {
        select.disabled = false
      }
    },
    function renderDisabledClear() {
      if (gameStore.ui.squareInfoClearIsDisabled) {
        clear.disabled = true
      } else {
        clear.disabled = false
      }
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
