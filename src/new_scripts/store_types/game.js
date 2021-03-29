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
      get squares() {
        return self.puzzle.squares
      },
      getSquareByPos(pos) {
        return self.puzzle.getSquareByPos(pos)
      },
      getCollectionsBySquare(square) {
        return self.puzzle.getCollectionsBySquare(square)
      },
    }
  })
  .actions(self => {
    return {
      initialize({ cages, solution }) {
        cages.forEach(cage => {
          const { operation, result, squares } = cage
          const cageStore = self.puzzle.cages.put({ operation, result })

          squares.forEach(position => {
            cageStore.addSquare(self.puzzle.squares.put({
              position,
              solution: solution[position[0]][position[1]],
              cage: cageStore.id
            }))
          })
        })
      },
      selectSquareByKey(key) {
        self.ui.selectSquareByKey(key)
      },
      selectSquareByPos(pos) {
        self.ui.selectSquareByPos(pos)
      },
      fillFocusedSquare(key) {
        self.ui.focusedSquare.value = key
      },
      eraseFocusedSquare() {
        self.ui.focusedSquare.value = null
      },

    }
  })

export default Game