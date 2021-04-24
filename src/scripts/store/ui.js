// import { types } from 'mobx-state-tree'
// import { ICONS } from '../shared/constants'
// import { baseIcons } from '../shared/dom_partials'
// import { GameBase } from './base'
// import { Cage, Group } from './collections'
// import Square from './square'

// const UI = GameBase
//   .named('UI')
//   .props({
//     curSquare: types.maybeNull(types.reference(Square)),
//     curCollection: types.maybeNull(types.union(
//       types.reference(Group),
//       types.reference(Cage),
//     )),
//     isStaging: types.optional(
//       types.boolean,
//       () => false
//     ),
//     stagedPossibilities: types.optional(types.array(types.integer), () => []),
//     filterMode: types.optional(
//       types.enumeration('FilterMode', ['and', 'not', 'or']),
//       () => 'and'
//     )
//   })
//   .views(self => {
//     const baseFilterIconsFragment = () => {
//       const iconsFragment = new DocumentFragment()
//       iconsFragment.append(...baseIcons('--no-hover', '--disabled'))
//       return iconsFragment
//     }

//     return {
//       get curPosition() {
//         return self.curSquare?.position
//       },
//       get curCage() {
//         return self.curSquare?.cage
//       },
//       get curCageFilteredCombos() {
//         return self.curCage?.filteredCombos || []
//       },
//       get curCagePossibleCombos() {
//         return self.curCage?.possibleCombos || []
//       },
//       get andModeButtonClassName() {
//         return self.filterMode === 'and'
//           ? 'filter_mode-btn filter_mode-btn--selected'
//           : 'filter_mode-btn'
//       },
//       get notModeButtonClassName() {
//         return self.filterMode === 'not'
//           ? 'filter_mode-btn filter_mode-btn--selected'
//           : 'filter_mode-btn'
//       },
//       get orModeButtonClassName() {
//         return self.filterMode === 'or'
//           ? 'filter_mode-btn filter_mode-btn--selected'
//           : 'filter_mode-btn'
//       },
//       get hasStagedPossibilities() {
//         return self.stagedPossibilities.length > 0
//       },
//       get hasCurSquareValue() {
//         return self.curSquare.hasValue
//       },
//       get squareInfoSelectIsDisabled() {
//         return !self.curSquare || self.curSquare.hasValue
//       },
//       get squareInfoClearIsDisabled() {
//         return !self.curSquare
//       },
//       get squareInfoSelectClassName() {
//         return self.squareInfoSelectIsDisabled
//           ? 'square-info_btn square-info_btn--disabled'
//           : 'square-info_btn'
//       },
//       get squareInfoClearClassName() {
//         return self.squareInfoClearIsDisabled
//           ? 'square-info_btn square-info_btn--disabled'
//           : 'square-info_btn'
//       },
//       get squareInfoSelectIconClassName() {
//         return self.isStaging ? ICONS.confirm : ICONS.select
//       },
//       get squareInfoClearIconClassName() {
//         return self.isStaging
//           ? ICONS.reset
//           : ICONS.clear
//       },
//       filterIconsFragment(val) {
//         return self.curCage
//           ? self.curCage.rules.iconsFragment(val, self.filterMode)
//           : baseFilterIconsFragment()
//       },
//       squareInfoPossibilityClassName(val) {
//         return self.curSquare
//           ? self.curSquare.infoPossibilityClassName(val)
//           : 'square-info_possibility square-info_possibility--disabled'
//       },
//       squareInfoPossibilityIconClassNames(val) {
//         return self.curSquare
//           ? self.curSquare.infoPossibilityIconClassNames(val)
//           : { hover: ICONS.circle, noHover: ICONS.circle }
//       },
//     }
//   })
//   .actions(self => {
//     return {
//       selectSquareByDir(dir) {
//         const [curRow, curCol] = self.curPosition

//         let newPos
//         switch (dir) {
//           case 'Up': {
//             newPos = [curRow - 1, curCol]
//             break
//           }
//           case 'Right': {
//             newPos = [curRow, curCol + 1]
//             break
//           }
//           case 'Down': {
//             newPos = [curRow + 1, curCol]
//             break
//           }
//           case 'Left': {
//             newPos = [curRow, curCol - 1]
//             break
//           }
//         }

//         self.selectSquareByPos(newPos)
//       },
//       selectSquareByPos(pos) {
//         const newSquare = self.rootPuzzle.getSquareByPos(pos)
//         if (newSquare) {
//           self.curSquare = newSquare
//         }
//       },
//       clearStagedPossibilities() {
//         self.stagedPossibilities = []
//       },
//       toggleStagedPossibility(val) {
//         const valIndex = self.stagedPossibilities.indexOf(val)

//         if (valIndex >= 0) {
//           self.stagedPossibilities.splice(valIndex, 1)
//         } else {
//           self.stagedPossibilities.push(val)
//         }
//       },
//       toggleRulePossibility(val) {
//         self.curCage.rules.toggle(val, self.filterMode)
//       },
//       setFilterMode(mode) {
//         self.filterMode = mode
//       }
//     }
//   })

// export default UI

import { types } from 'mobx-state-tree'
import { ICONS } from '../shared/constants'
import { baseIcons, filterPossibilityClassName } from '../shared/dom_partials'
import { generateClassName } from '../shared/general_util'
import { GameBase } from './base'
import { Cage, Group } from './collections'
import Square from './square'

