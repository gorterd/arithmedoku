import { setupHeader } from '../views/header_view'
import { setupOptions } from '../views/options_view'
import { setupCollectionInfo } from '../views/info_collection_view'
import { setupSquareInfo } from '../views/info_square_view'
import mountKeyboardListeners from './listeners/keyboard_listeners'
import mountClickListeners from './listeners/click_listeners'
import { setupPuzzle } from './setup_puzzle'
import walkthrough from './walkthrough'
import Game from '../store/game'

export default async function setupGame({ env, elements }) {
  const gameStore = await createGameStore(env)
  const game = { gameStore, env, elements }

  setupOptions(game)
  setupSquareInfo(game)
  setupCollectionInfo(game)

  const snapshot = await gameStore.retrieveStoredSnapshot()
  if (!snapshot || snapshot.options.walkthrough) {
    const teardownSquares = setupPuzzle(game)
    await walkthrough(game)
    teardownSquares()
  }

  gameStore.applyStoredSnapshot()
  gameStore.attachHooks()

  setupPuzzle(game)
  setupHeader(game)
  mountClickListeners(game)
  mountKeyboardListeners(game)

  return gameStore
}

async function createGameStore(env) {
  const gameStore = Game.create({}, env)
  gameStore.initialize()
  return gameStore
}