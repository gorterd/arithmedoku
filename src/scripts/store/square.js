import { flow, setLivelinessChecking, types } from 'mobx-state-tree'
import { ICONS } from '../shared/constants'
import { wait, classes, arrayUnion, togglePresenceInArray, pushIfNotIncluded, removeIfIncluded, generateClassName } from '../shared/general_util'
import { Id, Position, GameBase } from './base'
import { Cage } from './collections'

const Square = GameBase
  .named('Square')
  .props({
    id: Id,
    position: Position,
    cage: types.maybeNull(types.reference(types.late(() => Cage))),
    value: types.maybeNull(types.integer),
    mistakeValue: types.maybeNull(types.integer),
    solution: types.integer,
    eliminatedPossibilities: types.optional(types.array(types.integer), () => []),
    status: types.optional(
      types.enumeration('Status', ['none', 'mistake', 'conflict']),
      () => 'none'
    ),
  })
  .extend(self => {
    const initialPossibilities = Array.from(Array(9), (_, idx) => idx + 1)

    return {
      views: {
        get collections() {
          return self.rootPuzzle.getCollectionsBySquare(self)
        },
        get rowSquares() {
          return self.rootPuzzle.getSquaresByRow(self.row)
            .filter(square => square !== self)
        },
        get colSquares() {
          return self.rootPuzzle.getSquaresByCol(self.col)
            .filter(square => square !== self)
        },
        get rowColSquares() {
          return [...self.rowSquares, ...self.colSquares]
        },
        get rowColValues() {
          return self.rowColSquares
            .map(square => square.value)
            .filter(val => typeof val === 'number')
        },
        get collectionPossibilities() {
          return initialPossibilities.filter(val =>
            self.collections.every(c => c.isPossibleValue(val))
          )
        },
        get squarePossiblities() {
          return initialPossibilities.filter(val =>
            !self.eliminatedPossibilities.includes(val)
          )
        },
        get squareAndCollectionPossibilities() {
          return self.collectionPossibilities
            .filter(val => self.squarePossiblities.includes(val))
        },
        get possibilities() {
          return self.hasValue
            ? [self.value]
            : self.squareAndCollectionPossibilities
              .filter(val => !self.isAutoEliminatedValue(val))
        },
        get dataPos() {
          return self.position.join(',')
        },
        get row() {
          return self.position[0]
        },
        get col() {
          return self.position[1]
        },
        get isCorrect() {
          return self.value === self.solution
        },
        get isCageTop() {
          return self.row > 0 && self.cage.bounds.topSquares.includes(self)
        },
        get isCageLeft() {
          return self.col > 0 && self.cage.bounds.leftSquares.includes(self)
        },
        get isFocused() {
          return self.rootUi.curSquare === self
        },
        get isSelected() {
          return (
            !self.isFocused
            && self.rootUi.selectedSquares.includes(self)
          )
        },
        get isStaging() {
          return self.isFocused && self.rootUi.isStaging
        },
        get hasEliminations() {
          return self.eliminatedPossibilities.length > 0
        },
        get hasValue() {
          return typeof self.value === 'number'
        },
        get label() {
          return self.cage.anchor === self ? self.cage.labelText : ''
        },
        get displayedValue() {
          return self.status === 'mistake'
            ? self.mistakeValue
            : self.value
        },
        get displayedPossibilities() {
          return self.isStaging
            ? self.rootUi.stagedPossibilities
            : self.possibilities
        },
        get className() {
          return generateClassName('square', [
            [self.status !== 'none', self.status],
            [self.isFocused, 'focused'],
            [self.isSelected, 'selected']
          ])
        },
        get shouldShowPossibilities() {
          return (
            self.rootOptions.maxDisplayedPossibilities >=
            self.displayedPossibilities.length
            && self.value === null
            && self.mistakeValue === null
          )
        },
        get initialHtml() {
          const ele = self.env.templates.square.cloneNode(true)
          ele.dataset.pos = self.dataPos
          return ele
        },
        conflictingSquares(val) {
          return val === null
            ? []
            : self.rowColSquares.filter(square => square.value === val)
        },
        possibilityStatuses(val) {
          if (self.hasValue) {
            return self.value === val ? ['chosen'] : ['unchosen']
          } else {
            let statuses = []

            if (self.isSquareEliminatedValue(val)) {
              statuses.push('square-eliminated')
            }
            if (self.isCollectionEliminatedValue(val)) {
              statuses.push('collection-eliminated')
            }
            if (self.isAutoEliminatedValue(val)) {
              statuses.push('auto-eliminated')
            }

            return statuses.length > 0 ? statuses : ['possible']
          }
        },
        isPossibleValue(val) {
          return val === null || val === self.value
            ? true
            : self.possibilities.includes(val)
        },
        isSquareEliminatedValue(val) {
          return self.eliminatedPossibilities.includes(val)
        },
        isCollectionEliminatedValue(val) {
          return !self.collectionPossibilities.includes(val)
        },
        isAutoEliminatedValue(val) {
          return (
            self.rootOptions.autoEliminate
            && self.rowColValues.includes(val)
          )
        },
        isActiveMistake(val) {
          return (
            self.status === 'mistake'
            && self.mistakeValue === val
            && !self.isAutoEliminatedValue(val)
          )
        },
        isStagedPossibility(val) {
          return self.rootUi.stagedPossibilities.includes(val)
        },
        isVisiblePossibility(val) {
          return (
            self.shouldShowPossibilities
            && self.displayedPossibilities.includes(val)
          )
        },
        possibilityClassName(val) {
          return generateClassName('square_possibility', [
            [self.isVisiblePossibility(val), 'show']
          ])
        },
        infoPossibilityStagingClassName(val) {
          return self.isStagedPossibility(val)
            ? 'possible'
            : 'staged-eliminated'
        },
        infoPossibilityClassName(val) {
          return generateClassName('square-info_possibility',
            self.isStaging
              ? [self.infoPossibilityStagingClassName(val)]
              : [
                [self.isActiveMistake(val), 'mistake'],
                ...self.possibilityStatuses(val)
              ]
          )
        },
        infoPossibilityIconClassNames(val) {
          if (self.isStaging) {
            return self.isStagedPossibility(val)
              ? { hover: ICONS.ban, noHover: ICONS.circle }
              : { hover: ICONS.circle, noHover: ICONS.ban }
          } else {
            return self.isSquareEliminatedValue(val) && !self.hasValue
              ? { hover: ICONS.ban, noHover: ICONS.ban }
              : { hover: ICONS.ban, noHover: ICONS.circle }
          }
        },
        isBelow(otherSquare) {
          return (
            otherSquare.row === self.row - 1
            && otherSquare.col === self.col
          )
        },
        isRightOf(otherSquare) {
          return (
            otherSquare.row === self.row
            && otherSquare.col === self.col - 1
          )
        },
        isAbove(otherSquare) {
          return otherSquare.isBelow(self)
        },
        isLeftOf(otherSquare) {
          return otherSquare.isRightOf(self)
        },
        comesBefore(otherSquare) {
          switch (Math.sign(otherSquare.row - self.row)) {
            case 1:
              return true
            case 0:
              return otherSquare.col > self.col
            case -1:
              return false
          }
        },
        isLogicalSupersetOf(otherSquare) {
          return otherSquare.possibilities.every(self.isPossibleValue)
        },
        isLogicalSubsetOf(otherSquare) {
          return otherSquare.isLogicalSupersetOf(self)
        },
        isConsistentWith(otherSquare) {
          const possibilityOverlap = arrayUnion(
            otherSquare.possibilities,
            self.possibilities
          )

          return possibilityOverlap.length > 0
        }
      },
      actions: {
        setMistake: flow(function* (val) {
          self.mistakeValue = val
          self.status = 'mistake'
          yield wait(self.env.globals.mistakeTimeoutMs)
          self.status = 'none'
          self.mistakeValue = null
        }),
        setConflict: flow(function* () {
          self.status = 'conflict'
          yield wait(self.env.globals.mistakeTimeoutMs)
          self.status = 'none'
        }),
        togglePossibility(val) {
          togglePresenceInArray(self.eliminatedPossibilities, val)
        },
        eliminatePossibility(val) {
          pushIfNotIncluded(self.eliminatedPossibilities, val)
        },
        uneliminatePossibility(val) {
          removeIfIncluded(self.eliminatedPossibilities, val)
        },
        setStagedPossibilities() {
          self.eliminatedPossibilities = initialPossibilities
            .filter(num => !self.rootUi.stagedPossibilities.includes(num))
        },
        reset() {
          self.status = 'none'
          self.value = null
          self.mistakeValue = null
          self.eliminatedPossibilities = []
        }
      }
    }
  })

export default Square