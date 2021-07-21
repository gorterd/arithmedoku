import { flow, types } from 'mobx-state-tree'
import { ICONS } from '../shared/constants'
import { wait, classes, arrayUnion } from '../shared/general_util'
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
          return classes(
            'square',
            [self.status === 'mistake', 'square--mistake'],
            [self.status === 'conflict', 'square--conflict'],
            [self.isFocused, 'square--focused'],
          )
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
          const template = document.getElementById('square-template')
          const ele = template.content.firstElementChild.cloneNode(true)
          ele.dataset.pos = self.dataPos
          return ele
        },
        conflictingSquares(val) {
          return val === null
            ? []
            : self.rowColSquares.filter(square => square.value === val)
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
          return (
            !self.collectionPossibilities.includes(val)
          )
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
        possibilityClassName(val) {
          return (
            self.shouldShowPossibilities
            && self.displayedPossibilities.includes(val)
          )
            ? 'square_possibility square_possibility--show'
            : 'square_possibility'
        },
        infoPossibilityStagingClassName(val) {
          return self.isStagedPossibility(val)
            ? 'square-info_possibility--possible'
            : 'square-info_possibility--staged-eliminated'
        },
        infoPossibilityClassName(val) {
          const classesArgs = ['square-info_possibility']

          if (self.hasValue) {
            classesArgs.push(self.value === val
              ? 'square-info_possibility--chosen'
              : 'square-info_possibility--unchosen'
            )
          } else {
            classesArgs.push(
              [self.isCollectionEliminatedValue(val),
                'square-info_possibility--collection-eliminated'],
              [self.isAutoEliminatedValue(val),
                'square-info_possibility--auto-eliminated']
            )

            if (self.isStaging) {
              classesArgs.push(self.infoPossibilityStagingClassName(val))
            } else {
              classesArgs.push(
                [self.isPossibleValue(val),
                  'square-info_possibility--possible'],
                [self.isActiveMistake(val),
                  'square-info_possibility--mistake'],
                [self.isSquareEliminatedValue(val),
                  'square-info_possibility--square-eliminated'],
              )
            }
          }

          return classes(...classesArgs)
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
        setMistake: flow(function* setMistake(val) {
          self.mistakeValue = val
          self.status = 'mistake'
          yield wait(self.env.globals.mistakeTimeoutMs)
          self.status = 'none'
          self.mistakeValue = null
        }),
        setConflict: flow(function* setConflict() {
          self.status = 'conflict'
          yield wait(self.env.globals.mistakeTimeoutMs)
          self.status = 'none'
        }),
        togglePossibility(val) {
          const valIndex = self.eliminatedPossibilities.indexOf(val)

          if (valIndex >= 0) {
            self.eliminatedPossibilities.splice(valIndex, 1)
          } else {
            self.eliminatedPossibilities.push(val)
          }
        },
        setStagedPossibilities() {
          self.eliminatedPossibilities = initialPossibilities
            .filter(num => !self.rootUi.stagedPossibilities.includes(num))
        },
      }
    }
  })

export default Square