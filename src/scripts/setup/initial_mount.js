import { ICONS } from "../shared/constants"
import { getTemplateById } from "../shared/dom_util"
import { kebabToCamel } from "../shared/general_util"

export default function initialMount(globals) {
  setupSquarePossibilities(globals)
  setupFilterPossibilities(globals)
  setupIcons(globals)
}

function setupIcons() {
  document.querySelectorAll('i').forEach(icon => {
    icon.className = ICONS[kebabToCamel(icon.className)]
  })
}

function setupSquarePossibilities({ size }) {
  const template = getTemplateById('square-info_possibility-template')
  const squarePossibilities = new DocumentFragment()

  for (let i = 1; i <= size; i++) {
    const possibility = template.cloneNode(true)
    possibility.dataset.val = i
    possibility.querySelector('.square-info_possibility-val').innerText = i
    squarePossibilities.appendChild(possibility)
  }

  document.querySelector('.square-info')
    .prepend(squarePossibilities)
}

function setupFilterPossibilities({ size }) {
  const template = getTemplateById('filter-possibility-template')
  const filterPossibilities = new DocumentFragment()

  for (let i = 1; i <= size; i++) {
    const possibility = template.cloneNode(true)
    possibility.dataset.val = i
    possibility.querySelector('.filter-possibility_val').innerText = i
    filterPossibilities.appendChild(possibility)
  }

  document.querySelector('.filter-possibilities')
    .prepend(filterPossibilities)
}
