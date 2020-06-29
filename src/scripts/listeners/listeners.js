import * as DOMUtil from '../dom_util';
import { mountPuzzleListeners } from './puzzle_listeners';
import { mountSquareInfoListeners } from './square_info_listeners';

export const mountListeners = ctx => {
  ctx.status = {
    disableUnfocus: {
      puzzle: false,
      options: false,
      about: false,
      instructions: false,
    }
  }
  mountPuzzleListeners.call(ctx);
  mountSquareInfoListeners.call(ctx);
  mountHeader.call(ctx);
}

function mountHeader(){
  document.querySelector('.hd-new').onclick = e => {
    e.target.blur();
    this.newPuzzle.call(this)
  };
  document.querySelector('.hd-reset').onclick = e => {
    e.target.blur();
    this.resetPuzzle.call(this);
  };
  mountOptions.call(this);
}

function mountOptions(){
  mountDropdown.call(this, 'options', '.hd-options', 'ul');
  mountDropdown.call(this, 'about', '.hd-about', 'div');
  mountDropdown.call(this, 'instructions', '.hd-instructions', 'ol');

  document.getElementById('tg-block').onclick = optionToggle.call(this, 'block');
  document.getElementById('tg-elim').onclick = optionToggle.call(this, 'autoElim');
  document.querySelector('.hd-options input').onkeydown = keyHandler.bind(this);
}

function optionToggle(option) {
  return e => {
    e.currentTarget.classList.toggle('on');
    this.opts[option] = !this.opts[option];
  }
}

function mountDropdown(name, selector, subselector){
  document.querySelector(selector).onclick = e => {
    const btn = e.currentTarget;
    const classList = btn.querySelector(subselector).classList;
    classList.toggle('show');
    if (!classList.contains('show')) {
      btn.blur();
    }
  }

  document.querySelector(selector).onblur = e => {
    const classList = e.currentTarget.querySelector(subselector).classList;
    this.status.disableUnfocus[name] = false;
    window.setTimeout(() => {
      if (!this.status.disableUnfocus[name]) {
        classList.remove('show')
      };
    }, 50);
  }

  document.querySelector(`${selector} ${subselector}`).onclick = e => {
    e.stopPropagation();
    this.status.disableUnfocus[name] = true;
  }
}

function keyHandler(e) {
  e.preventDefault();
  e.stopPropagation();
  
  if (/^\d/.test(e.key)) {
    const n = parseInt(e.key);
    const inp = e.target;
    const errorMsg = document.querySelector('.error-msg');
    window.clearTimeout(this.fadeOut);

    if (n < 2 || n > 4){
      errorMsg.innerText = 'input a number between 2 and 4';
      errorMsg.classList.add('show');
      inp.classList.add('error');
      inp.value = n;

      this.fadeOut = window.setTimeout( () => {
        errorMsg.classList.add('leaving');
        inp.classList.add('leaving');
      }, 2300);

      window.setTimeout( () => {
        errorMsg.innerText = '';
        errorMsg.classList.remove('show');
        inp.classList.remove('error');
        errorMsg.classList.remove('leaving');
        inp.classList.remove('leaving');
        inp.value = this.opts.limit || '';
      }, 2600);

    }  else {
      this.opts.limit = n;
      inp.value = n;
      errorMsg.innerText = '';
      errorMsg.classList.remove('show');
      inp.classList.remove('error');
    }
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    this.opts.limit = null;
    e.target.value = '';
  } 
}




