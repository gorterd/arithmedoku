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

function mountHeader() {
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

function mountOptions() {
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

function mountDropdown(name, selector, subselector) {
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


