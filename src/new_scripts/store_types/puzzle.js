import { types } from 'mobx-state-tree'
import { nextId } from '../util'
import { Id, GameBase } from './base'
import { Cage, Group } from './collections'
import Square from './square'

const Puzzle = GameBase
  .named('Puzzle')
  .props({
    id: Id,
    uuid: types.optional(types.string, nextId),
    squares: types.map(Square),
    cages: types.map(Cage),
    groups: types.map(Group),
  })
  .views(self => {
    const posToIdMap = {}

    return {
      get collections() {
        return [...self.cages.values(), ...self.groups.values()]
      },
      get squaresArray() {
        return Array.from(self.squares.values())
      },
      get cagesArray() {
        return Array.from(self.cages.values())
      },
      get groupsArray() {
        return Array.from(self.groups.values())
      },
      getSquareByPos(pos) {
        if (!self.isValidPos(pos)) return null;

        const strPos = pos.join(',')
        if (!posToIdMap[strPos]) {
          posToIdMap[strPos] = self.squaresArray
            .find(sq => sq.position.join(',') === strPos)
        }

        return posToIdMap[strPos]
      },
      getCollectionsBySquare(square) {
        return self.collections.filter(c => c.squares.includes(square))
      },
      isValidPos(pos) {
        return pos.every(n => n >= 0 && n <= 9)
      }
    }
  })
  .actions(self => {
    return {
      resetUuid() {
        self.uuid = nextId()
      }
    }
  })

export default Puzzle