const UI = GameBase
  .named('UI')
  .props({
    curSquare: types.maybeNull(types.reference(Square)),
    curCollection: types.maybeNull(types.union(
      types.reference(Group),
      types.reference(Cage),
    )),
    isStaging: types.optional(
      types.boolean,
      () => false
    ),
    stagedPossibilities: types.optional(types.array(types.integer), () => []),
    filterMode: types.optional(
      types.enumeration('FilterMode', ['and', 'not', 'or']),
      () => 'and'
    )
  })
  .views(self => {
    return {
      get curPosition() {
        return self.curSquare?.position
      },
      get curCage() {
        return self.curSquare?.cage
      },
      get curCageFilteredCombos() {
        return self.curCage?.filteredCombos || []
      },
      get curCagePossibleCombos() {
        return self.curCage?.possibleCombos || []
      },
      get filterClassName() {
        return generateClassName('collection-filter', [self.filterMode])
      },
      get andModeButtonClassName() {
        return generateClassName('filter_mode-btn', [
          [self.filterMode === 'and', 'selected']
        ])
      },
      get notModeButtonClassName() {
        return generateClassName('filter_mode-btn', [
          [self.filterMode === 'not', 'selected']
        ])
      },
      get orModeButtonClassName() {
        return generateClassName('filter_mode-btn', [
          [self.filterMode === 'or', 'selected']
        ])
      },
      get hasStagedPossibilities() {
        return self.stagedPossibilities.length > 0
      },
      get hasCurSquareValue() {
        return self.curSquare.hasValue
      },
      get squareInfoSelectIsDisabled() {
        return !self.curSquare || self.curSquare.hasValue
      },
      get squareInfoClearIsDisabled() {
        return !self.curSquare
      },
      get squareInfoSelectClassName() {
        return self.squareInfoSelectIsDisabled
          ? 'square-info_btn square-info_btn--disabled'
          : 'square-info_btn'
      },
      get squareInfoClearClassName() {
        return self.squareInfoClearIsDisabled
          ? 'square-info_btn square-info_btn--disabled'
          : 'square-info_btn'
      },
      get squareInfoSelectIconClassName() {
        return self.isStaging ? ICONS.confirm : ICONS.select
      },
      get squareInfoClearIconClassName() {
        return self.isStaging
          ? ICONS.reset
          : ICONS.clear
      },
      filterNoHoverIcons(val) {
        return self.curCage
          ? self.curCage.filter.noHoverIcons(val)
          : baseIcons()
      },
      filterHoverIcons(val) {
        return self.curCage
          ? self.curCage.filter.hoverIcons(val, self.filterMode)
          : baseIcons()
      },
      filterPossibilityClassName(val) {
        return self.curCage
          ? self.curCage.filter.className(val, self.filterMode)
          : filterPossibilityClassName('none', 'disabled')
      },
      squareInfoPossibilityClassName(val) {
        return self.curSquare
          ? self.curSquare.infoPossibilityClassName(val)
          : 'square-info_possibility square-info_possibility--disabled'
      },
      squareInfoPossibilityIconClassNames(val) {
        return self.curSquare
          ? self.curSquare.infoPossibilityIconClassNames(val)
          : { hover: ICONS.circle, noHover: ICONS.circle }
      },
    }
  })
  .actions(self => {
    return {
      selectSquareByDir(dir) {
        const [curRow, curCol] = self.curPosition

        let newPos
        switch (dir) {
          case 'Up': {
            newPos = [curRow - 1, curCol]
            break
          }
          case 'Right': {
            newPos = [curRow, curCol + 1]
            break
          }
          case 'Down': {
            newPos = [curRow + 1, curCol]
            break
          }
          case 'Left': {
            newPos = [curRow, curCol - 1]
            break
          }
        }

        self.selectSquareByPos(newPos)
      },
      selectSquareByPos(pos) {
        const newSquare = self.rootPuzzle.getSquareByPos(pos)
        if (newSquare) {
          self.curSquare = newSquare
        }
      },
      clearStagedPossibilities() {
        self.stagedPossibilities = []
      },
      toggleStagedPossibility(val) {
        const valIndex = self.stagedPossibilities.indexOf(val)

        if (valIndex >= 0) {
          self.stagedPossibilities.splice(valIndex, 1)
        } else {
          self.stagedPossibilities.push(val)
        }
      },
      toggleFilterPossibility(val) {
        self.curCage.filter.toggle(val, self.filterMode)
      },
      clearFilterMode() {
        if (self.curCage) {
          self.curCage.filter.clearMode(self.filterMode)
        }
      },
      clearFilter() {
        if (self.curCage) {
          self.curCage.filter.initialize(self.env.globals.size)
        }
      },
      setFilterMode(mode) {
        self.filterMode = mode
      },
      changeFilterModeByDir(dir) {
        const modes = ['and', 'not', 'or']
        console.log('a', dir)
        const idxDiff = dir === 'Left' ? -1 : 1
        const newIdx = (modes.indexOf(self.filterMode) + idxDiff + 3) % 3
        self.filterMode = modes[newIdx]
      },
    }
  })

export default UI