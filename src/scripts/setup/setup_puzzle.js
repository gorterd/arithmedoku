import { resetEnv } from './setup_env'
import { setupSquares } from '../views/square_view'

let disposerFunc

export function newPuzzle({ gameStore, env }) {
  disposerFunc?.()
  gameStore.newPuzzle()
  resetEnv(env)
  disposerFunc = setupSquares(gameStore, env)
}

export function resetPuzzle({ gameStore, env }) {
  disposerFunc?.()
  gameStore.resetPuzzle()
  resetEnv(env)
  disposerFunc = setupSquares(gameStore, env)
}