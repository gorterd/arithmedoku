import { ICONS } from "../shared/constants"
import { getTemplateById } from "../shared/dom_util"
import { kebabToCamel } from "../shared/general_util"

export default function initialMount() {
  setupFilter()
  setupIcons()
}

function setupIcons() {
  document.querySelectorAll('i').forEach(icon => {
    icon.className = ICONS[kebabToCamel(icon.className)]
  })
}

function setupSquarePossibilities() {

}

function setupFilter() {
  const filterTemplate = getTemplateById('filter-template')
  const filterNumTemplate = getTemplateById('filter-possibility-template')

  const filterEle = createFilter(filterTemplate, filterNumTemplate)
  filterEle.classList.add('filter')

  document.querySelector('.collection-filter')
    .append(filterEle)
}

function createFilter(filterTemplate, numTemplate, size = 9) {
  const filter = filterTemplate.cloneNode(true)
  const nums = new DocumentFragment()

  for (let i = 1; i <= size; i++) {
    const num = numTemplate.cloneNode(true)
    num.dataset.val = i
    num.querySelector('.filter-possibility_val').innerText = i
    nums.appendChild(num)
  }

  filter.prepend(nums)
  return filter
}