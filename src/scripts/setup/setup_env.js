import LRUCache from '../shared/lru_cache'
import { getTemplateById } from '../shared/dom_util'
import getPuzzles from '../data/puzzles'

export async function getNewEnv() {
  const env = getStaticEnv()
  return resetEnv(env)
}

export function resetEnv(env) {
  return Object.assign(env, {
    snapshots: {},
    history: [],
    future: [],
    puzzleCache: new LRUCache(50, 10 * 60 * 1000),
  })
}

let staticEnv
async function getStaticEnv() {
  staticEnv = staticEnv || {
    puzzles: await getPuzzles(),
    globals: {
      size: 9,
      mistakeTimeoutMs: 600,
    },
    templates: {
      square: getTemplateById('square-template'),
      combo: getTemplateById('combo-template'),
      squareInfoPossibility: getTemplateById('square-info_possibility-template'),
      filterPossibility: getTemplateById('filter-possibility-template'),
      spotlightCaption: getTemplateById('spotlight-caption-template'),
    },
    elements: {
      puzzle: document.querySelector('.puzzle'),
      options: document.querySelector('.options'),
      infoBox: document.querySelector('.info-box'),
      header: document.querySelector('.header'),
    },
  }

  return staticEnv
}