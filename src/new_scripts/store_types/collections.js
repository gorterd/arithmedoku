import { types } from 'mobx-state-tree'
import {
  combinations,
  includesArray,
  indexOfArray,
  product,
  sum,
  quotient,
  difference,
  includesDistinct,
  maxPossibleRepeats,
} from '../util'
import { Id, Rules, GameBase } from './base'
import Square from './square'

const Collection = GameBase
  .named('Collection')
  .props({
    id: Id,
    squares: types.array(types.reference(types.late(() => Square))),
    rules: types.optional(Rules, () => Rules.create()),
    eliminatedCombinations: types.optional(
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
      get boundingBox() {
        const sortedSquareRows = self.squares.map(sq => sq.row).sort()
        const sortedSquareCols = self.squares.map(sq => sq.col).sort()
        const minRow = sortedSquareRows[0]
        const minCol = sortedSquareCols[0]
        const maxRow = sortedSquareRows[sortedSquareRows.length - 1]
        const maxCol = sortedSquareCols[sortedSquareCols.length - 1]

        return [[minRow, minCol], [maxRow, maxCol]]
      },
      get allCombinations() {
        return combinations(self.numSquares, ({
          min: 1,
          max: self.globals.size,
          numRepeatsAllowed: self.numPossibleRepeats
        }))
      },
      get possibleCombinations() {
        return self.allCombinations.filter(self.isPossibleCombination)
      },
      get numPossibleRepeats() {
        return maxPossibleRepeats(self.positions)
      },
      isPossibleCombination(combo) {
        return (
          self.rules.isPossibleCombination(combo)
          && !includesArray(self.eliminatedCombinations, combo)
        )
      },
      isPossibleValue(value) {
        return self.possibleCombinations.some(combo =>
          includesDistinct(combo, ...self.squareValues, value))
      }
    }
  })
  .actions(self => {
    return {
      addSquare(square) {
        self.squares.push(square.id)
      },
      eliminateCombination(combo) {
        if (!includesArray(self.eliminatedCombinations, combo)) {
          self.eliminatedCombinations.push(combo)
        }
      },
      uneliminateCombination(combo) {
        const comboIndex = indexOfArray(self.eliminatedCombinations, combo)

        if (comboIndex >= 0) {
          self.eliminatedCombinations.splice(comboIndex, 1)
        }
      },
      setCombinations(combos) {
        const sortedCombos = combos.map(combo => combo.sort())

        self.eliminatedCombinations = self.allCombinations
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
    const superIsPossibleCombination = self.isPossibleCombination

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
      isPossibleCombination(combo) {
        return (
          self.rootOptions.autoElimMathImpossibilities
          || self.autoElimMathImpossibilities
        ) ? (
          superIsPossibleCombination(combo)
          && self.isMathematicalPossibility(combo)
        ) : superIsPossibleCombination(combo)
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
