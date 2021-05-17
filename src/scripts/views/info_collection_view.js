import { autorun } from 'mobx'
import { haveEquivalentChildren, updateChildrenToMatch } from '../shared/dom_util'

export function setupCollectionInfo(game) {
  setupListeners(game)
  makeReactive(game)
}

function setupListeners({
  gameStore,
  elements: {
    collectionInfoEles: {
      comboListEle,
      possibilityEles,
      andModeButton,
      notModeButton,
      orModeButton,
      clearModeButton,
      clearAllButton,
    }
  }
}) {
  comboListEle.addEventListener('click', e => {
    if (!gameStore.ui.curCage) return
    const comboEle = e.target.closest('.combo')
    if (comboEle) {
      const combo = comboEle.dataset.combo.split(',')
        .map(valStr => parseInt(valStr))

      gameStore.toggleCurCageCombo(combo)
    }
  })

  Array.from(possibilityEles).map(possibilityEle => {
    const val = parseInt(possibilityEle.dataset.val)

    function restoreHover() {
      possibilityEle.classList.remove('prevent-hover')
      possibilityEle.removeEventListener('mouseleave', restoreHover)
    }

    possibilityEle.addEventListener('click', () => {
      if (!gameStore.ui.curCage) return
      gameStore.toggleFilterPossibility(val)

      possibilityEle.classList.add('prevent-hover')
      possibilityEle.addEventListener('mouseleave', restoreHover)
    })
  })

  const addFilterBtnListener = (btn, mode) => {
    btn.addEventListener('click', () => {
      if (gameStore.ui.shouldShowCollection) {
        gameStore.ui.setFilterMode(mode)
      }
    })
  }

  addFilterBtnListener(andModeButton, 'and')
  addFilterBtnListener(notModeButton, 'not')
  addFilterBtnListener(orModeButton, 'or')

  clearModeButton.addEventListener('click', () => {
    if (gameStore.ui.shouldShowCollection) gameStore.clearFilterMode()
  })
  clearAllButton.addEventListener('click', () => {
    if (gameStore.ui.shouldShowCollection) gameStore.clearFilter()
  })
}

function makeReactive({
  gameStore,
  elements: {
    collectionInfoEle,
    collectionInfoEles: {
      comboListEle,
      possibilityEles,
    }
  }
}) {
  const possibilityReactions = Array.from(possibilityEles).map(possibilityEle => {
    const val = parseInt(possibilityEle.dataset.val)

    const noHoverIconsDiv = possibilityEle
      .querySelector('.possibility-icons--no-hover')
    const hoverIconsDiv = possibilityEle
      .querySelector('.possibility-icons--hover')

    const updateIcons = (iconsDiv, newIcons) => {
      if (!haveEquivalentChildren(iconsDiv, newIcons, {
        attributes: ['class']
      })) {
        iconsDiv.replaceChildren(...newIcons)
      }
    }

    return () => {
      possibilityEle.className = gameStore.ui.filterPossibilityClassName(val)
      updateIcons(noHoverIconsDiv, gameStore.ui.filterNoHoverIcons(val))
      updateIcons(hoverIconsDiv, gameStore.ui.filterHoverIcons(val))
    }
  })

  const reactions = [
    function renderCombos() {
      if (gameStore.ui.shouldShowCollection) {
        updateChildrenToMatch(
          comboListEle,
          gameStore.ui.curCage.comboEles,
          gameStore.ui.curCage.compareComboEles
        )
      }
    },
    function renderFilterModeClassName() {
      collectionInfoEle.className = gameStore.ui.collectionClassName
    },
    ...possibilityReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

export function getCollectionInfoElements() {
  return {
    comboListEle: document.querySelector('.combos_list'),
    filterEle: document.querySelector('.collection-filter'),
    possibilityEles: document.querySelectorAll('.filter-possibility'),
    andModeButton: document.querySelector('#filter-and'),
    notModeButton: document.querySelector('#filter-not'),
    orModeButton: document.querySelector('#filter-or'),
    clearModeButton: document.querySelector('#filter-clear-mode'),
    clearAllButton: document.querySelector('#filter-clear-all'),
  }
}