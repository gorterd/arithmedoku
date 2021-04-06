import { autorun } from 'mobx'
import { NUM_REGEX } from "../util/constants"

export function setupOptions(options, optionsEle) {
  const optionsElements = getOptionsElements(optionsEle)
  setupListeners(options, optionsElements)
  makeOptionsReactive(options, optionsElements)
}

function setupListeners(options, {
  autoBlock,
  autoElim,
  autoElimMathImpossibilities,
  maxPossibilitiesInput,
}) {
  autoBlock.addEventListener('click', () => options.toggleAutoBlock())
  autoElim.addEventListener('click', () => options.toggleAutoEliminate())
  autoElimMathImpossibilities.addEventListener('click', () =>
    options.toggleAutoElimMathImpossibilities())
  maxPossibilitiesInput.addEventListener('keydown', e => {
    e.preventDefault()
    if (NUM_REGEX.test(e.key)) {
      const success = options.setMaxDisplayedPossibilities(parseInt(e.key))
      if (!success) console.log('Bad Input!')
    }
  })
}

function makeOptionsReactive(options, {
  autoBlock,
  autoElim,
  autoElimMathImpossibilities,
  maxPossibilitiesInput,
}) {
  const reactions = [
    function renderAutoBlock() {
      autoBlock.className = options.autoBlockClassName
    },
    function renderAutoElim() {
      autoElim.className = options.autoElimClassName
    },
    function renderAutoElimMathImpossibilities() {
      autoElimMathImpossibilities.className =
        options.autoElimMathImpossibilitiesClassName
    },
    function renderMaxPossibilitiesInput() {
      maxPossibilitiesInput.value = options.maxDisplayedPossibilities
    },
  ]

  const disposers = reactions.map(fn => autorun(fn))
  return disposers
}

function getOptionsElements(optionsEle) {
  return {
    autoBlock: optionsEle.querySelector('#option-auto-block'),
    autoElim: optionsEle.querySelector('#option-auto-elim'),
    autoElimMathImpossibilities: optionsEle
      .querySelector('#option-auto-elim-math-impossibilities'),
    maxPossibilitiesInput: optionsEle
      .querySelector('#option-max-possibilities .option_num-input'),
    maxPossibilitiesError: optionsEle
      .querySelector('#option-max-possibilities .option_error'),
  }
}


// function mountHeader() {
//   document.querySelector('.hd-new').onclick = e => {
//     e.target.blur();
//     this.newPuzzle.call(this)
//   };
//   document.querySelector('.hd-reset').onclick = e => {
//     e.target.blur();
//     this.resetPuzzle.call(this);
//   };
//   mountOptions.call(this);
// }

// function mountOptions() {
//   mountDropdown.call(this, 'options', '.hd-options', 'ul');
//   mountDropdown.call(this, 'about', '.hd-about', 'div');
//   mountDropdown.call(this, 'instructions', '.hd-instructions', 'ol');

//   document.getElementById('tg-block').onclick = optionToggle.call(this, 'block');
//   document.getElementById('tg-elim').onclick = optionToggle.call(this, 'autoElim');
//   document.querySelector('.hd-options input').onkeydown = keyHandler.bind(this);
// }

// function optionToggle(option) {
//   return e => {
//     e.currentTarget.classList.toggle('on');
//     this.opts[option] = !this.opts[option];
//   }
// }

// function mountDropdown(name, selector, subselector) {
//   document.querySelector(selector).onclick = e => {
//     const btn = e.currentTarget;
//     const classList = btn.querySelector(subselector).classList;
//     classList.toggle('show');
//     if (!classList.contains('show')) {
//       btn.blur();
//     }
//   }

//   document.querySelector(selector).onblur = e => {
//     const classList = e.currentTarget.querySelector(subselector).classList;
//     this.status.disableUnfocus[name] = false;
//     window.setTimeout(() => {
//       if (!this.status.disableUnfocus[name]) {
//         classList.remove('show')
//       };
//     }, 50);
//   }

//   document.querySelector(`${selector} ${subselector}`).onclick = e => {
//     e.stopPropagation();
//     this.status.disableUnfocus[name] = true;
//   }
// }


// function keyHandler(e) {
//   e.preventDefault();
//   e.stopPropagation();

//   if (/^\d/.test(e.key)) {
//     const n = parseInt(e.key);
//     const inp = e.target;
//     const errorMsg = document.querySelector('.error-msg');
//     window.clearTimeout(this.fadeOut);

//     if (n < 2 || n > 4) {
//       errorMsg.innerText = 'input a number between 2 and 4';
//       errorMsg.classList.add('show');
//       inp.classList.add('error');
//       inp.value = n;

//       this.fadeOut = window.setTimeout(() => {
//         errorMsg.classList.add('leaving');
//         inp.classList.add('leaving');
//       }, 2300);

//       window.setTimeout(() => {
//         errorMsg.innerText = '';
//         errorMsg.classList.remove('show');
//         inp.classList.remove('error');
//         errorMsg.classList.remove('leaving');
//         inp.classList.remove('leaving');
//         inp.value = this.opts.limit || '';
//       }, 2600);

//     } else {
//       this.opts.limit = n;
//       inp.value = n;
//       errorMsg.innerText = '';
//       errorMsg.classList.remove('show');
//       inp.classList.remove('error');
//     }
//   } else if (e.key === 'Delete' || e.key === 'Backspace') {
//     this.opts.limit = null;
//     e.target.value = '';
//   }
// }



