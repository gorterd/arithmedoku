import { types, getRoot, getEnv } from 'mobx-state-tree'
import { nextId } from '../../src/scripts/shared/general_util'

export const Id = types.optional(types.identifier, nextId)

export const Position = types.refinement(
  'Position',
  types.array(types.integer),
  array => array.length === 2
)

export const GameBase = types
  .model('GameBase')
  .views(self => {
    return {
      get root() {
        return getRoot(self)
      },
      get rootOptions() {
        return self.root?.options
      },
      get rootUi() {
        return self.root?.ui
      },
      get rootPuzzle() {
        return self.root.puzzle
      },
      get env() {
        return getEnv(self)
      },
    }
  })