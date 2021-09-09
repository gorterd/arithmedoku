import { newPuzzle, resetPuzzle } from "../setup/setup_puzzle"
import { addNoFocusClickListener, mountDropdown } from "../shared/dom_util"

export function setupHeader({
  gameStore,
  env,
  elements,
  elements: {
    headerEles: {
      title,

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

  const thickness = 1.5
  const blur = 1

  const getHue = hueGenerator(36)
  const toggleInterval = createIntervalToggler(() => {
    const hue = getHue()
    const shadowHsl = getHsl(hue, 100, 25)
    title.style.color = getHsl(hue, 100, 78)
    title.style.textShadow = `
      0 ${thickness}px ${blur}px ${shadowHsl},
      0 -${thickness}px ${blur}px ${shadowHsl},
      ${thickness}px 0 ${blur}px ${shadowHsl},
      -${thickness}px 0 ${blur}px ${shadowHsl}
    `
  }, 50)

  title.addEventListener('click', toggleInterval)
}

export function setupInstructions({ elements }) {
  const sections = elements.headerEles.instructionsSections
  sections.forEach(section => {
    section.querySelector('h1').addEventListener('click', () => {
      section.classList.toggle('show')
      sections.forEach(otherSection => {
        if (otherSection !== section) otherSection.classList.remove('show')
      })
    })
  })
}

export function getHeaderElements() {
  return {
    title: document.getElementById('title'),
    aboutButton: document.querySelector('#header-about'),
    aboutDropdown: document.querySelector('#header-about .header_dropdown'),
    instructionsButton: document.querySelector('#header-instructions'),
    instructionsDropdown: document.querySelector('#header-instructions .header_dropdown'),
    instructionsSections: document.querySelectorAll('.instruction-section'),
    optionsButton: document.querySelector('#header-options'),
    optionsDropdown: document.querySelector('#header-options .header_dropdown'),
    undoButton: document.querySelector('#header-undo'),
    redoButton: document.querySelector('#header-redo'),
    newButton: document.querySelector('#header-new'),
    resetButton: document.querySelector('#header-reset'),
  }
}

function hueGenerator(initial) {
  const nearPrimary = hue => [
    [0, 30],
    [90, 150],
    [210, 270],
    [330, 360]
  ].some(([min, max]) => hue >= min && hue <= max)

  let hue = initial
  return () => {
    const diff = nearPrimary(hue) ? 6 : 2
    return hue = (hue + diff) % 360
  }
}

function createIntervalToggler(cb, rate, fireImmediately = true) {
  let id = null
  return (...args) => {
    if (id) {
      clearInterval(id)
      id = null
    } else {
      if (fireImmediately) cb(...args)
      id = setInterval(() => cb(...args), rate)
    }
  }
}


function getHsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`
}