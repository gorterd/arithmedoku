import './styles/index.scss'
import App from './scripts/App'

document.addEventListener('DOMContentLoaded', () => {
  const puzzleDiv = document.querySelector('.gm-puzzle');
  const squareInfoDiv = document.querySelector('.gm-info-sqr');
  const groupInfoDiv = document.querySelector('.gm-info-grp');

  const app = new App(puzzleDiv, squareInfoDiv, groupInfoDiv);
})