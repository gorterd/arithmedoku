import * as DOMUtil from '../dom_util';

export function mountPuzzleListeners() {
  mountKeyboardListeners.call(this);
  mountClickListeners.call(this);
  this.divs.puzzleDiv.onblur = puzzleUnfocus.bind(this);
}

function mountClickListeners() {
  this.divs.puzzleDiv.onclick = handleSquareClick.bind(this);
}

function mountKeyboardListeners() {
  const arrowMatch = /^Arrow/;

  document.onkeydown = e => {
    const key = e.key;
    if (arrowMatch.test(key)) {
      arrowKeyHandler.call(this, e);
    } else if (/^\d/.test(key)) {
      numKeyHandler.call(this, e);
    } else if (key === 'Delete' || key === 'Backspace') {
      deleteKeyHandler.call(this, e)
    } else {
      console.log(key);
    }
  }
}

function arrowKeyHandler(e) {

  const oldSquare = this.puzzle.focusedSquare;

  if (!oldSquare) {
    return;
  }

  e.preventDefault();

  const size = this.puzzle.size;
  const [row, col] = oldSquare;

  let newSquare;
  switch (e.key) {
    case 'ArrowDown':
      newSquare = row + 1 < size ? [row + 1, col] : null;
      break;
    case 'ArrowUp':
      newSquare = row > 0 ? [row - 1, col] : null;
      break;
    case 'ArrowRight':
      newSquare = col + 1 < size ? [row, col + 1] : null;
      break;
    case 'ArrowLeft':
      newSquare = col > 0 ? [row, col - 1] : null;
      break;
  }

  if (newSquare) {
    const newSquareDiv = DOMUtil.getSquareDiv(newSquare);

    switchFocus.call(this, newSquare, newSquareDiv);
  }
}

function numKeyHandler(e) {
  const square = this.puzzle.focusedSquare;
  if (square) {
    const val = parseInt(e.key);

    const squareInp = DOMUtil.getSquareInp(square);
    squareInp.value = val;

    if (this.opts.block){
      let conflictingSquares = this.puzzle.checkConflicts(square, val);
  
      if (conflictingSquares.length) {
        DOMUtil.handleConflicts(square, conflictingSquares);
        return null;
      }
    }

    if (this.opts.autoElim){
      let affectedSquares = this.puzzle.autoEliminate(square, val);
      DOMUtil.illumineSquares(affectedSquares);
    }

    this.puzzle.getSquare(square).val = val;
  }
}

function deleteKeyHandler(e) {
  const square = this.puzzle.focusedSquare;
  if (square) {
    this.puzzle.getSquare(square).val = null;
    DOMUtil.getSquareInp(square).value = '';
  }
}

function tabKeyHandler(e) {
  const square = this.puzzle.focusedSquare;
  if (square) {
    this.puzzle.getSquare(square).val = null;
    DOMUtil.getSquareInp(square).value = '';
  }
}

function ctrlNumHandler(e) {
  const square = this.puzzle.focusedSquare;
  if (square) {
    this.puzzle.getSquare(square).val = null;
    DOMUtil.getSquareInp(square).value = '';
  }
}

function handleSquareClick(e) {
  this.status.disableUnfocus.puzzle = true;
  const squareDiv = e.target.parentElement;
  const square = squareDiv.dataset.pos
    .split(',')
    .map(n => parseInt(n));

  switchFocus.call(this, square, squareDiv);
}

function switchFocus(newSquare, newSquareDiv) {
  const wasPrev = this.puzzle.focusedSquare;

  if (wasPrev) {
    unfocusOldSquare.call(this);
  }

  if (this.divs.puzzleDiv !== document.activeElement) {
    this.divs.puzzleDiv.focus();
  };

  newSquareDiv.classList.add('focused');
  this.puzzle.renderers.squareInfo.update(newSquare, !wasPrev);
  // this.groupInfo.setSquare(newSquare, !wasPrev);
  this.puzzle.focusedSquare = newSquare;
}

function unfocusOldSquare() {
  const oldSquareDiv = DOMUtil.getSquareDiv(this.puzzle.focusedSquare);

  oldSquareDiv.classList.remove('focused');
  this.puzzle.focusedSquare = null;
}

function puzzleUnfocus() {
  if (this.puzzle.focusedSquare) {
    this.status.disableUnfocus.puzzle = false;
    window.setTimeout(() => {
      if (this.status.disableUnfocus.puzzle){
        this.divs.puzzleDiv.focus();
      } else {
        unfocusOldSquare.call(this);
        this.divs.squareInfoDiv.classList.add('leaving');
        this.divs.groupInfoDiv.classList.add('leaving');

        window.setTimeout(() => {
          this.puzzle.renderers.squareInfo.clear();
          this.puzzle.renderers.groupInfo.clear();
          this.divs.squareInfoDiv.classList.remove('leaving');
          this.divs.groupInfoDiv.classList.remove('leaving');
        }, 200);
      }
      this.status.disableUnfocus.puzzle = false;
    }, 30);
  }
}



