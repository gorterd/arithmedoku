import '../styles/index.scss'
import puzzle_01 from './data/puzzle_01'
import Game from './store/game'
import mountListeners from './setup/mount_listeners'
import mountViews from './setup/mount_views'
import LRUCache from './shared/lru_cache'
import initialMount from './setup/initial_mount'
import { generateHighlightFuncs, getTemplateById, highlightEle } from './shared/dom_util'
import { onAction } from 'mobx-state-tree'
import dev from './dev'

document.addEventListener('DOMContentLoaded', () => {
  const env = {
    snapshots: {},
    history: [],
    future: [],
    puzzleCache: new LRUCache(50, 10 * 60 * 1000),
    globals: {
      size: 9,
      mistakeTimeoutMs: 600,
    },
    templates: {
      combo: getTemplateById('combo-template')
    }
  }

  initialMount(env.globals)

  const gameStore = Game.create({}, env)
  gameStore.initialize(puzzle_01)

  onAction(gameStore, (action) => {
    if (gameStore.shouldRecordAction(action)) {
      env.future = []
      env.history.push(gameStore.currentState)
    }
  })

  const game = {
    gameStore,
    puzzleEle: document.querySelector('.puzzle'),
    optionsEle: document.querySelector('.options'),
    infoBoxEle: document.querySelector('.info-box'),
  }

  mountListeners(game)
  mountViews(game)

  // DEV
  window.p = game.puzzleEle
  window.s = document.querySelectorAll('.square')[20]
  window.i = game.infoBoxEle
  window.ci = game.infoBoxEle.querySelector('.collection-info')
  window.si = game.infoBoxEle.querySelector('.square-info')
  dev(game)
})
