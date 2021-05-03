// import { types } from 'mobx-state-tree'
// import { createIcon, getTemplateById } from '../shared/dom_util'
// import {
//   combos,
//   includesArray,
//   indexOfArray,
//   product,
//   sum,
//   quotient,
//   difference,
//   includesDistinct,
//   maxPossibleRepeats,
//   stringSwitch,
// } from '../shared/general_util'
// import { Id, GameBase } from './base'
// import Rules from './rules'
// import Square from './square'

// const Collection = GameBase
//   .named('Collection')
//   .props({
//     id: Id,
//     squares: types.array(types.reference(types.late(() => Square))),
//     rules: types.optional(Rules, () => Rules.create()),
//     eliminatedCombos: types.optional(
//       types.array(types.array(types.integer)),
//       () => []
//     ),
//   })
//   .views(self => {
//     return {
//       get numSquares() {
//         return self.squares.length
//       },
//       get positions() {
//         return self.squares.map(square => square.position)
//       },
//       get squareValues() {
//         return self.squares
//           .map(square => square.value)
//           .filter(val => typeof val === 'number')
//       },
//       // get boundingBox() {
//       //   const sortedSquareRows = self.squares.map(sq => sq.row).sort()
//       //   const sortedSquareCols = self.squares.map(sq => sq.col).sort()
//       //   const minRow = sortedSquareRows[0]
//       //   const minCol = sortedSquareCols[0]
//       //   const maxRow = sortedSquareRows[sortedSquareRows.length - 1]
//       //   const maxCol = sortedSquareCols[sortedSquareCols.length - 1]

//       //   return [[minRow, minCol], [maxRow, maxCol]]
//       // },
//       get allCombos() {
//         return combos(self.numSquares, ({
//           min: 1,
//           max: self.env.globals.size,
//           numRepeatsAllowed: self.numPossibleRepeats
//         }))
//       },
//       get filteredCombos() {
//         return self.allCombos
//           .filter(self.isFilteredCombo)
//       },
//       get possibleCombos() {
//         return self.allCombos
//           .filter(self.isPossibleCombo)
//       },
//       get numPossibleRepeats() {
//         return maxPossibleRepeats(self.positions)
//       },
//       get comboEles() {
//         return self.filteredCombos.map(combo => {
//           const comboEle = self.env.templates.combo.cloneNode(true)
//           comboEle.dataset.combo = combo.join(',')
//           comboEle.innerText = combo.join(' | ')

//           if (self.isEliminatedCombo(combo)) {
//             comboEle.classList.add('combo--eliminated')
//           }

//           return comboEle
//         })
//       },
//       compareComboEles(comboA, comboB) {
//         const comboStrA = comboA.dataset.combo
//         const comboStrB = comboB.dataset.combo
//         if (comboStrA === comboStrB) {
//           return 0
//         } else if (comboStrA < comboStrB) {
//           return -1
//         } else {
//           return 1
//         }
//       },
//       isFilteredCombo(combo) {
//         return self.rules.isPossibleCombo(combo)
//       },
//       isEliminatedCombo(combo) {
//         return includesArray(self.eliminatedCombos, combo)
//       },
//       isPossibleCombo(combo) {
//         return (
//           self.isFilteredCombo(combo)
//           && !self.isEliminatedCombo(combo)
//         )
//       },
//       isPossibleValue(value) {
//         return self.possibleCombos.some(combo =>
//           includesDistinct(combo, ...self.squareValues, value))
//       },
//     }
//   })
//   .actions(self => {
//     return {
//       addSquare(square) {
//         self.squares.push(square.id)
//       },
//       toggleCombo(combo) {
//         const comboIndex = indexOfArray(self.eliminatedCombos, combo)

//         if (comboIndex >= 0) {
//           self.eliminatedCombos.splice(comboIndex, 1)
//         } else {
//           self.eliminatedCombos.push(combo)
//         }
//       },
//       // eliminateCombo(combo) {
//       //   if (!includesArray(self.eliminatedCombos, combo)) {
//       //     self.eliminatedCombos.push(combo)
//       //   }
//       // },
//       // uneliminateCombo(combo) {
//       //   const comboIndex = indexOfArray(self.eliminatedCombos, combo)

