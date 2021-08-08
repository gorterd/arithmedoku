import { autorun } from 'mobx'
import { devLog } from '../dev'
import { NUM_REGEX, ARROW_REGEX } from "../shared/constants"
import { getDirFromCode, getNumFromCode, stringSwitch } from '../shared/general_util'

export function setupOptions(game) {
  setupListeners(game)
  makeOptionsReactive(game)
}

function setupListeners({
  gameStore: {
    options
  },
  elements: {
    optionsEles: {
      autoBlock,
      autoElim,
      autoElimMathImpossibilities,
      walkthrough,
      maxPossibilitiesInput,
    }
  }
}) {
  autoBlock.addEventListener('click', options.toggleAutoBlock)
  autoElim.addEventListener('click', options.toggleAutoEliminate)
  walkthrough.addEventListener('click', options.toggleWalkthrough)
  autoElimMathImpossibilities.addEventListener(
    'click',
    options.toggleAutoElimMathImpossibilities
  )

  maxPossibilitiesInput.addEventListener('keydown', e => {
    e.preventDefault()

    const num = stringSwitch(e.code, ({ _case }) => {
      _case(NUM_REGEX, () => {
        return getNumFromCode(e.code)
      })
      _case(ARROW_REGEX, () => {
        const dir = getDirFromCode(e.code)
        let num = options.maxDisplayedPossibilities
        return dir === 'Up' || dir === 'Right' ? num + 1 : num - 1
      })
    })

    if (num) {
      const success = options.setMaxDisplayedPossibilities(num)
      if (!success) devLog('Bad Input!')
    }
  })
}

function makeOptionsReactive({
  gameStore: {
    options
  },
  elements: {
    optionsEles: {
      autoBlock,
      autoElim,
      autoElimMathImpossibilities,
      maxPossibilitiesInput,
      walkthrough,
    }
  }
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
    function renderWalkthrough() {
      walkthrough.className = options.walkthroughClassName
    },
    function renderMaxPossibilitiesInput() {
      maxPossibilitiesInput.value = options.maxDisplayedPossibilities
    },
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

export function getOptionsElements() {
  return {
    autoBlock: document.querySelector('#option-auto-block'),
    autoElim: document.querySelector('#option-auto-elim'),
    walkthrough: document.querySelector('#option-walkthrough'),
    autoElimMathImpossibilities: document
      .querySelector('#option-auto-elim-math-impossibilities'),
    maxPossibilitiesInput: document
      .querySelector('#option-max-possibilities .option_num-input'),
    maxPossibilitiesError: document
      .querySelector('#option-max-possibilities .option_error'),
  }
}
