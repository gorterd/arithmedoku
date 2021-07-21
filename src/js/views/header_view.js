import { newPuzzle, resetPuzzle } from "../setup/setup_puzzle"
import { addNoFocusClickListener, mountDropdown } from "../shared/dom_util"

export function setupHeader({
  gameStore,
  env,
  elements,
  elements: {
    headerEles: {
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
    }
  }
}) {
  mountDropdown(aboutButton, aboutDropdown, 'show')
  mountDropdown(instructionsButton, instructionsDropdown, 'show')
  mountDropdown(optionsButton, optionsDropdown, 'show')

  addNoFocusClickListener(undoButton, gameStore.undo)
  addNoFocusClickListener(redoButton, gameStore.redo)
  addNoFocusClickListener(newButton, () => newPuzzle({ gameStore, env, elements }))
  addNoFocusClickListener(resetButton, () => resetPuzzle({ gameStore, env, elements }))
}

export function getHeaderElements() {
  return {
    aboutButton: document.querySelector('#header-about'),
    aboutDropdown: document.querySelector('#header-about .header_dropdown'),
    instructionsButton: document.querySelector('#header-instructions'),
    instructionsDropdown: document.querySelector('#header-instructions .header_dropdown'),
    optionsButton: document.querySelector('#header-options'),
    optionsDropdown: document.querySelector('#header-options .header_dropdown'),
    undoButton: document.querySelector('#header-undo'),
    redoButton: document.querySelector('#header-redo'),
    newButton: document.querySelector('#header-new'),
    resetButton: document.querySelector('#header-reset'),
  }
}