//       //   if (comboIndex >= 0) {
//       //     self.eliminatedCombos.splice(comboIndex, 1)
//       //   }
//       // },
//       setCombos(combos) {
//         const sortedCombos = combos.map(combo => combo.sort())

//         self.eliminatedCombos = self.allCombos
//           .filter(combo => !includesArray(sortedCombos, combo))
//       },
//     }
//   })


// export const Cage = Collection
//   .named('Cage')
//   .props({
//     operation: types.enumeration('Operation', ['+', '−', '⨉', '÷']),
//     result: types.integer,
//     autoElimMathImpossibilities: types.optional(types.boolean, () => false),
//   })
//   .views(self => {
//     const superIsRulePossibleCombo = self.isFilteredCombo

//     return {
//       get bounds() {
//         const bounds = {
//           topSquares: [],
//           leftSquares: [],
//           anchor: self.squares[0],
//         }

//         self.squares.forEach(square => {
//           const isTop = !self.squares.some(square.isBelow)
//           const isLeft = !self.squares.some(square.isRightOf)

//           if (isTop) bounds.topSquares.push(square)
//           if (isLeft) bounds.leftSquares.push(square)
//           if (isTop && isLeft && square.comesBefore(bounds.anchor)) {
//             bounds.anchor = square
//           }
//         })

//         return bounds;
//       },
//       get anchor() {
//         return self.bounds.anchor
//       },
//       get labelText() {
//         return `${self.result} ${self.operation}`
//       },
//       isFilteredCombo(combo) {
//         return (
//           self.rootOptions.autoElimMathImpossibilities
//           || self.autoElimMathImpossibilities
//         ) ? (
//           superIsRulePossibleCombo(combo)
//           && self.isMathematicalPossibility(combo)
//         ) : superIsRulePossibleCombo(combo)
//       },
//       isMathematicalPossibility(combo) {
//         switch (self.operation) {
//           case '+':
//             return sum(combo) === self.result
//           case '−':
//             return difference(combo) === self.result
//           case '⨉':
//             return product(combo) === self.result
//           case '÷':
//             return quotient(combo) === self.result
//           default:
//             throw new Error(`Operation ${self.operation} doesn't match one of +, -, ⨉, or ÷`)
//         }
//       }
//     }
//   })

// export const Group = Collection
//   .named('Group')

import { types } from 'mobx-state-tree'
import {
  combos,
  includesArray,
  indexOfArray,
  product,
  sum,
  quotient,
  difference,
  includesDistinct,
  maxPossibleRepeats,
  stringSwitch,
  togglePresenceInArray,
} from '../shared/general_util'
import { Id, GameBase } from './base'
import Filter from './filter'
import Square from './square'

