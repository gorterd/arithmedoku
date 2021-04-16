import { setupHeaderListeners } from '../views/header_view'
import setupCollectionInfo from '../views/info_collection_view'
import setupSquareInfo from '../views/info_square_view'
import { setupOptions } from '../views/options_view'
import createSquare from '../views/square_view'

export default ({ gameStore, puzzleEle, infoBoxEle, optionsEle }) => {
  const squareTemplate = document
    .getElementById('square-template')
    .content.firstElementChild

  const squareEles = new DocumentFragment()

  gameStore.puzzle.squares.forEach(square => {
    const squareEle = createSquare(square, squareTemplate)
    squareEles.appendChild(squareEle)
  })

  puzzleEle.appendChild(squareEles)

  setupHeaderListeners(gameStore)
  setupOptions(gameStore.options, optionsEle)
  setupSquareInfo(gameStore, infoBoxEle.querySelector('.square-info'))
  setupCollectionInfo(gameStore, infoBoxEle.querySelector('.collection-info'))
}