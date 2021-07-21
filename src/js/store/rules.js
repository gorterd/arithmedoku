import { types } from 'mobx-state-tree'
import {
  alternativeIcons,
  baseIcons,
  requiredIcons,
  eliminatedIcons
} from '../shared/dom_partials'
import { stringSwitch } from '../shared/general_util'
import { GameBase } from './base'

const RulePossibility = GameBase
  .named('RulePossibility')
  .props({
    value: types.integer,
    status: types.optional(
      types.enumeration('Status', [
        'none',
        'required',
        'eliminated',
        'alternative'
      ]),
      () => 'none'
    ),
    value: types.integer
  })
  .views(self => {
    return {
      get noHoverIcons() {
        return stringSwitch(self.status, ({ _case }) => {
          _case('required', () => requiredIcons('--no-hover'))
          _case('eliminated', () => eliminatedIcons('--no-hover'))
          _case('alternative', () => alternativeIcons('--no-hover'))
          _case('none', () => baseIcons('--no-hover'))
        })
      },
      get standardHoverIcons() {
        return stringSwitch(self.status, ({ _case }) => {
          _case('required', () => requiredIcons('--hover'))
          _case('eliminated', () => eliminatedIcons('--hover'))
          _case('alternative', () => alternativeIcons('--hover'))
          _case('none', () => baseIcons('--hover'))
        })
      },
      get andModeIcons() {
        return stringSwitch(self.status, ({ _case, _default }) => {
          _case('none', () => requiredIcons('--hover'))
          _case('required', () => baseIcons('--hover'))
          _default(() => self.standardHoverIcons)
        })
      },
      get notModeIcons() {
        return stringSwitch(self.status, ({ _case, _default }) => {
          _case('eliminated', () => baseIcons('--hover'))
          _case('none', () => eliminatedIcons('--hover'))
          _default(() => self.standardHoverIcons)
        })
      },
      get orModeIcons() {
        return stringSwitch(self.status, ({ _case, _default }) => {
          _case('alternative', () => baseIcons('--hover'))
          _case('none', () => alternativeIcons('--hover'))
          _default(() => self.standardHoverIcons)
        })
      },
      hoverIcons(mode) {
        return stringSwitch(mode, ({ _case }) => {
          _case('and', () => self.andModeIcons)
          _case('not', () => self.notModeIcons)
          _case('or', () => self.orModeIcons)
        })
      },
      iconsFragment(mode) {
        const iconsFragment = new DocumentFragment()

        iconsFragment.append(
          ...self.noHoverIcons,
          ...self.hoverIcons(mode),
        )

        return iconsFragment
      }
    }
  })
  .actions(self => {
    return {
      toggle(status) {
        if (self.status === status) {
          self.status = 'none'
        } else if (self.status === 'none') {
          self.status = status
        } else {
          console.log(`Cannot toggle from ${self.status} to ${status}`)
        }
      },
    }
  })

const Rules = GameBase
  .named('Rules')
  .props({
    possibilities: types.optional(
      types.array(RulePossibility),
      () => []
    ),
  })
  .views(self => ({
    get required() {
      return self.possibilities
        .filter(possibility => possibility.status === 'required')
    },
    get requiredValues() {
      return self.required.map(possibility => possibility.value)
    },
    get eliminated() {
      return self.possibilities
        .filter(possibility => possibility.status === 'eliminated')
    },
    get eliminatedValues() {
      return self.eliminated.map(possibility => possibility.value)
    },
    get alternatives() {
      return self.possibilities
        .filter(possibility => possibility.status === 'alternative')
    },
    get alternativeValues() {
      return self.alternatives.map(possibility => possibility.value)
    },
    getPossibilityByVal(val) {
      return self.possibilities.find(possibility => possibility.value === val)
    },
    possibilityStatus(val) {
      return self.getPossibilityByVal(val).status
    },
    isRequiredValue(val) {
      return self.possibilityStatus(val) === 'required'
    },
    isEliminatedValue(val) {
      return self.possibilityStatus(val) === 'eliminated'
    },
    isAlternativeValue(val) {
      return self.possibilityStatus(val) === 'alternative'
    },
    isStandardValue(val) {
      return self.possibilityStatus(val) === 'none'
    },
    isPossibleCombo(combo) {
      return (
        self.requiredValues.every(val => combo.includes(val))
        && self.eliminatedValues.every(val => !combo.includes(val))
        && (
          self.alternativeValues.length === 0
          || self.alternativeValues.some(val => combo.includes(val))
        )
      )
    },
    iconsFragment(val, mode) {
      return self.getPossibilityByVal(val).iconsFragment(mode)
    }
  }))
  .actions(self => {
    return {
      initialize(size) {
        self.possibilities = Array.from(
          Array(size),
          (_, idx) => RulePossibility.create({ value: idx + 1 })
        )
      },
      toggle(val, mode) {
        const status = stringSwitch(mode, ({ _case }) => {
          _case('and', () => 'required')
          _case('not', () => 'eliminated')
          _case('or', () => 'alternative')
        })
        self.getPossibilityByVal(val).toggle(status)
      },
      toggleRequired(val) {
        self.toggle(val, 'required')
      },
      toggleEliminated(val) {
        self.toggle(val, 'eliminated')
      },
      toggleAlternative(val) {
        self.toggle(val, 'alternative')
      },
    }
  })

export default Rules