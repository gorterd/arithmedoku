import PUZZLES from './puzzles/puzzles';

import Puzzle from './game_components/Puzzle';

import { mountListeners } from './listeners/listeners.js';

export default class App {

  constructor(puzzleDiv, squareInfoDiv, groupInfoDiv){
    this.divs = { puzzleDiv, squareInfoDiv, groupInfoDiv }
    this.opts = {
      block: true,
      autoElim: true,
      limit: null
    }
    this.init();
  }

  init() {
    this.createPuzzle(this.randomPuzzle());
  }

  createPuzzle(puzzle) {
    this.puzzle = puzzle;
    this.puzzle.render();
    mountListeners(this);
  }

  newPuzzle() {
    this.clearPuzzle();
    this.init();
  }

  clearPuzzle(){
    this.divs.puzzleDiv.innerHTML = '';
    this.divs.puzzleDiv.className = 'gm-puzzle';
    // this.divs.squareInfoDiv.innerHTML = '';
    this.divs.squareInfoDiv.className = 'gm-info gm-info-sqr';
    // this.divs.groupInfoDiv.innerHTML = '';
    this.divs.groupInfoDiv.className = 'gm-info gm-info-grp';
  }

  randomPuzzle() {
    const { puzzle, solution } = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];

    this.resetPuzzle = () => {
      this.clearPuzzle();
      this.createPuzzle(new Puzzle(puzzle, solution, this.divs));
    }

    return new Puzzle(puzzle, solution, this.divs);
  }

}


