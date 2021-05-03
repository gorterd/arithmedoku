import { ICONS } from "../shared/constants"
import { kebabToCamel } from "../shared/general_util"

export default function setupDOM(env) {
  setupSquarePossibilities(env)
  setupFilterPossibilities(env)
  setupIcons(env)
  setupLocalizations(env)
}

function setupIcons() {
  document.querySelectorAll('i').forEach(icon => {
    icon.className = ICONS[kebabToCamel(icon.className)]
  })
}

function setupSquarePossibilities({ globals, templates }) {
  const squarePossibilities = new DocumentFragment()

  for (let i = 1; i <= globals.size; i++) {
    const possibility = templates.squareInfoPossibility.cloneNode(true)
    possibility.dataset.val = i
    possibility.querySelector('.square-info_possibility-val').innerText = i
    squarePossibilities.appendChild(possibility)
  }

  document.querySelector('.square-info')
    .prepend(squarePossibilities)
}

function setupFilterPossibilities({ globals, templates }) {
  const filterPossibilities = new DocumentFragment()

  for (let i = 1; i <= globals.size; i++) {
    const possibility = templates.filterPossibility.cloneNode(true)
    possibility.dataset.val = i
    possibility.querySelector('.filter-possibility_val').innerText = i
    filterPossibilities.appendChild(possibility)
  }

  document.querySelector('.filter-possibilities')
    .prepend(filterPossibilities)
}

function setupLocalizations() {
  const metaKey = window.navigator.platform.startsWith('Win') ? '⌃' : '⌘'
  document.querySelector('#header-undo .keyboard').innerText = `${metaKey}z`
  document.querySelector('#header-redo .keyboard').innerText = `${metaKey}y`
}

