import '../styles/index.scss'
import { getNewEnv } from './setup/setup_env'
import setupDOM from './setup/setup_dom'
import setupGame from './setup/setup_game'
import { activateDevFlag, setupDev } from './dev'

if (process.env.NODE_ENV === 'development') {
  activateDevFlag()
}

document.addEventListener('DOMContentLoaded', async () => {
  const env = await getNewEnv()
  const elements = setupDOM(env)
  const gameStore = await setupGame({ env, elements })
  setupDev({ env, elements, gameStore })
})