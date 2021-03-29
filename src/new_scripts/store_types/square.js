import { autorun } from 'mobx'
import { getRoot, types } from 'mobx-state-tree'
import { autorunEach, classes } from '../util'
import { Id, Position } from './base'
import { Cage } from './collections'

const Square = types
  .model('Square', {
    id: Id,
    position: Position,
    cage: types.maybeNull(types.reference(types.late(() => Cage))),
    value: types.maybeNull(types.integer),
    solution: types.integer,
    eliminated: types.array(types.integer),
    status: types.maybeNull(
      types.enumeration('Status', ['mistake', 'conflict'])
    ),
  })
  .volatile(self => {
    return {
      ele: null,
      valNode: null,
      labelEle: null,
      optionsEle: null,
    }
  })
  .extend(self => {
    const initialPossibilities = Array.from(Array(9), (_, idx) => idx + 1)

    return {
      views: {
        get options() {
          return getRoot(self).options
        },
        get ui() {
          return getRoot(self).ui
        },
        get collections() {
          return getRoot(self).getCollectionsBySquare(self)
        },
        get collectionPossibilities() {
          return initialPossibilities.filter(val =>
            self.collections.every(c => c.isPossibleValue(val))
          )
        },
        get squarePossiblities() {
          return initialPossibilities.filter(val =>
            !self.eliminated.includes(val)
          )
        },
        get possibilities() {
          return self.collectionPossibilities
            .filter(val => self.squarePossiblities.includes(val))
        },
        get dataPos() {
          return self.position.join(',')
        },
        get row() {
          return self.position[0]
        },
        get col() {
          return self.position[1]
        },
        get isCorrect() {
          return self.value === self.solution
        },
        get isTopSquare() {
          return self.cage.bounds.topSquares.includes(self)
        },
        get isLeftSquare() {
          return self.cage.bounds.leftSquares.includes(self)
        },
        get isFocused() {
          return self.ui.focusedSquare === self
        },
        get label() {
          return self.cage.anchor === self ? self.cage.labelText : ''
        },
        get className() {
          return classes(
            'square',
            [self.isTopSquare, 'square--top-bound'],
            [self.isLeftSquare, 'square--left-bound'],
            [self.status === 'mistake', 'square--mistake'],
            [self.status === 'conflict', 'square--conflict'],
          )
        },
        get inlineStyle() {
          return `grid-area: ${self.row + 1} / ${self.col + 1} / span 1 / span 1;`
        },
        get showPossibilities() {
          return (
            self.options.maxDisplayedPossibilities >= self.possibilities.length
            && self.value === null
          )
        },
        get initialHtml() {
          const template = document.getElementById('square-template')
          const ele = template.content.firstElementChild.cloneNode(true)
          ele.dataset.pos = self.dataPos
          return ele
          // return `
          //   <div 
          //     class='${self.className}'
          //     style='${self.inlineStyle}'
          //     data-pos='${self.dataPos}'
          //     tabindex='-1'
          //   >
          //     <span class='square_label'>${self.label}</span>
          //     <div class='square_options'></div>
          //   </div>
          // `
        },
        optionClassName(val) {
          return self.showPossibilities && self.possibilities.includes(val)
            ? 'square_option square_option--show'
            : 'square_option'
        },
        isBelow(otherSquare) {
          return (
            otherSquare.row === self.row - 1
            && otherSquare.col === self.col
          )
        },
        isRightOf(otherSquare) {
          return (
            otherSquare.row === self.row
            && otherSquare.col === self.col - 1
          )
        },
        isAbove(otherSquare) {
          return otherSquare.isBelow(self)
        },
        isLeftOf(otherSquare) {
          return otherSquare.isRightOf(self)
        },
        comesBefore(otherSquare) {
          switch (Math.sign(otherSquare.row - self.row)) {
            case 1:
              return true
            case 0:
              return otherSquare.col > self.col
            case -1:
              return false
          }
        },
        isLogicalSupersetOf(otherSquare) {
          if (self.value) {
            return self.value === otherSquare.value
          } else if (otherSquare.value) {
            return self.isPossibility(otherSquare.value)
          } else {
            return otherSquare.possibilities.every(self.isPossibility)
          }
        },
        isLogicalSubsetOf(otherSquare) {
          return otherSquare.isLogicalSupersetOf(self)
        }
      },
    }
  })
  .actions(self => {
    return {
      setupEles() {
        self.ele = document.querySelector(`.square[data-pos="${self.dataPos}"`)
        self.optionsEle = self.ele.querySelector('.square_options')
        self.labelEle = self.ele.querySelector('.square_label')
        self.valNode = self.ele.appendChild(document.createTextNode(''))
      },
    }
  })
  .actions(self => {
    const reactiveActions = {
      renderValNode() {
        self.valNode.data = self.value
      },
      renderClassName() {
        self.ele.className = self.className
      },
      renderLabel() {
        self.labelEle.innerText = self.label
      },
      renderOptions() {
        self.optionsEle.innerHTML = self.optionsInnerHtml
      },
    }

    return {
      ...reactiveActions,
      makeReactive: () => Object.values(reactiveActions)
        .forEach(fn => autorun(fn))
    }
  })

export default Square