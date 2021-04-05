import { flow, types } from 'mobx-state-tree'
import { wait, classes, arrayUnion } from '../util/general_util'
import { Id, Position, GameBase } from './base'
import { Cage } from './collections'

const Square = GameBase
  .named('Square')
  .props({
    id: Id,
    position: Position,
    cage: types.maybeNull(types.reference(types.late(() => Cage))),
    value: types.maybeNull(types.integer),
    solution: types.integer,
    eliminatedValues: types.optional(types.array(types.integer), () => []),
    status: types.maybeNull(
      types.enumeration('Status', ['mistake', 'conflict'])
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
            !self.eliminatedValues.includes(val)
          )
        },
        get squareAndCollectionPossibilities() {
          return self.collectionPossibilities
            .filter(val => self.squarePossiblities.includes(val))
        },
        get possibilities() {
          return typeof self.value === 'number'
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
        get isConflicting() {
          return self.conflictingSquares.length > 0
        },
        get isTopSquare() {
          return self.cage.bounds.topSquares.includes(self)
        },
        get isLeftSquare() {
          return self.cage.bounds.leftSquares.includes(self)
        },
        get isFocused() {
          return self.rootUi.focusedSquare === self
        },
        get label() {
          return self.cage.anchor === self ? self.cage.labelText : ''
        },
        get className() {
          return classes(
            'square',
            [self.isTopSquare, 'square--top-bound'],
            [self.isLeftSquare, 'square--left-bound'],
            [self.status === 'mistake', 'square--mistake'],
            [self.status === 'conflict', 'square--conflict'],
          )
        },
        get inlineStyle() {
          return `grid-area: ${self.row + 1} / ${self.col + 1} / span 1 / span 1;`
        },
        get shouldShowPossibilities() {
          return (
            self.rootOptions.maxDisplayedPossibilities >= self.possibilities.length
            && self.value === null
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
          return self.eliminatedValues.includes(val)
        },
        isCollectionEliminatedValue(val) {
          return (
            self.squarePossiblities.includes(val)
            && !self.collectionPossibilities.includes(val)
          )
        },
        isAutoEliminatedValue(val) {
          return (
            self.rootOptions.autoEliminate
            && self.squareAndCollectionPossibilities.includes(val)
            && self.rowColValues.includes(val)
          )
        },
        isActiveMistake(val) {
          return self.status === 'mistake' && self.value === val
        },
        possibilityClassName(val) {
          return self.shouldShowPossibilities && self.possibilities.includes(val)
            ? 'square_possibility square_possibility--show'
            : 'square_possibility'
        },
        infoPossibilityClassName(val) {
          return classes(
            'square-info_possibility',
            [self.isPossibleValue(val),
              'square-info_possibility--possible'],
            [self.isActiveMistake(val),
              'square-info_possibility--mistake'],
            [self.isCollectionEliminatedValue(val),
              'square-info_possibility--collectionEliminated'],
            [self.isSquareEliminatedValue(val),
              'square-info_possibility--squareEliminated'],
            [self.isAutoEliminatedValue(val),
              'square-info_possibility--autoEliminated'],
          )
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
          const oldVal = self.value
          self.value = val
          self.status = 'mistake'
          yield wait(self.env.globals.mistakeTimeoutMs)
          self.status = null
          self.value = oldVal
        }),
        setConflict: flow(function* setConflict() {
          self.status = 'conflict'
          yield wait(self.env.globals.mistakeTimeoutMs)
          self.status = null
        }),
        eliminateValue(val) {
          if (!self.eliminatedValues.includes(val)) {
            self.eliminatedValues.push(val)
          }
        },
        uneliminateValue(val) {
          const valIndex = self.eliminatedValues.indexOf(val)

          if (valIndex >= 0) {
            self.eliminatedValues.splice(valIndex, 1)
          }
        },
        setPossibilities(nums) {
          self.eliminatedValues = initialPossibilities
            .filter(num => !nums.includes(num))
        }
      }
    }
  })

export default Square