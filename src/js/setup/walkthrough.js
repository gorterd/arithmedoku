import { addNoFocusClickListener } from "../shared/dom_util"
import { stringSwitch } from "../shared/general_util"
import Spotlight from "../shared/spotlight"

export default (game) => new Promise(resolve => {
  const caption = game.env.templates.spotlightCaption.cloneNode(true)
  const svg = game.env.templates.spotlight.cloneNode(true)
  const { nextBtn, previousBtn, finishBtn } = getCaptionElements(caption)

  let cleanup = () => { }
  const spotlights = getSpotlights(game)
  const steps = spotlights.map((spotlight, idx) => () => {
    if (idx === 0) previousBtn.classList.add('hide')
    if (idx + 1 === spotlights.length) nextBtn.classList.add('hide')
    cleanup()

    const update = () => {
      spotlight.generate()
      spotlight.updateSVG(svg)
      spotlight.updateCaption(caption)
    }

    caption.querySelector('.caption-content')?.remove()
    caption.prepend(spotlight.captionContent)

    const cleanupShow = spotlight.onShow()
    addEventListener('resize', update)
    cleanup = () => {
      if (idx === 0) previousBtn.classList.remove('hide')
      if (idx + 1 === spotlights.length) nextBtn.classList.remove('hide')
      removeEventListener('resize', update)
      cleanupShow()
    }

    update()
    appendIfRemoved(svg, caption)
  })

  let curStep = 0
  const next = () => curStep < steps.length - 1 && steps[++curStep]()
  const prev = () => curStep > 0 && steps[--curStep]()
  const finish = () => {
    cleanup()
    svg.remove()
    caption.remove()
    document.removeEventListener('keydown', handleKeydown, true)
    resolve()
  }

  addNoFocusClickListener(nextBtn, next)
  addNoFocusClickListener(previousBtn, prev)
  addNoFocusClickListener(finishBtn, finish)

  const handleKeydown = e => {
    stringSwitch(e.code, ({ _case }) => {
      _case('ArrowRight', next)
      _case('ArrowLeft', prev)
      _case('Enter', finish)
    })
  }

  document.addEventListener('keydown', handleKeydown, true)

  steps[curStep]()
})

