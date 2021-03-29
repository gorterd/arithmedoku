import { types, getRoot } from 'mobx-state-tree'
import { nextId } from '../util'

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
      get rootOptions() {
        return getRoot(self).options
      },
      get rootUi() {
        return getRoot(self).ui
      },
      get rootPuzzle() {
        return getRoot(self).puzzle
      }
    }
  })

export const Filter = types
  .model('Filter', {
    includesAll: types.array(types.integer),
    includesOne: types.array(types.array(types.integer)),
    includesNone: types.array(types.integer),
  })
  .views(self => ({
    isPossibleCombination(combo) {
      return (
        self.includesAll
          .every(num => combo.includes(num))
        && self.includesOne.every(arr => arr.some(num => combo.includes(num)))
        && self.includesNone.every(num => !combo.includes(num))
      )
    },
    isRequiredValue(value) {
      return self.includesAll.includes(value)
    },
    isEliminatedValue(value) {
      return self.includesNone.includes(value)
    }
  }))

