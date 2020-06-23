import PUZZLES from './puzzles/puzzles'
import Puzzle from './game_components/Puzzle';

export default class Game {
  constructor(puzzle, squareInfo, groupInfo){
    this.divs = { puzzle, squareInfo, groupInfo };
  }

  newPuzzle(){
    const puzzleData = PUZZLES[Math.floor( Math.random() * PUZZLES.length  )];
    const { puzzle, solution } = puzzleData;
    this.puzzle = new Puzzle(puzzle, solution);
    this.renderPuzzle();
  }

  renderPuzzle(){
    this.puzzle.iterateSquares(this._generateSquareDiv);
    this.puzzle.cages.forEach(this._generateCageLabel);
  }

  _generateCageLabel(cage){
    const { anchor: [row, col], anchorText } = cage;
    const anchorSpan = document.createElement('span');
    anchorSpan.innerText = anchorText;
    anchorSpan.className = 'cage-label';

    document
      .querySelector(`div[data-pos="${row},${col}"]`)
      .prepend(anchorSpan);
  }

  _generateSquareDiv(square) {
    const { topBounds, leftBounds } = this.puzzle.bounds;
    
    const [row, col] = pos = square.pos;
    const squareDiv = document.createElement('div');
    squareDiv.dataset.pos = `${row},${col}`;

    squareDiv.className = 'gm-square';
    squareDiv.className += topBounds.includes(pos) ? ' top-bound' : '';
    squareDiv.className += leftBounds.includes(pos) ? ' left-bound' : '';
    squareDiv.style.gridRow = `${row + 1} / span 1`;
    squareDiv.style.gridColumn = `${col + 1} / span 1`;

    const squareInput = document.createElement('input');
    squareDiv.appendChild(squareInput);

    this.divs.puzzle.append(squareDiv);
  }
}