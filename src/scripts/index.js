import '../styles/index.scss'
import puzzle_01 from './data/puzzle_01'
import Game from './store/game'
import mountListeners from './setup/mount_listeners'
import mountViews from './setup/mount_views'
import LRUCache from './shared/lru_cache'
// DEV
import remotedev from 'remotedev'
import { unprotect, onAction, applySnapshot, getSnapshot } from 'mobx-state-tree'
import { connectReduxDevtools } from 'mst-middlewares'
import { ICONS } from './shared/constants'
import initialMount from './setup/initial_mount'
import { getTemplateById } from './shared/dom_util'

document.addEventListener('DOMContentLoaded', () => {
  initialMount()
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
      combination: getTemplateById('combination-template')
    }
  }

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
  connectReduxDevtools(remotedev, gameStore)
  unprotect(gameStore)

  window.gs = gameStore
  window.lru = LRUCache
  window.getSnap = getSnapshot
  window.applySnap = applySnapshot
  window.icons = ICONS
})
