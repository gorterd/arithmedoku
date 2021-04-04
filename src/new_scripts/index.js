import '../styles/index.scss'
import { unprotect, getPropertyMembers } from 'mobx-state-tree'
import { connectReduxDevtools } from 'mst-middlewares'
import remotedev from 'remotedev'
import puzzle_01 from './data/puzzle_01'
import Game from './store_types/game'
import mountListeners from './reactions/mount_listeners'
import mountViews from './reactions/mount_views'

document.addEventListener('DOMContentLoaded', () => {
  const puzzleEle = document.querySelector('.puzzle');
  const infoBoxEle = document.querySelector('.info-box');

  const env = {
    snapshots: {},
    considerations: {},
    implications: {},
    active: {
      main: null,
      consideration: null,
      implication: null,
    },
    globals: {
      size: 9,
      mistakeTimeoutMs: 600,
    }
  }

  const gameStore = Game.create({}, env)
  gameStore.initialize(puzzle_01)
  env.active.main = gameStore.puzzle.uuid

  const game = { gameStore, puzzleEle, infoBoxEle }

  mountListeners(game)
  mountViews(game)

  // DEV
  connectReduxDevtools(remotedev, gameStore)
  unprotect(gameStore)
  window.gameStore = gameStore

  window.sq = gameStore.puzzle.getSquareByPos([0, 1])
  window.c = window.sq.cage
  window.r = window.c.rules
  window.combo = [8, 9]
  window.incone = [1, 2, 3, 4, 5]
  window.getPropertyMembers = getPropertyMembers
})