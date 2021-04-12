import { autorun } from 'mobx'

export default function setupCollectionInfo(gameStore, collectionInfoEle) {
  const collectionInfoElements = getCollectionInfoElements(collectionInfoEle)
  setupListeners(gameStore, collectionInfoElements)
  makeReactive(gameStore, collectionInfoElements)
}

function setupListeners(gameStore, {

}) {

}

function makeReactive(gameStore, {
  combinationsEle,
  combinationEles,
  comboTemplate,
  includesAll,
  includesOne,
  includesNone,
}) {
  const combinationReactions = Array.from(combinationEles).map(combinationEle =>
    () => {

    }
  )
  const reactions = [
    function renderCombinations() {
      combinationsEle.innerHTML = ''
      gameStore.ui.focusedCageRulePossibleCombinations.forEach(c => {
        const comboEle = comboTemplate.cloneNode(true)
        comboEle.innerText = c.join('')
        combinationsEle.append(comboEle)
      })
    },
    ...combinationReactions
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

function getCollectionInfoElements(collectionInfoEle) {
  return {
    combinationsEle: collectionInfoEle.querySelector('.collection-combos'),
    combinationEles: collectionInfoEle.querySelectorAll('.combination'),
    includesAll: collectionInfoEle.querySelector('.collection-rules_includes-all'),
    includesOne: collectionInfoEle.querySelector('.collection-rules_includes-one'),
    includesNone: collectionInfoEle.querySelector('.collection-rules_includes-none'),
    comboTemplate: document.getElementById('combination-template')
      .content.firstElementChild
  }
}