import { types } from 'mobx-state-tree'

import { GameBase } from './base'

const Rules = GameBase
  .named('Rules')
  .props({
    includesAll: types.array(types.integer),
    includesOne: types.optional(
      types.array(types.array(types.integer)),
      () => [[]]
    ),
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
    valueStatus(val) {
      if (self.includesAll.includes(val)) {
        return 'required'
      } else if (self.includesNone.includes(val)) {
        return 'eliminated'
      } else if (self.includesOne.some(sub => sub.includes(val))) {
        return 'alternative'
      } else {
        return 'none'
      }
    },
    isRequiredValue(value) {
      return self.valueStatus(value) === 'required'
    },
    isEliminatedValue(value) {
      return self.valueStatus(value) === 'eliminated'
    },
    isAlternativeValue(value) {
      return self.valueStatus(value) === 'alternative'
    },
    isStandardValue(value) {
      return self.valueStatus(value) === 'none'
    }
  }))
  .actions(self => {
    return {
      toggleRequiredValue(val) {
        const valIndex = self.includesAll.indexOf(val)

        if (valIndex >= 0) {
          self.includesAll.splice(valIndex, 1)
        } else {
          self.includesAll.push(val)
        }
      },
      toggleEliminatedValue(val) {
        const valIndex = self.includesNone.indexOf(val)

        if (valIndex >= 0) {
          self.includesNone.splice(valIndex, 1)
        } else {
          self.includesNone.push(val)
        }
      },
      toggleAlternativeValue(val) {
        const valIndex = self.includesOne[0].indexOf(val)

        if (valIndex >= 0) {
          self.includesOne[0].splice(valIndex, 1)
        } else {
          self.includesOne[0].push(val)
        }
      },
    }
  })

export default Rules