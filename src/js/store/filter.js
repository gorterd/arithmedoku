import { types } from 'mobx-state-tree'
import {
  alternativeIcons,
  baseIcons,
  requiredIcons,
  eliminatedIcons,
} from '../shared/dom_partials'
import { generateClassName, stringSwitch } from '../shared/general_util'
import { GameBase } from './base'

const FilterPossibility = GameBase
  .named('FilterPossibility')
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
  })
  .views(self => {
    const modeStatusMap = {
      and: 'required',
      not: 'eliminated',
      or: 'alternative',
    }

    const hoverFlag = mode => {
      if (!self.matchesMode(mode)) {
        return `hover-${modeStatusMap[mode]}`
      }
    }

    const getStatusIcon = status => stringSwitch(status, ({ _case }) => {
      _case('required', () => requiredIcons())
      _case('eliminated', () => eliminatedIcons())
      _case('alternative', () => alternativeIcons())
      _case('none', () => baseIcons())
    })

    return {
      get noHoverIcons() {
        return getStatusIcon(self.status)
      },
      matchesMode(mode) {
        return self.status === modeStatusMap[mode]
      },
      hoverIcons(mode) {
        return self.matchesMode(mode)
          ? getStatusIcon(self.status)
          : getStatusIcon(modeStatusMap[mode])
      },
      className(mode) {
        return generateClassName('filter-possibility', [
          self.status,
          hoverFlag(mode),
        ])
      },
    }
  })
  .actions(self => {
    return {
      toggle(status) {
        self.status = self.status === status
          ? 'none'
          : status
      },
    }
  })

const Filter = GameBase
  .named('Filter')
  .props({
    possibilities: types.optional(
      types.array(FilterPossibility),
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
    getPossibilityByValue(val) {
      return self.possibilities.find(possibility => possibility.value === val)
    },
    filterPossibilityStatus(val) {
      return self.getPossibilityByValue(val).status
    },
    isRequiredValue(val) {
      return self.filterPossibilityStatus(val) === 'required'
    },
    isEliminatedValue(val) {
      return self.filterPossibilityStatus(val) === 'eliminated'
    },
    isAlternativeValue(val) {
      return self.filterPossibilityStatus(val) === 'alternative'
    },
    isStandardValue(val) {
      return self.filterPossibilityStatus(val) === 'none'
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
    noHoverIcons(val) {
      return self.getPossibilityByValue(val).noHoverIcons
    },
    hoverIcons(val, mode) {
      return self.getPossibilityByValue(val).hoverIcons(mode)
    },
    className(val, mode) {
      return self.getPossibilityByValue(val).className(mode)
    },
  }))
  .actions(self => {
    return {
      initialize(size) {
        self.possibilities = Array.from(
          Array(size),
          (_, idx) => FilterPossibility.create({ value: idx + 1 })
        )
      },
      toggle(val, mode) {
        const status = stringSwitch(mode, ({ _case }) => {
          _case('and', () => 'required')
          _case('not', () => 'eliminated')
          _case('or', () => 'alternative')
        })
        self.getPossibilityByValue(val).toggle(status)
      },
      clearMode(mode) {
        self.possibilities.forEach(possibility => {
          if (possibility.matchesMode(mode)) {
            possibility.status = 'none'
          }
        })
      },
      reset() {
        self.possibilities.forEach(possibility => possibility.status = 'none')
      }
    }
  })

export default Filter