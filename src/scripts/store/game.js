import { applySnapshot, getSnapshot, types } from 'mobx-state-tree'
import { GameBase } from './base'
import UI from './ui'
import Options from './options'
import Puzzle from './puzzle'
import Meta from './meta'
import { nextId } from '../util/general_util'

const Game = GameBase
  .named('Game')
  .props({
    puzzle: types.optional(Puzzle, () => Puzzle.create()),
    meta: types.optional(Meta, () => Meta.create()),
    options: types.optional(Options, () => Options.create()),
    ui: types.optional(UI, () => UI.create()),
  })
  .extend(self => {
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

    const recordedActions = {
      setFocusedSquare(value) {
        if (
          self.options.autoBlock
          && !self.ui.focusedSquare.isPossibleValue(value)
        ) {
          self.ui.focusedSquare.conflictingSquares(value)
            .forEach(square => square.setConflict())

          self.ui.focusedSquare.setMistake(value)
          window.setTimeout(() => {
            self.env.history.pop()
          }, 0)
        } else {
          self.ui.focusedSquare.value = value
        }
      },
      toggleFocusedSquarePossibility(val) {
        self.ui.focusedSquare.togglePossibility(val)
      },
      resetFocusedSquarePossibilities() {
        self.ui.focusedSquare.eliminatedPossibilities = []
      },
      setStagedPossibilities() {
        self.ui.focusedSquare.setStagedPossibilities()
        self.ui.clearStagedPossibilities()
      },
      clearFocusedSquare() {
        self.setFocusedSquare(null)
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
      initialize({ cages, solution }) {
        cages.forEach(({ operation, result, squares }) => {
          const cage = self.puzzle.cages.put({ operation, result })

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
      beginStaging() {
        self.ui.isStaging = true
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
      clearFocus() {
        self.ui.focusedSquare = null
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