import { types } from "mobx-state-tree";
import { GameBase } from "./base";
import Puzzle from './puzzle'

const Meta = GameBase
  .named('Meta')
  .props({
    implications: types.optional(
      types.array(types.array(types.number)),
      () => []
    ),
    mainId: types.maybeNull(types.integer),
    ifId: types.maybeNull(types.integer),
    mode: types.optional(
      types.enumeration('Mode', ['main', 'if', 'then']),
      () => 'main'
    )
  })
  .volatile(self => {
    return {
      _stagedMain: { id: null, puzzle: null },
      _stagedIf: { id: null, puzzle: null }
    }
  })
  .views(self => {
    return {
      get mainSnapshot() {
        return self.env.snapshots[self.mainId]
      },
      get ifSnapshot() {
        return self.env.snapshots[self.ifId]
      },
      get stagedMain() {
        const { id, puzzle } = self._stagedMain
        if (self.mode !== 'if' && self.mode !== 'then') {
          return null
        } else if (id === self.mainId && puzzle) {
          return puzzle
        } else {
          const puzzle = Puzzle.create(self.mainSnapshot)
          self._stagedMain = { id: self.mainId, puzzle }
          return puzzle
        }
      },
      get stagedIf() {
        const { id, puzzle } = self._stagedIf
        if (self.mode !== 'then') {
          return null
        } else if (id === self.ifId && puzzle) {
          return puzzle
        } else {
          const puzzle = Puzzle.create(self.ifSnapshot)
          self._stagedIf = { id: self.ifId, puzzle }
          return puzzle
        }
      },
    }
  })
  .actions(self => {
    return {
      enterIf(mainId) {
        self.mainId = mainId
        self.mode = 'if'
      },
      enterThen(ifId) {
        self.ifId = ifId
        self.mode = 'then'
      },
      setImplication(thenId) {
        const implication = [self.ifId, thenId]
        self.implications.push(implication)
      },
      clearImplication() {
        self._stagedMain = { id: null, puzzle: null }
        self._stagedIf = { id: null, puzzle: null }
        self.mainId = null
        self.ifId = null
        self.mode = 'main'
      }
    }
  })

export default Meta