import { types } from 'mobx-state-tree'
import { combinations, product, sum, quotient, difference } from '../util'
import { Id, Filter, GameBase } from './base'
import Square from './square'

const Collection = GameBase
  .named('Collection')
  .props({
    id: Id,
    squares: types.array(types.reference(types.late(() => Square))),
    rules: types.optional(Filter, () => Filter.create()),
    eliminatedCombinations: types.array(types.array(types.integer)),
  })
  .views(self => {
    return {
      get numSquares() {
        return self.squares.length
      },
      get allCombinations() {
        return combinations(self.numSquares)
      },
      get possibleCombinations() {
        return self.allCombinations.filter(self.isPossibleCombination)
      },
      isPossibleCombination(combo) {
        return (
          self.rules.isPossibleCombination(combo)
          && !self.eliminatedCombinations.includes(combo)
        )
      },
      isPossibleValue(value) {
        return (
          !self.rules.isEliminatedValue(value)
          && self.possibleCombinations.some(combo => combo.includes(value))
        )
      }
    }
  })
  .actions(self => {
    return {
      addSquare(square) {
        self.squares.push(square.id)
      }
    }
  })


export const Cage = Collection
  .named('Cage')
  .props({
    operation: types.enumeration('Operation', ['+', '−', '⨉', '÷']),
    result: types.integer,
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
      // get operationFunction() {
      //   switch (self.operation) {
      //     case '+':
      //       return sum
      //     case '-':
      //       return difference
      //     case '*':
      //       return product
      //     case '/':
      //       return quotient
      //   }
      // },
      isPossibleCombination(combo) {
        return (
          superIsPossibleCombination(combo)
          && self.isMathematicalPossibility(combo)
        )
      },
      isMathematicalPossibility(combo) {
        switch (self.operation) {
          case '+':
            return sum(combo) === self.result
          case '-':
            return difference(combo) === self.result
          case '*':
            return product(combo) === self.result
          case '/':
            return quotient(combo) === self.result
        }
      }
    }
  })

export const Group = Collection
  .named('Group')