const Collection = GameBase
  .named('Collection')
  .props({
    id: Id,
    squares: types.array(types.reference(types.late(() => Square))),
    filter: types.optional(Filter, () => Filter.create()),
    eliminatedCombos: types.optional(
      types.array(types.array(types.integer)),
      () => []
    ),
  })
  .views(self => {
    return {
      get numSquares() {
        return self.squares.length
      },
      get positions() {
        return self.squares.map(square => square.position)
      },
      get squareValues() {
        return self.squares
          .map(square => square.value)
          .filter(val => typeof val === 'number')
      },
      // get boundingBox() {
      //   const sortedSquareRows = self.squares.map(sq => sq.row).sort()
      //   const sortedSquareCols = self.squares.map(sq => sq.col).sort()
      //   const minRow = sortedSquareRows[0]
      //   const minCol = sortedSquareCols[0]
      //   const maxRow = sortedSquareRows[sortedSquareRows.length - 1]
      //   const maxCol = sortedSquareCols[sortedSquareCols.length - 1]

      //   return [[minRow, minCol], [maxRow, maxCol]]
      // },
      get allCombos() {
        return combos(self.numSquares, ({
          min: 1,
          max: self.env.globals.size,
          numRepeatsAllowed: self.numPossibleRepeats
        }))
      },
      get filteredCombos() {
        return self.allCombos
          .filter(self.isFilteredCombo)
      },
      get possibleCombos() {
        return self.allCombos
          .filter(self.isPossibleCombo)
      },
      get numPossibleRepeats() {
        return maxPossibleRepeats(self.positions)
      },
      get comboEles() {
        return self.filteredCombos.map(combo => {
          const comboEle = self.env.templates.combo.cloneNode(true)
          comboEle.dataset.combo = combo.join(',')
          comboEle.innerText = combo.join(' | ')

          if (self.isEliminatedCombo(combo)) {
            comboEle.classList.add('combo--eliminated')
          }

          return comboEle
        })
      },
      compareComboEles(comboA, comboB) {
        const comboStrA = comboA.dataset.combo
        const comboStrB = comboB.dataset.combo
        if (comboStrA === comboStrB) {
          return 0
        } else if (comboStrA < comboStrB) {
          return -1
        } else {
          return 1
        }
      },
      isFilteredCombo(combo) {
        return self.filter.isPossibleCombo(combo)
      },
      isEliminatedCombo(combo) {
        return includesArray(self.eliminatedCombos, combo)
      },
      isPossibleCombo(combo) {
        return (
          self.isFilteredCombo(combo)
          && !self.isEliminatedCombo(combo)
        )
      },
      isPossibleValue(value) {
        return self.possibleCombos.some(combo =>
          includesDistinct(combo, ...self.squareValues, value))
      },
    }
  })
  .actions(self => {
    return {
      addSquare(square) {
        self.squares.push(square.id)
      },
      toggleCombo(combo) {
        togglePresenceInArray(self.eliminatedCombos, combo, indexOfArray)
      },
      setCombos(combos) {
        const sortedCombos = combos.map(combo => combo.sort())

        self.eliminatedCombos = self.allCombos
          .filter(combo => !includesArray(sortedCombos, combo))
      },
    }
  })


export const Cage = Collection
  .named('Cage')
  .props({
    operation: types.enumeration('Operation', ['+', '−', '⨉', '÷']),
    result: types.integer,
    autoElimMathImpossibilities: types.optional(types.boolean, () => false),
  })
  .views(self => {
    const superIsRulePossibleCombo = self.isFilteredCombo

    return {
      get bounds() {
        const bounds = {
          topSquares: [],
          leftSquares: [],
          anchor: self.squares[0],
        }

        self.squares.forEach(square => {
          const isTop = !self.squares.some(square.isBelow)
          const isLeft = !self.squares.some(square.isRightOf)

          if (isTop) bounds.topSquares.push(square)
          if (isLeft) bounds.leftSquares.push(square)
          if (isTop && isLeft && square.comesBefore(bounds.anchor)) {
            bounds.anchor = square
          }
        })

        return bounds;
      },
      get anchor() {
        return self.bounds.anchor
      },
      get labelText() {
        return `${self.result} ${self.operation}`
      },
      isFilteredCombo(combo) {
        return (
          self.rootOptions.autoElimMathImpossibilities
          || self.autoElimMathImpossibilities
        ) ? (
          superIsRulePossibleCombo(combo)
          && self.isMathematicalPossibility(combo)
        ) : superIsRulePossibleCombo(combo)
      },
      isMathematicalPossibility(combo) {
        switch (self.operation) {
          case '+':
            return sum(combo) === self.result
          case '−':
            return difference(combo) === self.result
          case '⨉':
            return product(combo) === self.result
          case '÷':
            return quotient(combo) === self.result
          default:
            throw new Error(`Operation ${self.operation} doesn't match one of +, -, ⨉, or ÷`)
        }
      }
    }
  })

export const Group = Collection
  .named('Group')
