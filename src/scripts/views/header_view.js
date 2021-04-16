import { mountDropdown } from "../shared/dom_util"

export function setupHeaderListeners(gameStore) {
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
  } = getHeaderElements()

  mountDropdown(aboutButton, aboutDropdown, 'show')
  mountDropdown(instructionsButton, instructionsDropdown, 'show')
  mountDropdown(optionsButton, optionsDropdown, 'show')
  undoButton.addEventListener('click', () => gameStore.undo())
  redoButton.addEventListener('click', () => gameStore.redo())
}

function getHeaderElements() {
  const headerEle = document.querySelector('.header')

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