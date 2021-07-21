import * as DOMUtil from '../dom_util';

export default class PuzzleRender {
  constructor(puzzle){
    this.puzzle = puzzle;
    this.root = puzzle.divs.puzzleDiv;
  }

  render() {
    this.puzzle.iterateSquares(this._generateSquareDiv.bind(this));
    this.puzzle.cages.forEach(this._generateCageLabel);
  }

  updateSquareOptions(square, limit){
    const squareInfo = square.squareInfo;
    const options = squareInfo.options.sort( (a,b) => b - a );
    const num = options.length;
    
    let locked = squareInfo.locked ? 'locked-in' : '';
    let display = num ? 'all' : 'none';
    if (limit && num){
      display = num > limit ?  'flag' : 'limited';
    } 

    let optionsSpan = DOMUtil.getSquareDiv(square.pos).querySelector('.sq-options');
    optionsSpan.className = `sq-options ${display} ${locked}`;

    switch (display) {
      case 'all':
      case 'limited':
        let spans = options.map( opt => {
          let span = document.createElement('span');
          span.innerText = opt;
          return span;
        });
        optionsSpan.innerHTML = '';
        optionsSpan.append(...spans);
        break;
      case 'flag':
        optionsSpan.innerHTML = '<i class="far fa-sticky-note"></i>';
        break;
      default:
        optionsSpan.innerHTML = '';
    }
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
    const options = document.createElement('div');
    options.className = 'sq-options';
    squareDiv.append(squareInput, options);

    this.root.append(squareDiv);
  }
}

