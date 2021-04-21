import { autorun } from 'mobx'
import { haveEquivalentChildren, updateChildrenToMatch, isEquivalentNode } from '../shared/dom_util'

export default function setupCollectionInfo(gameStore, infoBoxEle) {
  const collectionInfoElements = getCollectionInfoElements(infoBoxEle)
  setupListeners(gameStore, collectionInfoElements)
  makeReactive(gameStore, collectionInfoElements)
}

function setupListeners(gameStore, {
  combosEle,
  possibilityEles,
  andModeButton,
  notModeButton,
  orModeButton,
}) {
  combosEle.addEventListener('click', e => {
    if (!gameStore.ui.curCage) return
    const comboEle = e.target.closest('.combo')
    if (comboEle) {
      const combo = comboEle.dataset.combo.split(',')
        .map(valStr => parseInt(valStr))

      gameStore.ui.curCage.toggleCombo(combo)
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
      gameStore.ui.toggleFilterPossibility(val)

      possibilityEle.classList.add('prevent-hover')
      possibilityEle.addEventListener('mouseleave', restoreHover)
    })
  })

  andModeButton.addEventListener('click',
    () => gameStore.ui.setFilterMode('and'))
  notModeButton.addEventListener('click',
    () => gameStore.ui.setFilterMode('not'))
  orModeButton.addEventListener('click',
    () => gameStore.ui.setFilterMode('or'))
}

function makeReactive(gameStore, {
  combosEle,
  possibilityEles,
  andModeButton,
  notModeButton,
  orModeButton,
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
      possibilityEle.className = gameStore.ui.filterClassName(val)
      updateIcons(noHoverIconsDiv, gameStore.ui.filterNoHoverIcons(val))
      updateIcons(hoverIconsDiv, gameStore.ui.filterHoverIcons(val))
    }
  })

  const reactions = [
    function renderCombos() {
      if (gameStore.ui.curCage) {
        updateChildrenToMatch(
          combosEle,
          gameStore.ui.curCage.comboEles,
          gameStore.ui.curCage.compareComboEles
        )

        combosEle.hidden = false
      } else {
        combosEle.hidden = true
      }
    },
    function renderFilterModeClassNames() {
      andModeButton.className = gameStore.ui.andModeButtonClassName
      notModeButton.className = gameStore.ui.notModeButtonClassName
      orModeButton.className = gameStore.ui.orModeButtonClassName
    },
    ...possibilityReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

function getCollectionInfoElements(infoBoxEle) {
  return {
    combosEle: infoBoxEle.querySelector('.collection-combos'),
    possibilityEles: infoBoxEle
      .querySelectorAll('.filter-possibility'),
    andModeButton: infoBoxEle.querySelector('#filter_and'),
    notModeButton: infoBoxEle.querySelector('#filter_not'),
    orModeButton: infoBoxEle.querySelector('#filter_or'),
  }
}