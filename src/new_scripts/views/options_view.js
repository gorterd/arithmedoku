import { autorun } from 'mobx'
import { UP_OR_DOWN_REGEX, NUM_REGEX } from "../util/constants"
import { getDirFromCode, getNumFromCode, stringSwitch } from '../util/general_util'

export function setupOptions(options, optionsEle) {
  const optionsElements = getOptionsElements(optionsEle)
  setupListeners(options, optionsElements)
  makeOptionsReactive(options, optionsElements)
}

function setupListeners(options, {
  autoBlock,
  autoElim,
  autoElimMathImpossibilities,
  maxPossibilitiesInput,
}) {
  autoBlock.addEventListener('click', () => options.toggleAutoBlock())

  autoElim.addEventListener('click', () => options.toggleAutoEliminate())

  autoElimMathImpossibilities.addEventListener('click', () =>
    options.toggleAutoElimMathImpossibilities())

  maxPossibilitiesInput.addEventListener('keydown', e => {
    e.preventDefault()

    const num = stringSwitch(e.code, (kase) => {
      kase(NUM_REGEX, () => {
        return getNumFromCode(e.code)
      })
      kase(UP_OR_DOWN_REGEX, () => {
        const dir = getDirFromCode(e.code)
        let num = options.maxDisplayedPossibilities
        return dir === 'Up' ? num + 1 : num - 1
      })
    })

    if (num) {
      const success = options.setMaxDisplayedPossibilities(num)
      if (!success) console.log('Bad Input!')
    }
  })
}

function makeOptionsReactive(options, {
  autoBlock,
  autoElim,
  autoElimMathImpossibilities,
  maxPossibilitiesInput,
}) {
  const reactions = [
    function renderAutoBlock() {
      autoBlock.className = options.autoBlockClassName
    },
    function renderAutoElim() {
      autoElim.className = options.autoElimClassName
    },
    function renderAutoElimMathImpossibilities() {
      autoElimMathImpossibilities.className =
        options.autoElimMathImpossibilitiesClassName
    },
    function renderMaxPossibilitiesInput() {
      maxPossibilitiesInput.value = options.maxDisplayedPossibilities
    },
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

function getOptionsElements(optionsEle) {
  return {
    autoBlock: optionsEle.querySelector('#option-auto-block'),
    autoElim: optionsEle.querySelector('#option-auto-elim'),
    autoElimMathImpossibilities: optionsEle
      .querySelector('#option-auto-elim-math-impossibilities'),
    maxPossibilitiesInput: optionsEle
      .querySelector('#option-max-possibilities .option_num-input'),
    maxPossibilitiesError: optionsEle
      .querySelector('#option-max-possibilities .option_error'),
  }
}