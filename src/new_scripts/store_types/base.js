import { types, getRoot, getEnv } from 'mobx-state-tree'
import { nextId, includesArray, indexOfArray } from '../util'

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
      },
      get env() {
        return getEnv(self)
      },
      get globals() {
        return self.env?.globals
      }
    }
  })

export const Rules = GameBase
  .named('Rules')
  .props({
    includesAll: types.array(types.integer),
    includesOne: types.array(types.array(types.integer)),
    includesNone: types.array(types.integer),
  })
  .views(self => ({
    isPossibleCombination(combo) {
      return (
        self.includesAll.every(num => combo.includes(num))
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
  .actions(self => {
    return {
      requireValue(val) {
        if (!self.includesAll.includes(val)) {
          self.includesAll.push(val)
        }
      },
      unrequireValue(val) {
        const valIndex = self.includesAll.indexOf(val)

        if (valIndex >= 0) {
          self.includesAll.splice(valIndex, 1)
        }
      },
      eliminateValue(val) {
        if (!self.includesNone.includes(val)) {
          self.includesNone.push(val)
        }
      },
      uneliminateValue(val) {
        const valIndex = self.includesNone.indexOf(val)

        if (valIndex >= 0) {
          self.includesNone.splice(valIndex, 1)
        }
      },
      requireOneOfValues(valArray) {
        if (!includesArray(self.includesOne, valArray)) {
          self.includesOne.push(valArray)
        }
      },
      unrequireOneOfValues(valArray) {
        const valArrayIndex = indexOfArray(self.includesOne, valArray)

        if (valArrayIndex >= 0) {
          self.includesOne.splice(valArrayIndex, 1)
        }
      },
    }
  })

