import * as DOMUtil from './dom_util';

const status = {
  disableUnfocus: false
}

export const mountListeners = ctx => {
  mountKeyboardListeners.call(ctx);
  mountClickListeners.call(ctx);
  ctx.puzzleDiv.onblur = puzzleUnfocus.bind(ctx); 
}

function mountClickListeners(){
  this.puzzleDiv.onclick = handleSquareClick.bind(this);
  document.querySelector('.hd-new').onclick = this.newPuzzle.bind(this);
  document.querySelector('.hd-reset').onclick = this.resetPuzzle.bind(this);
}

function mountKeyboardListeners() {
  const arrowMatch = /^Arrow/;

  document.onkeydown = e => {
    const key = e.key;
    if (arrowMatch.test(key)) {
      arrowKeyHandler.call(this, e);
    } else if ( /^\d/.test(key) ){
      numKeyHandler.call(this,e);
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

  if( newSquare ){
    const newSquareDiv = DOMUtil.getSquareDiv(newSquare);
  
    switchFocus.call(this, newSquare, newSquareDiv);
  }
}

function numKeyHandler(e){
  const square = this.puzzle.focusedSquare;
  if (square){
    const val = parseInt(e.key);

    const squareInp = DOMUtil.getSquareInp(square);
    squareInp.value = val;

    let { conflictingSquares } = this.puzzle.checkConflicts(square, val);

    console.log(conflictingSquares);
    if (conflictingSquares.length){
      DOMUtil.handleConflicts(square, conflictingSquares );
    } else {
      this.puzzle.getSquare(square).val = val;
    }
  }
}

function deleteKeyHandler(e){
  const square = this.puzzle.focusedSquare;
  if (square) {
    this.puzzle.getSquare(square).val = null;
    DOMUtil.getSquareInp(square).value = '';
  }
}

function handleSquareClick(e) {
  status.disableUnfocus = true;
  const squareDiv = e.target.parentElement;
  const square = squareDiv.dataset.pos
    .split(',')
    .map( n => parseInt(n));

  switchFocus.call(this, square, squareDiv);
}

function switchFocus(newSquare, newSquareDiv){
  const wasPrev = this.puzzle.focusedSquare;

  if (wasPrev) {
    unfocusOldSquare.call(this);
  }

  if (this.puzzleDiv !== document.activeElement){
    this.puzzleDiv.focus();
  };

  newSquareDiv.classList.add('focused');
  this.squareInfo.setSquare(newSquare, !wasPrev);
  this.groupInfo.setSquare(newSquare, !wasPrev);
  this.puzzle.focusedSquare = newSquare;
}

function unfocusOldSquare(){
  const oldSquareDiv = DOMUtil.getSquareDiv(this.puzzle.focusedSquare);

  oldSquareDiv.classList.remove('focused');
  this.puzzle.focusedSquare = null;
}

function puzzleUnfocus(){
  if (this.puzzle.focusedSquare){
    unfocusOldSquare.call(this);
    status.disableUnfocus = false;
    window.setTimeout( () => {
      if(!status.disableUnfocus){
        this.squareInfoDiv.classList.add('leaving');
        this.groupInfoDiv.classList.add('leaving');

        window.setTimeout( () => {
          this.squareInfo.clearSquare();
          this.groupInfo.clearSquare();
          this.squareInfoDiv.classList.remove('leaving');
          this.groupInfoDiv.classList.remove('leaving');
        }, 200);
      }
      status.disableUnfocus = false;
    }, 30);
  }
}

function newGame(){

}

function resetGame(){

}