function getSpotlights({
  gameStore,
  env: {
    templates
  },
  elements: {
    puzzleEle,
    infoEle,
    squareInfoEle,
    collectionInfoEle,
    headerEles: {
      instructionsButton,
      instructionsDropdown,
      optionsButton,
      optionsDropdown,
    },
  }
}) {
  const cageSquares = getCageSquares(gameStore)
  const squareEle = cageSquares[0]
  const squareEle2 = cageSquares[1]

  const selectSquare = (square) => gameStore.selectSquareById(square.dataset.id)

  const introSpotlight = Spotlight.blank({
    captionPosition: 'middle',
    captionOffsetX: '50vw',
    captionOffsetY: '50vh',
    captionContent: templates.introCaptionContent.cloneNode(true),
  })

  const puzzleSpotlight = Spotlight.fromEle(puzzleEle, {
    padding: 5,
    borderRadius: 8,
    captionPosition: 'right',
    captionOffsetX: '20px',
    captionContent: templates.puzzleCaptionContent.cloneNode(true),
  })

  const cageSpotlight = Spotlight.fromEles([...cageSquares], {
    padding: 0.5,
    borderRadius: 2,
    blur: 1,
    captionPosition: 'right',
    captionOffsetX: '20px',
    captionContent: templates.cageCaptionContent.cloneNode(true),
  })

  const infoSpotlight = Spotlight.fromEle(infoEle, {
    padding: { default: 6, left: 8 },
    borderRadius: 8,
    blur: 1.5,
    captionPosition: 'left',
    captionOffsetX: '-20px',
    captionContent: templates.infoCaptionContent.cloneNode(true),
  })

  const cageInfoSpotlight = Spotlight.fromEles([...cageSquares, collectionInfoEle], {
    padding: [
      ...Array(cageSquares.length).fill(0.5),
      {
        top: 26,
        bottom: -10,
      }
    ],
    borderRadius: 2,
    blur: 1,
    anchorEle: cageSquares.length,
    captionPosition: 'bottomLeft',
    captionOffsetX: '-20px',
    captionOffsetY: '-100%',
  })

  const squareInfoSpotlight = Spotlight.fromEles([squareEle, squareInfoEle], {
    padding: [0, { default: 0, top: -10, bottom: -20 }],
    borderRadius: 2,
    blur: 1,
    anchorEle: 1,
    captionOffsetX: '-20px',
    captionPosition: 'left',
    captionOffsetY: '50%',
    captionContent: templates.squareInfoCaptionContent.cloneNode(true),
  })

  const selectionSpotlight = Spotlight.fromEles([squareEle, squareEle2, squareInfoEle], {
    padding: [0, 0, { default: 0, top: -10, bottom: -20 }],
    borderRadius: 2,
    blur: 1,
    anchorEle: 2,
    captionPosition: 'left',
    captionOffsetX: '-20px',
    captionOffsetY: '50%',
    captionContent: templates.selectionInfoCaptionContent.cloneNode(true),
  })

  const optionsSpotlight = Spotlight.fromEles([optionsButton, optionsDropdown], {
    padding: [{ right: 7, bottom: 7, default: 4 }, { default: 6, top: 4 }],
    borderRadius: 8,
    blur: 2,
    anchorEle: 1,
    captionPosition: 'right',
    captionOffsetX: '10px',
    captionContent: templates.optionsCaptionContent.cloneNode(true),
    onShow: () => {
      optionsButton.classList.add('show')
      return () => {
        optionsButton.classList.remove('show')
        optionsButton.blur()
      }
    },
  })

  const instructionsSpotlight = Spotlight.fromEles([instructionsButton, instructionsDropdown], {
    padding: [{ right: 7, bottom: 7, default: 4 }, { default: 6, top: 4 }],
    borderRadius: 8,
    blur: 2,
    anchorEle: 1,
    captionPosition: 'right',
    captionOffsetX: '10px',
    captionContent: templates.instructionsCaptionContent.cloneNode(true),
    onShow: () => {
      instructionsButton.classList.add('show')
      let refresh = () => {
        instructionsSpotlight.generate()
        instructionsSpotlight.updateSVG()
      }

      instructionsButton.addEventListener('click', refresh)
      return () => {
        removeEventListener('click', refresh)
        instructionsButton.classList.remove('show')
        instructionsButton.blur()
      }
    },
  })

  return [
    introSpotlight,
    puzzleSpotlight,
    cageSpotlight,
    infoSpotlight,
    cageInfoSpotlight.dup({
      captionPosition: 'left',
      captionOffsetY: '-50%',
      captionContent: templates.cageInfoCombosCaptionContent.cloneNode(true),
      onShow: () => {
        selectSquare(squareEle)
        return () => clearFocusAndFilter(gameStore)
      }
    }),
    cageInfoSpotlight.dup({
      captionContent: templates.cageInfoTabsCaptionContent.cloneNode(true),
      onShow: () => {
        selectSquare(squareEle)
        return () => clearFocusAndFilter(gameStore)
      }
    }),
    cageInfoSpotlight.dup({
      captionContent: templates.cageInfoAndCaptionContent.cloneNode(true),
      onShow: () => {
        selectSquare(squareEle)
        toggleAnd(gameStore)

        return () => clearFocusAndFilter(gameStore)
      }
    }),
    cageInfoSpotlight.dup({
      captionContent: templates.cageInfoNotCaptionContent.cloneNode(true),
      onShow: () => {
        selectSquare(squareEle)
        toggleNot(gameStore)

        return () => clearFocusAndFilter(gameStore)
      }
    }),
    cageInfoSpotlight.dup({
      captionContent: templates.cageInfoOrCaptionContent.cloneNode(true),
      onShow: () => {
        selectSquare(squareEle)
        toggleOr(gameStore)

        return () => clearFocusAndFilter(gameStore)
      }
    }),
    cageInfoSpotlight.dup({
      captionContent: templates.cageInfoAllFiltersCaptionContent.cloneNode(true),
      onShow: () => {
        selectSquare(squareEle)
        toggleOr(gameStore)
        toggleNot(gameStore)
        toggleAnd(gameStore)

        return () => clearFocusAndFilter(gameStore)
      }
    }),
    squareInfoSpotlight.dup({
      onShow: () => {
        selectSquare(squareEle)

        toggleOr(gameStore)
        toggleNot(gameStore)
        toggleAnd(gameStore)

        gameStore.toggleFocusedSquarePossibility(4)
        gameStore.toggleFocusedSquarePossibility(6)

        return () => {
          gameStore.resetFocusedSquarePossibilities()
          clearFocusAndFilter(gameStore)
        }
      }
    }),
    selectionSpotlight.dup({
      onShow: () => {
        selectSquare(squareEle)
        gameStore.ui.selectThroughSquare(squareEle2.dataset.id)

        toggleOr(gameStore)
        toggleNot(gameStore)
        toggleAnd(gameStore)

        gameStore.toggleSelectionPossibility(4)
        gameStore.toggleSelectionPossibility(6)

        return () => {
          gameStore.resetFocusedSquarePossibilities()
          selectSquare(squareEle2)
          gameStore.resetFocusedSquarePossibilities()
          clearFocusAndFilter(gameStore)
        }
      }
    }),
    optionsSpotlight,
    instructionsSpotlight,
  ]
}

function getCaptionElements(captionEle) {
  return {
    nextBtn: captionEle.querySelector('#spotlight-next'),
    previousBtn: captionEle.querySelector('#spotlight-previous'),
    finishBtn: captionEle.querySelector('#spotlight-finish'),
  }
}

function getCageSquares(gameStore) {
  const cornerCage = gameStore.puzzle.cagesArray
    .find(cage => cage.numPossibleRepeats > 0 && cage.result === 15)

  return Array.from(cornerCage.squares.map(square =>
    document.querySelector(`.square[data-id="${square.id}"]`)
  ))
}

function appendIfRemoved(...eles) {
  const removedEles = eles.filter(ele => !document.body.contains(ele))
  document.body.append(...removedEles)
}

function toggleAnd(gameStore) {
  gameStore.ui.setFilterMode('and')

  gameStore.toggleFilterPossibility(4)
}

function toggleNot(gameStore) {
  gameStore.ui.setFilterMode('not')

  gameStore.toggleFilterPossibility(1)
  gameStore.toggleFilterPossibility(6)
  gameStore.toggleFilterPossibility(8)
}

function toggleOr(gameStore) {
  gameStore.ui.setFilterMode('or')

  gameStore.toggleFilterPossibility(2)
  gameStore.toggleFilterPossibility(7)
}

function clearFocusAndFilter(gameStore) {
  gameStore.clearFilter()
  gameStore.clearFocus()
  gameStore.ui.clearSelectedSquares()
}
