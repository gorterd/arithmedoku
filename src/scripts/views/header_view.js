import { newPuzzle, resetPuzzle } from "../setup/setup_puzzle"
import { addNoFocusClickListener, mountDropdown } from "../shared/dom_util"

export function setupHeader({ gameStore, env }) {
  const {
    aboutButton,
    aboutDropdown,

    instructionsButton,
    instructionsDropdown,

    optionsButton,
    optionsDropdown,

    undoButton,
    redoButton,
    newButton,
    resetButton,
  } = getHeaderElements(env.elements.header)

  mountDropdown(aboutButton, aboutDropdown, 'show')
  mountDropdown(instructionsButton, instructionsDropdown, 'show')
  mountDropdown(optionsButton, optionsDropdown, 'show')

  addNoFocusClickListener(undoButton, gameStore.undo)
  addNoFocusClickListener(redoButton, gameStore.redo)
  addNoFocusClickListener(newButton, () => newPuzzle({ gameStore, env }))
  addNoFocusClickListener(resetButton, () => resetPuzzle({ gameStore, env }))
}

function getHeaderElements(headerEle) {
  return {
    aboutButton: headerEle.querySelector('#header-about'),
    aboutDropdown: headerEle.querySelector('#header-about .header_dropdown'),
    instructionsButton: headerEle.querySelector('#header-instructions'),
    instructionsDropdown: headerEle.querySelector('#header-instructions .header_dropdown'),
    optionsButton: headerEle.querySelector('#header-options'),
    optionsDropdown: headerEle.querySelector('#header-options .header_dropdown'),
    undoButton: headerEle.querySelector('#header-undo'),
    redoButton: headerEle.querySelector('#header-redo'),
    newButton: headerEle.querySelector('#header-new'),
    resetButton: headerEle.querySelector('#header-reset'),
  }
}