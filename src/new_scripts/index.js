import '../styles/index.scss'
import puzzle_01 from './data/puzzle_01'
import Game from './store/game'
import mountListeners from './setup/mount_listeners'
import mountViews from './setup/mount_views'
// DEV
import remotedev from 'remotedev'
import { unprotect, getPropertyMembers, onSnapshot, onPatch, onAction, applyPatch, applySnapshot, getSnapshot } from 'mobx-state-tree'
import { connectReduxDevtools } from 'mst-middlewares'
import LRUCache from './util/lru_cache'

document.addEventListener('DOMContentLoaded', () => {
  const env = {
    snapshots: {},
    history: [],
    puzzleCache: new LRUCache(50, 10 * 60 * 1000),
    globals: {
      size: 9,
      mistakeTimeoutMs: 600,
    }
  }

  const gameStore = Game.create({}, env)
  gameStore.initialize(puzzle_01)

  onAction(gameStore, (action) => {
    if (gameStore.shouldRecordAction(action)) {
      const curState = {
        puzzle: getSnapshot(gameStore.puzzle),
        meta: getSnapshot(gameStore.meta)
      }
      env.history.push(curState)
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
})
// window.getPropertyMembers = getPropertyMembers
// window.sq = gameStore.puzzle.getSquareByPos([0, 1])
// window.c = window.sq.cage
// window.r = window.c.rules
// window.combo = [8, 9]
// window.incone = [1, 2, 3, 4, 5]