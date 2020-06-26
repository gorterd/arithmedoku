import PUZZLES from './puzzles/puzzles';

import Puzzle from './game_components/Puzzle';
import SquareInfo from './game_components/SquareInfo';
import GroupInfo from './game_components/GroupInfo';

import { mountListeners } from './listeners.js';

export default class App {

  constructor(puzzleDiv, squareInfoDiv, groupInfoDiv){
    this.puzzleDiv = puzzleDiv;
    this.squareInfoDiv = squareInfoDiv;
    this.groupInfoDiv = groupInfoDiv;
    this.init();
  }

  init() {
    this.createPuzzle(this.randomPuzzle());
  }

  createPuzzle(puzzle) {
    this.puzzle = puzzle;
    this.squareInfo = new SquareInfo(puzzle, this.squareInfoDiv);
    this.groupInfo = new GroupInfo(puzzle, this.groupInfoDiv);

    puzzle.render();

    mountListeners(this);
  }

  newPuzzle() {
    this.clearPuzzle();
    this.init();
  }

  clearPuzzle(){
    this.puzzleDiv.innerHTML = '';
    this.puzzleDiv.className = 'gm-puzzle';
    this.squareInfoDiv.innerHTML = '';
    this.squareInfoDiv.className = 'gm-info gm-info-sqr';
    this.groupInfoDiv.innerHTML = '';
    this.groupInfoDiv.className = 'gm-info gm-info-grp';
  }

  randomPuzzle() {
    const { puzzle, solution } = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];

    this.resetPuzzle = () => {
      this.clearPuzzle();
      this.createPuzzle(new Puzzle(puzzle, solution, this.puzzleDiv));
    }

    return new Puzzle(puzzle, solution, this.puzzleDiv);
  }

}


// createPuzzle(puzzle){
//   this.puzzle = puzzle;
//   this.squareInfo = new SquareInfo(puzzle, this.squareInfoDiv);
//   this.groupInfo = new GroupInfo(puzzle, this.groupInfoDiv);

//   puzzle.render();

//   mountListeners(this);
// }

// newPuzzle(){
//   this.createPuzzle(this.randomPuzzle());
// }

// randomPuzzle(){
//   const { puzzle, solution } = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];

//   this.resetPuzzle = () => {
//     this.createPuzzle(new Puzzle(puzzle, solution, this.puzzleDiv));
//   }

//   return new Puzzle(puzzle, solution, this.puzzleDiv);
// }
// }