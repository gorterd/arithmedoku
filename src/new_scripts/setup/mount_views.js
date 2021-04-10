import { setupHeaderListeners } from '../views/header_view'
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
}

/*

Separate out the render actions of square into new, view file

View files correspond to html templates from our page.
  * not necessarily a 1:1 relationship with stores, but could be (e.g. a square in the puzzle and a square's store have 1:1 relationship, but the square possibilities in the infobox contain data from both group and square)

Mount: reaction to the sort of determinative data (focused group for infobox; e.g.) of the view, could also reset some variables for elements of view

Reactive Updates: autorun for surgical dom updates

Unmount: When determinative changes away, unsubscribe all the autoruns



*/