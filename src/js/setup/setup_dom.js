import { ICONS } from "../shared/constants"
import { kebabToCamel } from "../shared/general_util"
import { getTemplateById } from '../shared/dom_util'
import { getHeaderElements } from '../views/header_view'
import { getOptionsElements } from '../views/options_view'
import { getCollectionInfoElements } from '../views/info_collection_view'
import { getSquareInfoElements } from '../views/info_square_view'
import { getSquareElement, getSquareElementsFromId } from '../views/square_view'
import { devLog } from "../dev"

export default function setupDOM({ globals, templates }) {
  setupOptions(templates)
  setupSquareTemplate(globals, templates)
  setupSquarePossibilities(globals, templates)
  setupFilterPossibilities(globals, templates)
  setupLabels(templates)
  setupIcons()
  setupLocalizations()

  return getElements()
}

function getElements() {
  return {
    puzzleEle: document.querySelector('.puzzle'),
    infoEle: document.querySelector('.info-box'),
    squareInfoEle: document.querySelector('.square-info'),
    collectionInfoEle: document.querySelector('.collection-info'),
    headerEle: document.querySelector('.header'),
    squareInfoEles: getSquareInfoElements(),
    collectionInfoEles: getCollectionInfoElements(),
    headerEles: getHeaderElements(),
    optionsEles: getOptionsElements(),
    squareEle: getSquareElement,
    squareEles: getSquareElementsFromId,
  }
}

function setupIcons() {
  document.querySelectorAll('i').forEach(icon => {
    icon.className = ICONS[kebabToCamel(icon.className)]
  })
}

function setupSquareTemplate(globals, templates) {
  const modelPossibility = templates.square.querySelector('.square_possibility')

  for (let i = 1; i <= globals.size; i++) {
    const possibility = modelPossibility.cloneNode(true)
    possibility.dataset.val = i
    possibility.innerText = i
    modelPossibility.before(possibility)
  }

  modelPossibility.remove()
}

function setupSquarePossibilities(globals, templates) {
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

function setupFilterPossibilities(globals, templates) {
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

function setupLabels(templates) {
  document.querySelector('.info-box').prepend(
    createLabel(templates.infoLabel, {
      text: 'Square',
      id: 'square-label'
    }),
    createLabel(templates.infoLabel, {
      text: 'Cage',
      id: 'cage-label'
    }),
  )
}

function createLabel(template, { text, id }) {
  const label = template.cloneNode(true)
  label.setAttribute('id', id)
  label.querySelector('text').textContent = text
  return label
}

function setupOptions(templates) {
  const template = templates.option
  const toggleTemplate = templates.optionToggle
  const numTemplate = templates.optionNum

  const optionsData = [
    {
      inputId: 'option-auto-block',
      inputTemplate: toggleTemplate,
      infoText: 'block contradictory moves',
      hoverText: "prevents you from entering a number that's eliminated as a possibility",
    },
    {
      inputId: 'option-auto-elim',
      inputTemplate: toggleTemplate,
      infoText: 'auto-eliminate possibilities',
      hoverText: "when you enter a number, remove that number as a possibility from all the squares in the same row or column",
    },
    {
      inputId: 'option-auto-elim-math-impossibilities',
      inputTemplate: toggleTemplate,
      infoText: 'auto-eliminate mathematical impossibilities',
      hoverText: "only certain combinations of numbers can mathematically appear in a cage; eliminate those that can't",
    },
    {
      inputId: 'option-walkthrough',
      inputTemplate: toggleTemplate,
      infoText: 'always show walkthrough',
      hoverText: "always show the walkthrough upon refresh or revisiting this page",
    },
    {
      inputId: 'option-max-possibilities',
      inputTemplate: numTemplate,
      infoText: 'max possibilities to display in square',
      hoverText: "don't display the possibilites in the square itself, unless you've narrowed it down to this number or less",
    },
  ]

  const options = optionsData.map(data => createOption(template, data))

  document
    .querySelector('#header-options .header_dropdown')
    .append(...options)
}

function createOption(template, {
  infoText,
  hoverText,
  inputTemplate,
  inputId,
}) {
  const option = template.cloneNode(true)
  const input = inputTemplate.cloneNode(true)
  option.querySelector('.option_info-text').innerText = infoText
  option.querySelector('.option_hover-text').innerText = hoverText
  input.setAttribute('id', inputId)

  option.append(input)
  return option
}