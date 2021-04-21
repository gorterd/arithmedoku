import { autorun } from 'mobx'
import { haveEquivalentChildren, updateChildrenToMatch } from '../shared/dom_util'

export default function setupCollectionInfo(gameStore, collectionInfoEle) {
  const collectionInfoElements = getCollectionInfoElements(collectionInfoEle)
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

    possibilityEle.addEventListener('click', () => {
      console.log('clicked poss ele')
      if (!gameStore.ui.curCage) return
      gameStore.ui.toggleRulePossibility(val)
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
    const iconsDiv = possibilityEle.querySelector('.possibility-icons')

    return () => {
      const iconsFragment = gameStore.ui.filterIconsFragment(val)

      if (!haveEquivalentChildren(iconsDiv, iconsFragment, {
        attributes: ['class']
      })) {
        iconsDiv.replaceChildren(iconsFragment)
      }
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

function getCollectionInfoElements(collectionInfoEle) {
  return {
    combosEle: collectionInfoEle.querySelector('.collection-combos'),
    possibilityEles: collectionInfoEle
      .querySelectorAll('.collection-rule_possibility'),
    andModeButton: collectionInfoEle.querySelector('#rule_and'),
    notModeButton: collectionInfoEle.querySelector('#rule_not'),
    orModeButton: collectionInfoEle.querySelector('#rule_or'),
  }
}