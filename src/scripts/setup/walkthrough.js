import { addNoFocusClickListener, createSVGElement, getTemplateById } from "../shared/dom_util"
import { stringSwitch } from "../shared/general_util"
import Spotlight from "../shared/spotlight"

export default ({ gameStore, env, elements }) => {
  const caption = env.templates.spotlightCaption.cloneNode(true)
  const svg = env.templates.spotlight.cloneNode(true)

  let cleanup = () => { }

  const steps = getSpotlights({ gameStore, env, elements }).map(spotlight => () => {
    cleanup()

    const update = () => {
      spotlight.updateSVG({ element: svg, regenerate: true })
      spotlight.updateCaption({ element: caption, regenerate: false })
    }

    if (spotlight.captionContent) {
      caption.querySelector('.caption-content')?.remove()
      caption.prepend(spotlight.captionContent)
    }

    const cleanupShow = spotlight.onShow()
    window.addEventListener('resize', update)
    cleanup = () => {
      window.removeEventListener('resize', update)
      cleanupShow()
    }
    // debugger
    update()
    appendIfRemoved(svg, caption)
  })

  return new Promise((resolve) => {
    const finish = () => {
      cleanup()
      svg.remove()
      caption.remove()

      document.removeEventListener('keydown', handleKeydown, true)
      resolve()
    }
    steps.push(finish)

    const { nextBtn, previousBtn, finishBtn } = getCaptionElements(caption)
    let curStep = 0

    const next = () => steps[++curStep]()

    const prev = () => {
      if (curStep > 0) steps[--curStep]()
    }

    addNoFocusClickListener(nextBtn, next)
    addNoFocusClickListener(previousBtn, prev)
    addNoFocusClickListener(finishBtn, finish)

    function handleKeydown(e) {
      stringSwitch(e.code, ({ _case }) => {
        _case('KeyN', next)
        _case('KeyP', prev)
        _case('KeyF', finish)
        // e.stopImmediatePropagation()
      })
    }

    document.addEventListener('keydown', handleKeydown, true)

    steps[curStep]()
  })
}

// function getSpotlights({
//   gameStore,
//   env: {
//     templates: {
//       puzzleCaptionContent,
//       infoCaptionContent,
//       squareInfoCaptionContent,
//       collectionInfoCaptionContent,
//       instructionsCaptionContent,
//     }
//   },
//   elements: {
//     puzzleEle,
//     infoEle,
//     squareInfoEle,
//     collectionInfoEle,
//     headerEles: {
//       instructionsButton,
//       instructionsDropdown,
//     },
//   }
// }) {
//   const cageSquares = getCageSquares(gameStore)
//   const squareEle = cageSquares[0]

//   return [
//     Spotlight.fromEle(puzzleEle, {
//       padding: 5,
//       borderRadius: 8,
//       captionContent: puzzleCaptionContent.cloneNode(true),
//     }),
//     Spotlight.fromEle(infoEle, {
//       padding: { default: 6, left: 8 },
//       borderRadius: 8,
//       blur: 1.5,
//       captionPosition: 'left',
//       captionOffsetX: '-10px',
//       captionOffsetY: '50px',
//       captionContent: infoCaptionContent.cloneNode(true),
//     }),
//     Spotlight.fromEles([squareEle, squareInfoEle], {
//       padding: [0, { default: 0, top: -10, bottom: -20 }],
//       borderRadius: 2,
//       blur: 1,
//       captionPosition: 'bottom',
//       captionContent: squareInfoCaptionContent.cloneNode(true),
//       onShow: () => {
//         gameStore.selectSquareById(squareEle.dataset.id)
//         return () => {
//           gameStore.clearFocus()
//           gameStore.ui.clearSelectedSquares()
//         }
//       }
//     }),
//     Spotlight.fromEles([...cageSquares, collectionInfoEle], {
//       padding: [
//         ...Array(cageSquares.length).fill(0.5),
//         {
//           // default: 0,
//           top: 26,
//           bottom: -10,
//         }
//       ],
//       borderRadius: 2,
//       blur: 1,
//       captionPosition: 'bottom',
//       captionContent: collectionInfoCaptionContent.cloneNode(true),
//       onShow: () => {
//         gameStore.selectSquareById(squareEle.dataset.id)
//         return () => {
//           gameStore.clearFocus()
//           gameStore.ui.clearSelectedSquares()
//         }
//       }
//     }),
//     Spotlight.fromEles([instructionsButton, instructionsDropdown], {
//       padding: [{ right: 7, bottom: 7, default: 4 }, { default: 6, top: 4 }],
//       borderRadius: 8,
//       blur: 2,
//       captionPosition: 'right',
//       captionContent: instructionsCaptionContent.cloneNode(true),
//       onShow: () => {
//         instructionsDropdown.classList.add('show')
//         return () => instructionsDropdown.classList.remove('show')
//       },
//     }),
//   ]
// }

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

