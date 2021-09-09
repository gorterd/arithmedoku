import { applySnapshot, flow, getSnapshot, onAction, onSnapshot, types } from 'mobx-state-tree'
import { GameBase } from './base'
import UI from './ui'
import Options from './options'
import Puzzle from './puzzle'
import Meta from './meta'
import { nextId } from '../shared/general_util'
import { dbAdd, dbGet } from '../shared/storage_util'

const Game = GameBase
  .named('Game')
  .props({
    puzzle: types.optional(Puzzle, () => Puzzle.create()),
    curPuzzleIdx: types.optional(types.integer, 0),
    meta: types.optional(Meta, () => Meta.create()),
    options: types.optional(Options, () => Options.create()),
    ui: types.optional(UI, () => UI.create()),
  })
  .volatile(self => {
    return {
      storedSnapshot: null
    }
  })
  .extend(self => {
    let _storedSnapshot

    const takePuzzleSnapshot = () => {
      const snapshotId = parseInt(nextId())
      const puzzle = getSnapshot(self.puzzle)
      self.env.snapshots[snapshotId] = puzzle
      return snapshotId
    }

    const getOrSetPuzzle = (id) => {
      const cachedGame = self.env.puzzleCache.get(id)
      if (cachedGame) {
        return cachedGame.puzzle
      } else {
        const puzzle = Puzzle.create(self.env.snapshots[id])
        self.env.puzzleCache.set(id, Game.create({ puzzle }, self.env))
        return puzzle
      }
    }

    const getNewPuzzleIdx = () => {
      const puzzles = self.env.puzzles
      const randomIdx = Math.floor(Math.random() * puzzles.length)
      return randomIdx === self.curPuzzleIdx
        ? getNewPuzzleIdx()
        : randomIdx
    }

    const noHistory = () => {
      setTimeout(() => {
        self.env.history.pop()
      }, 0)
    }

    const ifCurSquareEmpty = cb => {
      if (self.ui.curSquare.hasValue) {
        noHistory()
      } else {
        cb()
      }
    }

    const recordedActions = {
      setFocusedSquare(value) {
        if (self.ui.hasSelection) {
          noHistory()
        } else if (
          self.options.autoBlock
          && !self.ui.curSquare.isPossibleValue(value)
        ) {
          self.ui.curSquare.conflictingSquares(value)
            .forEach(square => square.setConflict())

          self.ui.curSquare.setMistake(value)
          noHistory()
        } else {
          self.ui.curSquare.value = value
          self.ui.isStaging = false
        }
      },
      toggleFocusedSquarePossibility(val) {
        ifCurSquareEmpty(() => self.ui.curSquare.togglePossibility(val))
      },
      resetFocusedSquarePossibilities() {
        const square = self.ui.curSquare
        if (
          (!square.hasEliminations && !square.hasValue)
          || self.ui.hasSelection
        ) {
          noHistory()
        } else {
          square.eliminatedPossibilities = []
          square.value = null
        }
      },
      setStagedPossibilities() {
        ifCurSquareEmpty(() => {
          self.ui.curSquare.setStagedPossibilities()
          self.ui.clearStagedPossibilities()
        })
      },
      clearFocusedSquare() {
        self.setFocusedSquare(null)
      },
      toggleSelectionPossibility(val) {
        self.ui.toggleSelectionPossibility(val)
      },
      toggleCurCageCombo(combo) {
        self.ui.curCage.toggleCombo(combo)
      },
      toggleFilterPossibility(val) {
        self.ui.toggleFilterPossibility(val)
      },
      clearFilterMode() {
        self.ui.clearFilterMode()
      },
      clearFilter() {
        self.ui.clearFilter()
      },
      enterIf() {
        const mainSnapshotId = takePuzzleSnapshot()
        self.meta.enterIf(mainSnapshotId)
      },
      enterThen() {
        const ifSnapshotId = takePuzzleSnapshot()
        self.meta.enterThen(ifSnapshotId)
      },
      finishImplication() {
        const thenSnapshotId = takePuzzleSnapshot()
        self.meta.setImplication(thenSnapshotId)
        self.exitImplication()
      },
      exitImplication() {
        applySnapshot(self.puzzle, self.meta.mainSnapshot)
        self.meta.clearImplication()
      },
    }

    const silentActions = {
      newPuzzle() {
        const newIdx = getNewPuzzleIdx()
        self.curPuzzleIdx = newIdx

        self.ui.reset()
        self.puzzle = Puzzle.create()
        self.initialize()
      },
      resetPuzzle() {
        self.ui.reset()
        self.puzzle.reset()
      },
      applyStoredSnapshot() {
        try {
          applySnapshot(self, self.storedSnapshot)
        } catch {
          console.log('Unable to apply stored snapshot')
        }
      },
      retrieveStoredSnapshot: flow(function* () {
        if (!_storedSnapshot) {
          _storedSnapshot = dbGet('gameStore')
        }

        self.storedSnapshot = yield _storedSnapshot
        return _storedSnapshot
      }),
      initialize() {
        const { cages, solution } = self.env.puzzles[self.curPuzzleIdx]

        cages.forEach(({ operation, result, squares }) => {
          const cage = self.puzzle.cages.put({ operation, result })
          cage.filter.initialize(self.env.globals.size)

          squares.forEach(position => {
            const square = self.puzzle.squares.put({
              position,
              solution: solution[position[0]][position[1]],
              cage: cage.id
            })
            cage.addSquare(square)
          })
        })
      },
      attachHooks() {
        onAction(self, action => {
          if (self.shouldRecordAction(action)) {
            self.env.future = []
            self.env.history.push(self.currentState)
          }
        })

        onSnapshot(self, snapshot => {
          dbAdd('gameStore', snapshot)
          const { history, snapshots, future } = self.env
          dbAdd('env', { history, snapshots, future })
        })
      },
      beginStaging() {
        if (
          !self.ui.curSquare.hasValue
          && !self.ui.hasSelection
          && !self.ui.tentativeSelections.length > 0
        ) {
          self.ui.isStaging = true
        }
      },
      stopStaging() {
        self.ui.isStaging = false

        if (self.ui.hasStagedPossibilities) {
          self.setStagedPossibilities()
        }
      },
      toggleStagedPossibility(val) {
        self.ui.toggleStagedPossibility(val)
      },
      clearStagedPossibilities() {
        self.ui.clearStagedPossibilities()
      },
      selectSquareByDir(dir) {
        self.ui.selectSquareByDir(dir)
      },
      selectSquareByPos(pos) {
        self.ui.selectSquareByPos(pos)
      },
      selectSquareById(id) {
        self.ui.selectSquareById(id)
      },
      clearFocus() {
        self.ui.curSquare = null
        self.ui.clearSelectedSquares()
      },
      undoOrRedo({ popFrom, pushTo }) {
        if (popFrom.length > 0) {
          pushTo.push(self.currentState)
          const nextState = popFrom.pop()
          applySnapshot(self.puzzle, nextState.puzzle)
          applySnapshot(self.meta, nextState.meta)
        }
      },
      undo() {
        self.undoOrRedo({
          popFrom: self.env.history,
          pushTo: self.env.future
        })
      },
      redo() {
        self.undoOrRedo({
          popFrom: self.env.future,
          pushTo: self.env.history
        })
      }
    }

    return {
      views: {
        get recordedActions() {
          return Object.keys(recordedActions)
        },
        get currentState() {
          return {
            puzzle: getSnapshot(self.puzzle),
            meta: getSnapshot(self.meta)
          }
        },
        shouldRecordAction(action) {
          return self.recordedActions.includes(action.name)
        },
        implicationPuzzles() {
          return self.meta.implications
            .map(self.getPuzzlesFromImplication)
        },
        possibleImplications() {
          return self.implicationPuzzles()
            .filter(({ thenPuzzle }) => self.isPossiblePuzzle(thenPuzzle))
        },
        fulfilledImplications() {
          return self.possibleImplications()
            .filter(({ ifPuzzle }) => self.isFulfilledPuzzle(ifPuzzle))
        },
        getPuzzlesFromImplication([ifId, thenId]) {
          return {
            ifPuzzle: getOrSetPuzzle(ifId),
            thenPuzzle: getOrSetPuzzle(thenId),
          }
        },
        isPossiblePuzzle(puzzle) {
          return puzzle.squaresArray.every(square => {
            const curSquare = self.puzzle.squares.get(square.id)
            return curSquare.isConsistentWith(square)
          })
        },
        isFulfilledPuzzle(puzzle) {
          return puzzle.squaresArray.every(square => {
            const curSquare = self.puzzle.squares.get(square.id)
            return curSquare.isLogicalSubsetOf(square)
          })
        },
      },
      actions: {
        ...recordedActions,
        ...silentActions,
      }
    }
  })

export default Game