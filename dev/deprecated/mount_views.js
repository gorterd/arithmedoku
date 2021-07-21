import { setupSquares } from '../src/scripts/views/square_view'
import { setupHeader } from '../src/scripts/views/header_view'
import { setupOptions } from '../src/scripts/views/options_view'
import { setupCollectionInfo } from '../src/scripts/views/info_collection_view'
import { setupSquareInfo } from '../src/scripts/views/info_square_view'

export default function mountViews({ gameStore, env, }) {
  setupHeader(gameStore, env)
  setupOptions(gameStore.options, env.elements.options)
  setupSquareInfo(gameStore, env.elements.infoBox)
  setupCollectionInfo(gameStore, env.elements.infoBox)
}