import * as DOMUtil from '../dom_util';

export default class PuzzleRender {
  constructor(root, puzzle){
    this.root = root;
    this.puzzle = puzzle;
  }

  render() {
    this.puzzle.iterateSquares(this._generateSquareDiv.bind(this));
    this.puzzle.cages.forEach(this._generateCageLabel);
  }

  _generateCageLabel(cage) {
    const { anchor, anchorText } = cage;
    const anchorSpan = document.createElement('span');
    anchorSpan.innerText = anchorText;
    anchorSpan.className = 'cage-label';

    DOMUtil.getSquareDiv(anchor).prepend(anchorSpan);
  }

  _generateSquareDiv(square) {
    const { topBounds, leftBounds } = this.puzzle.bounds;
    const pos = square.pos;
    const [row, col] = pos;

    const squareDiv = document.createElement('div');
    squareDiv.dataset.pos = `${row},${col}`;

    squareDiv.className = 'gm-square';
    squareDiv.className += topBounds.includes(pos) ? ' top-bound' : '';
    squareDiv.className += leftBounds.includes(pos) ? ' left-bound' : '';
    squareDiv.style.gridRow = `${row + 1} / span 1`;
    squareDiv.style.gridColumn = `${col + 1} / span 1`;

    const squareInput = document.createElement('input');
    squareDiv.appendChild(squareInput);
    this.root.append(squareDiv);
  }
}

