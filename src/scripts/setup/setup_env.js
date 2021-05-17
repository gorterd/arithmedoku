import LRUCache from '../shared/lru_cache'
import { getTemplateById, getTemplateNode } from '../shared/dom_util'
import puzzles from '../data/puzzles'
import { getHeaderElements } from '../views/header_view'
import { getOptionsElements } from '../views/options_view'
import { getCollectionInfoElements } from '../views/info_collection_view'
import { getSquareInfoElements } from '../views/info_square_view'
import { getSquareElement, getSquareElementsFromId } from '../views/square_view'
import { defineLazyProperties } from '../shared/general_util'
import { dbGet } from '../shared/storage_util'

export async function getNewEnv() {
  const env = {
    ...getStaticEnv(),
    ...getDefaultDynamicEnv(),
  }

  try {
    return Object.assign(env, await dbGet('env'))
  } catch (e) {
    return env
  }
}

export function resetEnv(env) {
  return Object.assign(env, getDefaultDynamicEnv())
}

export function getStaticEnv() {
  return {
    puzzles,
    globals: {
      size: 9,
      mistakeTimeoutMs: 600,
    },
    templates: {
      option: getTemplateById('option-template'),
      optionToggle: getTemplateById('option-toggle-template'),
      optionNum: getTemplateById('option-num-template'),
      square: getTemplateById('square-template'),
      combo: getTemplateById('combo-template'),
      squareInfoPossibility: getTemplateById('square-info_possibility-template'),
      filterPossibility: getTemplateById('filter-possibility-template'),
      infoLabel: getTemplateById('info-label-template'),
      spotlight: getTemplateById('spotlight-template'),
      spotlightCaption: getTemplateById('spotlight-caption-template'),
      ...getCaptionTemplates()
    },
  }
}

function getDefaultDynamicEnv() {
  return {
    snapshots: {},
    history: [],
    future: [],
    puzzleCache: new LRUCache(50, 10 * 60 * 1000),
  }
}

function getCaptionTemplates() {
  const captionTemplates = {}
  const prefix = 'caption-content-'
  const suffix = '-template'

  document.querySelectorAll(`template[id^="${prefix}"]`).forEach(template => {
    const eleName = template.id.slice(prefix.length, -1 * suffix.length)
    const key = camelize(eleName) + 'CaptionContent'
    captionTemplates[key] = getTemplateNode(template)
  })

  return captionTemplates
}

function camelize(string, separator = '-') {
  return string
    .split(separator)
    .map((word, idx) => idx > 0 ? word[0].toUpperCase() + word.slice(1) : word)
    .join('')
}