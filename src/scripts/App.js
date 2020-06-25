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
    this.newPuzzle();
  }

  newPuzzle(){
    const puzzleData = PUZZLES[Math.floor( Math.random() * PUZZLES.length  )];
    const { puzzle, solution } = puzzleData;

    this.puzzle = new Puzzle(puzzle, solution, this.puzzleDiv);
    this.squareInfo = new SquareInfo(puzzle, this.squareInfoDiv);
    this.groupInfo = new GroupInfo(puzzle, this.groupInfoDiv);

    this.puzzle.render();
    this.squareInfo.render();
    this.groupInfo.render();

    mountListeners(this);
  }

}