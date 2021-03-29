import './styles/index.scss'
import App from './scripts/App'
import gameStore from './scripts/mst_store/create_store'
window.gameStore = gameStore

document.addEventListener('DOMContentLoaded', () => {
  const puzzleDiv = document.querySelector('.gm-puzzle');
  const squareInfoDiv = document.querySelector('.gm-info-sqr');
  const groupInfoDiv = document.querySelector('.gm-info-grp');

  // const app = new App(puzzleDiv, squareInfoDiv, groupInfoDiv);
  puzzleDiv.innerHTML = gameStore.puzzle.initialHtml
  puzzleDiv.addEventListener('click', e => {
    const pos = e.target.closest('.square').dataset.pos.split(',')
    gameStore.ui.selectSquareByPos(pos)
  })

  document.addEventListener('keydown', e => {
    gameStore.ui.selectSquareByKey(e.key)
  })
})