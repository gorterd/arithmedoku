import * as DOMUtil from '../dom_util';

export function mountSquareInfoListeners() {
  this.numsDiv = this.squareInfoDiv.querySelector('.gm-info-nums');
  mountKeyboardListeners.call(this);
  mountClickListeners.call(this);
}

function mountClickListeners() {
  this.squareInfoDiv.onclick = () => this.status.disableUnfocus = true;
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
  const classList = e.target.classList;

  if ( classList.contains('info-num') && !this.squareInfo.locked ){
    classList.toggle('selected');
    this.squareInfo.toggleOption(parseInt(e.target.innerText));
  }
  else if (true) {
    console.log('true');
  }
}






