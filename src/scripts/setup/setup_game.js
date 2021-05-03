import { setupHeader } from '../views/header_view'
import { setupOptions } from '../views/options_view'
import { setupCollectionInfo } from '../views/info_collection_view'
import { setupSquareInfo } from '../views/info_square_view'
import mountKeyboardListeners from './listeners/keyboard_listeners'
import mountClickListeners from './listeners/click_listeners'
import { resetPuzzle } from './setup_puzzle'
import walkthrough from './walkthrough'

export default async function setupGame(game) {
  setupOptions(game)
  setupSquareInfo(game)
  setupCollectionInfo(game)
  resetPuzzle(game)
  await walkthrough(game)

  setupHeader(game)
  mountKeyboardListeners(game)
  mountClickListeners(game)
}
