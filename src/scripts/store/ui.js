import { types } from 'mobx-state-tree'
import { ICONS } from '../util/constants'
import { GameBase } from './base'
import { Cage, Group } from './collections'
import Square from './square'

const UI = GameBase
  .named('UI')
  .props({
    focusedSquare: types.maybeNull(types.reference(Square)),
    focusedCollection: types.maybeNull(types.union(
      types.reference(Group),
      types.reference(Cage),
    )),
    isStaging: types.optional(
      types.boolean,
      () => false
    ),
    stagedPossibilities: types.optional(types.array(types.integer), () => []),
  })
  .views(self => {
    return {
      get focusedPosition() {
        return self.focusedSquare?.position
      },
      get focusedCage() {
        return self.focusedSquare?.cage
      },
      get focusedCageRulePossibleCombinations() {
        return self.focusedCage?.rulePossibleCombinations || []
      },
      get focusedCagePossibleCombinations() {
        return self.focusedCage?.possibleCombinations || []
      },
      get hasStagedPossibilities() {
        return self.stagedPossibilities.length > 0
      },
      get hasFocusedSquareValue() {
        return self.focusedSquare.hasValue
      },
      get squareInfoSelectIsDisabled() {
        return !self.focusedSquare || self.focusedSquare.hasValue
      },
      get squareInfoClearIsDisabled() {
        return !self.focusedSquare
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
      squareInfoPossibilityClassName(val) {
        return self.focusedSquare
          ? self.focusedSquare.infoPossibilityClassName(val)
          : 'square-info_possibility square-info_possibility--disabled'
      },
      squareInfoPossibilityIconClassNames(val) {
        return self.focusedSquare
          ? self.focusedSquare.infoPossibilityIconClassNames(val)
          : { hover: ICONS.circle, noHover: ICONS.circle }
      },
    }
  })
  .actions(self => {
    return {
      selectSquareByDir(dir) {
        const [curRow, curCol] = self.focusedPosition

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

        const newSquare = self.rootPuzzle.getSquareByPos(newPos)
        if (newSquare) {
          self.focusedSquare = newSquare
        }
      },
      selectSquareByPos(pos) {
        self.focusedSquare = self.rootPuzzle.getSquareByPos(pos)
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
      }
    }
  })

export default UI