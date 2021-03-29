import { getRoot, types } from 'mobx-state-tree'
import { GameBase } from './base'
import { Cage, Group } from './collections'
import Square from './square'

const UI = GameBase
  .named('UI')
  .props({
    focusedSquare: types.maybeNull(types.reference(Square)),
    focusedGroup: types.maybeNull(types.union(
      types.reference(Group),
      types.reference(Cage),
    )),
    focusedCombination: types.maybeNull(types.array(types.integer)),
  })
  .views(self => {
    return {
      get focusedPosition() {
        return self.focusedSquare?.position
      },
    }
  })
  .actions(self => {
    return {
      selectSquareByKey(key) {
        const [curRow, curCol] = self.focusedPosition

        let newPos
        switch (key) {
          case 'ArrowUp': {
            newPos = [curRow - 1, curCol]
            break
          }
          case 'ArrowRight': {
            newPos = [curRow, curCol + 1]
            break
          }
          case 'ArrowDown': {
            newPos = [curRow + 1, curCol]
            break
          }
          case 'ArrowLeft': {
            newPos = [curRow, curCol - 1]
            break
          }
        }

        const newSquare = self.rootPuzzle.getSquareByPos(newPos)
        if (newSquare) {
          self.focusedSquare = newSquare
        }
      },
      selectSquareByPos(pos) {
        self.focusedSquare = self.rootPuzzle.getSquareByPos(pos)
      },
    }
  })

export default UI