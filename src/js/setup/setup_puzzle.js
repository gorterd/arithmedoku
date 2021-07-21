import { resetEnv } from './setup_env'
import { setupSquares } from '../views/square_view'

let disposerFunc

export function setupPuzzle(game) {
  disposerFunc = setupSquares(game)
  return disposerFunc
}

export function resetPuzzle(game) {
  game.gameStore.resetPuzzle()
  resetEnv(game.env)
}

export function newPuzzle(game) {
  disposerFunc?.()
  game.gameStore.newPuzzle()
  resetEnv(game.env)
  disposerFunc = setupSquares(game)
}

