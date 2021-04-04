import { types } from 'mobx-state-tree'
import { GameBase } from './base'
import UI from './ui'
import Puzzle from './puzzle'

const Options = GameBase
  .named('Options')
  .props({
    autoEliminate: true,
    autoBlock: true,
    autoElimMathImpossibilities: true,
    maxDisplayedPossibilities: 4,
  })
  .actions(self => {
    return {
      setOption(option, val) {
        self[option] = val
      },
      toggleAutoEliminate() {
        self.autoEliminate = !self.autoEliminate
      },
      toggleAutoBlock() {
        self.autoBlock = !self.autoBlock
      },
      toggleAutoElimMathImpossibilities() {
        self.autoElimMathImpossibilities = !self.autoElimMathImpossibilities
      },
      setMaxDisplayedPossibilities(num) {
        if (num < 2 || num > 9) {
          return false
        } else {
          self.maxDisplayedPossibilities = num
          return true
        }
      },
    }
  })

const Game = types
  .model('Game', {
    puzzle: types.optional(Puzzle, () => Puzzle.create()),
    options: types.optional(Options, () => Options.create()),
    ui: types.optional(UI, () => UI.create()),
  })
  .views(self => {
    return {
    }
  })
  .actions(self => {
    return {
      initialize({ cages, solution }) {
        cages.forEach(({ operation, result, squares }) => {
          const cage = self.puzzle.cages.put({ operation, result })

          squares.forEach(position => {
            const square = self.puzzle.squares.put({
              position,
              solution: solution[position[0]][position[1]],
              cage: cage.id
            })
            cage.addSquare(square)
          })
        })
      },
      selectSquareByKey(key) {
        self.ui.selectSquareByKey(key)
      },
      selectSquareByPos(pos) {
        self.ui.selectSquareByPos(pos)
      },
      setFocusedSquare(value) {
        if (
          self.options.autoBlock
          && !self.ui.focusedSquare.isPossibleValue(value)
        ) {
          self.ui.focusedSquare.conflictingSquares(value)
            .forEach(square => square.setConflict())

          self.ui.focusedSquare.setMistake(value)
        } else {
          self.ui.focusedSquare.value = value
        }
      },
      clearFocusedSquare() {
        self.setFocusedSquare(null)
      },

    }
  })

export default Game