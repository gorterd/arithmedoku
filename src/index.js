import './styles/index.scss'
import Game from './scripts/Game'

document.addEventListener('DOMContentLoaded', () => {
  let puzzleDiv = document.querySelector('gm-puzzle');
  let squareInfoDiv = document.querySelector('gm-info-sqr');
  let groupInfoDiv = document.querySelector('gm-info-grp');

  let game = new Game(puzzleDiv, squareInfoDiv, groupInfoDiv);
  game.newPuzzle();
})