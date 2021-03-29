import { types } from 'mobx-state-tree'
import UI from './ui'
import Puzzle from './puzzle'

const Options = types
  .model('Options', {
    autoEliminate: true,
    autoBlock: true,
    maxDisplayedPossibilities: 4,
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
        self.ui.focusedSquare.value = value
      },
      clearFocusedSquare() {
        self.setFocusedSquare(null)
      },

    }
  })

export default Game