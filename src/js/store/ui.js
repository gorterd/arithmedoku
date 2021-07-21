import { types } from 'mobx-state-tree'
import { ICONS } from '../shared/constants'
import { baseIcons } from '../shared/dom_partials'
import {
  generateClassName,
  getInterveningPositions,
  stringSwitch,
  togglePresenceInArray
} from '../shared/general_util'
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
    ),
    selectedSquares: types.optional(
      types.array(types.reference(Square)),
      () => []
    ),
    tentativeSelections: types.optional(
      types.array(types.reference(Square)),
      () => []
    ),
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
      get hasStagedPossibilities() {
        return self.stagedPossibilities.length > 0
      },
      get squareInfoSelectClassName() {
        return generateClassName('square-info_btn', [
          [!self.curSquare || self.curSquare.hasValue, 'disabled']
        ])
      },
      get squareInfoClearClassName() {
        return generateClassName('square-info_btn', [
          [!self.curSquare, 'disabled']
        ])
      },
      get squareInfoSelectIconClassName() {
        return self.isStaging ? ICONS.confirm : ICONS.select
      },
      get squareInfoClearIconClassName() {
        return self.isStaging ? ICONS.reset : ICONS.clear
      },
      get lastSelectedSquare() {
        return self.selectedSquares[self.selectedSquares.length - 1]
      },
      get hasSelection() {
        return self.selectedSquares.length > 1
      },
      get shouldShowCollection() {
        return self.curCage && !self.hasSelection
      },
      get collectionClassName() {
        return generateClassName('collection-info', [
          [self.shouldShowCollection, self.filterMode, 'none']
        ])
      },
      get selections() {
        return self.selectedSquares.concat(
          self.tentativeSelections
            .filter(square => !self.selectedSquares.includes(square))
        )
      },
      isValidPos(pos) {
        return pos.every(coord => coord >= 0 && coord < self.env.globals.size)
      },
      isSelectionEliminatedValue(val) {
        return self.selectedSquares.every(square =>
          square.isSquareEliminatedValue(val))
      },
      selectionPossibilityStatuses(val) {
        const squareStatuses = self.selectedSquares
          .map(square => square.possibilityStatuses(val))

        const sharedStatuses = [
          'square-eliminated',
          'collection-eliminated',
          'auto-eliminated',
        ].filter(status => squareStatuses.every(s => s.includes(status)))

        return sharedStatuses.length > 0 ? sharedStatuses : ['possible']
      },
      filterNoHoverIcons(val) {
        return self.shouldShowCollection
          ? self.curCage.filter.noHoverIcons(val)
          : baseIcons()
      },
      filterHoverIcons(val) {
        return self.shouldShowCollection
          ? self.curCage.filter.hoverIcons(val, self.filterMode)
          : baseIcons()
      },
      filterPossibilityClassName(val) {
        return self.shouldShowCollection
          ? self.curCage.filter.className(val, self.filterMode)
          : generateClassName('filter-possibility', ['none', 'disabled'])
      },
      squareInfoPossibilityClassName(val) {
        if (self.hasSelection) {
          return generateClassName(
            'square-info_possibility',
            self.selectionPossibilityStatuses(val)
          )
        } else {
          return self.curSquare
            ? self.curSquare.infoPossibilityClassName(val)
            : generateClassName('square-info_possibility', ['disabled'])
        }
      },
      squareInfoPossibilityIconClassNames(val) {
        if (self.hasSelection) {
          return self.isSelectionEliminatedValue(val)
            ? { hover: ICONS.ban, noHover: ICONS.ban }
            : { hover: ICONS.ban, noHover: ICONS.circle }
        } else {
          return self.curSquare
            ? self.curSquare.infoPossibilityIconClassNames(val)
            : { hover: ICONS.circle, noHover: ICONS.circle }
        }
      },
    }
  })
  .actions(self => {
    const posInDir = (startingPos, dir) => {
      const [startRow, startCol] = startingPos
      const endPos = stringSwitch(dir, ({ _case }) => {
        _case('Up', () => [startRow - 1, startCol])
        _case('Right', () => [startRow, startCol + 1])
        _case('Down', () => [startRow + 1, startCol])
        _case('Left', () => [startRow, startCol - 1])
      })
      return self.isValidPos(endPos)
        ? endPos
        : false
    }

    return {
      reset() {
        self.curSquare = null
        self.curCollection = null
        self.isStaging = false
        self.stagedPossibilities = []
        self.filterMode = 'and'
        self.selectedSquares = []
      },
      selectSquareByDir(dir) {
        const newPos = posInDir(self.curPosition, dir)

        if (newPos) self.selectSquareByPos(newPos)
      },
      selectSquareByPos(pos) {
        self.selectSquare(self.rootPuzzle.getSquareByPos(pos))
      },
      selectSquareById(id) {
        self.selectSquare(self.rootPuzzle.squares.get(id))
      },
      selectSquare(square) {
        self.curSquare = square
        self.selectedSquares = [square]
        self.isStaging = false
      },
      selectThroughSquare(squareId) {
        if (self.selectedSquares.length > 0) {
          const nextSquarePos = self.rootPuzzle.squares.get(squareId).position
          const prevSquarePos = self.lastSelectedSquare.position

          self.selectedSquares.push(
            ...getInterveningPositions(prevSquarePos, nextSquarePos)
              .map(pos => self.rootPuzzle.getSquareByPos(pos))
              .filter(square => !self.selectedSquares.includes(square))
          )
        }
      },
      tentativelySelectInDir(dir) {
        if (self.selectedSquares.length > 0) {
          const curSquarePos = self.tentativeSelections[self.tentativeSelections.length - 1]?.position || self.lastSelectedSquare.position
          const nextSquarePos = posInDir(curSquarePos, dir)

          if (!nextSquarePos) return

          const prevSelectionPos = self.lastSelectedSquare.position

          self.tentativeSelections.push(
            ...getInterveningPositions(prevSelectionPos, nextSquarePos)
              .map(pos => self.rootPuzzle.getSquareByPos(pos))
              .filter(square => !self.tentativeSelections.includes(square))
          )
        }
      },
      lockInTentativeSelections() {
        self.selectedSquares.push(
          ...self.tentativeSelections
            .filter(square => !self.selectedSquares.includes(square))
        )
        self.tentativeSelections = []
      },
      toggleSelectedSquare(squareId) {
        togglePresenceInArray(
          self.selectedSquares,
          squareId,
          () => self.selectedSquares.findIndex(s => s.id === squareId)
        )
        if (self.curSquare.id === squareId) self.curSquare = null
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
      toggleSelectionPossibility(val) {
        if (self.isSelectionEliminatedValue(val)) {
          self.selectedSquares.forEach(square =>
            square.uneliminatePossibility(val))
        } else {
          self.selectedSquares.forEach(square =>
            square.eliminatePossibility(val))
        }
      },
      clearSelectedSquares() {
        self.selectedSquares = []
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
        const idxDiff = dir === 'Left' ? -1 : 1
        const newIdx = (modes.indexOf(self.filterMode) + idxDiff + 3) % 3
        self.filterMode = modes[newIdx]
      },
    }
  })

export default UI