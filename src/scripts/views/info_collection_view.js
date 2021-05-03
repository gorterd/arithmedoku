import { autorun } from 'mobx'
import { haveEquivalentChildren, updateChildrenToMatch, isEquivalentNode } from '../shared/dom_util'
import { generateClassName } from '../shared/general_util'

export function setupCollectionInfo({ gameStore, env }) {
  const collectionInfoElements = getCollectionInfoElements(env.elements.infoBox)
  setupListeners(gameStore, collectionInfoElements)
  makeReactive(gameStore, collectionInfoElements)
}

function setupListeners(gameStore, {
  comboListEle,
  possibilityEles,
  andModeButton,
  notModeButton,
  orModeButton,
  clearModeButton,
  clearAllButton,
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

function makeReactive(gameStore, {
  collectionEle,
  comboListEle,
  possibilityEles,
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
      collectionEle.className = gameStore.ui.collectionClassName
    },
    ...possibilityReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

function getCollectionInfoElements(infoBoxEle) {
  return {
    collectionEle: infoBoxEle.querySelector('.collection-info'),
    comboListEle: infoBoxEle.querySelector('.combos_list'),
    filterEle: infoBoxEle.querySelector('.collection-filter'),
    possibilityEles: infoBoxEle.querySelectorAll('.filter-possibility'),
    andModeButton: infoBoxEle.querySelector('#filter-and'),
    notModeButton: infoBoxEle.querySelector('#filter-not'),
    orModeButton: infoBoxEle.querySelector('#filter-or'),
    clearModeButton: infoBoxEle.querySelector('#filter-clear-mode'),
    clearAllButton: infoBoxEle.querySelector('#filter-clear-all'),
  }
}