function createSVG() {
  return getTemplateById('spotlight-template').cloneNode(true)
}

function appendIfRemoved(...eles) {
  const removedEles = eles.filter(ele => !document.body.contains(ele))
  document.body.append(...removedEles)
}

function getSpotlights({
  gameStore,
  env: {
    templates: {
      puzzleCaptionContent,
      infoCaptionContent,
      squareInfoCaptionContent,
      collectionInfoCaptionContent,
      instructionsCaptionContent,
      optionsCaptionContent,
    }
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

  const puzzleSpotlight = Spotlight.fromEle(puzzleEle, {
    padding: 5,
    borderRadius: 8,
    captionContent: puzzleCaptionContent.cloneNode(true),
  })

  const infoSpotlight = Spotlight.fromEle(infoEle, {
    padding: { default: 6, left: 8 },
    borderRadius: 8,
    blur: 1.5,
    captionPosition: 'left',
    captionOffsetX: '-10px',
    captionOffsetY: '50px',
    captionContent: infoCaptionContent.cloneNode(true),
  })

  const squareInfoSpotlight = Spotlight.fromEles([squareEle, squareInfoEle], {
    padding: [0, { default: 0, top: -10, bottom: -20 }],
    borderRadius: 2,
    blur: 1,
    captionPosition: 'bottom',
    captionContent: squareInfoCaptionContent.cloneNode(true),
  })

  const selectionSpotlight = Spotlight.fromEles([squareEle, squareEle2, squareInfoEle], {
    padding: [0, 0, { default: 0, top: -10, bottom: -20 }],
    borderRadius: 2,
    blur: 1,
    captionPosition: 'bottom',
    captionContent: squareInfoCaptionContent.cloneNode(true),
  })

  const cageSpotlight = Spotlight.fromEles([...cageSquares], {
    padding: 0.5,
    borderRadius: 2,
    blur: 1,
    captionPosition: 'bottom',
    captionContent: collectionInfoCaptionContent.cloneNode(true),
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
    captionPosition: 'bottom',
    captionContent: collectionInfoCaptionContent.cloneNode(true),
  })

  const optionsSpotlight = Spotlight.fromEles([optionsButton, optionsDropdown], {
    padding: [{ right: 7, bottom: 7, default: 4 }, { default: 6, top: 4 }],
    borderRadius: 8,
    blur: 2,
    captionPosition: 'bottom',
    captionContent: optionsCaptionContent.cloneNode(true),
    onShow: () => {
      optionsDropdown.classList.add('show')
      return () => optionsDropdown.classList.remove('show')
    },
  })

  const instructionsSpotlight = Spotlight.fromEles([instructionsButton, instructionsDropdown], {
    padding: [{ right: 7, bottom: 7, default: 4 }, { default: 6, top: 4 }],
    borderRadius: 8,
    blur: 2,
    captionPosition: 'right',
    captionContent: instructionsCaptionContent.cloneNode(true),
    onShow: () => {
      instructionsDropdown.classList.add('show')
      return () => instructionsDropdown.classList.remove('show')
    },
  })

  return [
    puzzleSpotlight,
    infoSpotlight,
    cageSpotlight,
    cageInfoSpotlight.dup({
      onShow: () => {
        selectSquare(squareEle)
        return () => clearFocusAndFilter(gameStore)
      }
    }),
    cageInfoSpotlight.dup({
      onShow: () => {
        selectSquare(squareEle)
        toggleAnd(gameStore)

        return () => clearFocusAndFilter(gameStore)
      }
    }),
    cageInfoSpotlight.dup({
      onShow: () => {
        selectSquare(squareEle)
        toggleNot(gameStore)

        return () => clearFocusAndFilter(gameStore)
      }
    }),
    cageInfoSpotlight.dup({
      onShow: () => {
        selectSquare(squareEle)
        toggleOr(gameStore)

        return () => clearFocusAndFilter(gameStore)
      }
    }),
    cageInfoSpotlight.dup({
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