import '../styles/index.scss'
import { onAction } from 'mobx-state-tree'
import Game from './store/game'
import { getNewEnv } from './setup/setup_env'
import setupDOM from './setup/setup_dom'
import setupGame from './setup/setup_game'
import { resetPuzzle } from './setup/setup_puzzle'
import dev from './dev'

document.addEventListener('DOMContentLoaded', async () => {
  const env = await getNewEnv()
  setupDOM(env)

  const game = createGame(env)
  await setupGame(game)

  // DEV
  window.env = env
  dev(game)
})

function createGame(env) {
  const gameStore = Game.create({}, env)

  onAction(gameStore, (action) => {
    if (gameStore.shouldRecordAction(action)) {
      env.future = []
      env.history.push(gameStore.currentState)
    }
  })

  return { gameStore, env }
}