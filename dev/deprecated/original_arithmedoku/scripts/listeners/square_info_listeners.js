import * as DOMUtil from '../dom_util';

export function mountSquareInfoListeners() {
  this.numsDiv = this.divs.squareInfoDiv.querySelector('.gm-info-nums');
  mountKeyboardListeners.call(this);
  mountClickListeners.call(this);
}

function mountClickListeners() {
  this.divs.squareInfoDiv.onclick = () => {
    this.status.disableUnfocus.puzzle = true;
  };
  this.numsDiv.onclick = handleNumsClick.bind(this);
}

function mountKeyboardListeners() {

}

function arrowKeyHandler(e) {

}

function numKeyHandler(e) {

}

function deleteKeyHandler(e) {

}

function handleNumsClick(e) {
  const focusedSquarePos = this.puzzle.focusedSquare;
  if (!focusedSquarePos) { return null };
  
  const focusedSquare = this.puzzle.getSquare(focusedSquarePos);
  const squareInfo = focusedSquare.squareInfo;
  const classList = e.target.classList;
  const numsCheck = e.target.closest('.info-nums-check');

  if ( classList.contains('info-num') && !squareInfo.locked ){
    classList.toggle('selected');
    const prevOpts = squareInfo.options;
    squareInfo.toggleOption(parseInt(e.target.innerText));
    this.puzzle.renderers.puzzle.updateSquareOptions(focusedSquare, this.opts.limit);
  } else if (numsCheck) {
    numsCheck.classList.toggle('selected');
    squareInfo.toggleLocked();
    this.numsDiv.querySelectorAll('.info-num').forEach( num => {
      const classes = num.classList;
      classes.contains('selected') ? classes.toggle('ruled-in') : classes.toggle('ruled-out');
      num.disabled = true;
    })
  }
}







