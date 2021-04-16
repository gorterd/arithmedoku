import { ICONS } from "../shared/constants"
import { getTemplateById } from "../shared/dom_util"
import { kebabToCamel } from "../shared/general_util"

export default function initialMount() {
  setupRules()
  setupIcons()
}

function setupIcons() {
  document.querySelectorAll('i').forEach(icon => {
    if (icon.className === 'banned' && document.querySelector('.collection-rules').contains(icon)) {
      console.log(icon.className)
      console.log(ICONS.banned)
    }
    icon.className = ICONS[kebabToCamel(icon.className)]
  })
}

function setupRules() {
  const ruleTemplate = getTemplateById('rule-template')
  const ruleNumTemplate = getTemplateById('rule-num-template')

  const ruleEle = createRule(ruleTemplate, ruleNumTemplate)
  ruleEle.classList.add('collection-rule')

  document.querySelector('.collection-rules')
    .append(ruleEle)
}

function createRule(ruleTemplate, numTemplate, size = 9) {
  const rule = ruleTemplate.cloneNode(true)
  const nums = new DocumentFragment()

  for (let i = 1; i <= size; i++) {
    const num = numTemplate.cloneNode(true)
    num.dataset.val = i
    num.querySelector('.collection-rule_possibility-val').innerText = i
    nums.appendChild(num)
  }

  rule.prepend(nums)
  return rule
}