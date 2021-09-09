import { generateClassName } from '../shared/general_util'
import { GameBase } from './base'

const defaultOptions = {
  autoBlock: true,
  autoEliminate: true,
  autoElimMathImpossibilities: true,
  maxDisplayedPossibilities: 4,
  walkthrough: true,
}

const Options = GameBase
  .named('Options')
  .props(defaultOptions)
  .views(self => {
    return {
      get autoBlockClassName() {
        return generateClassName('toggle', [
          [self.autoBlock, 'on']
        ])
      },
      get autoElimClassName() {
        return generateClassName('toggle', [
          [self.autoEliminate, 'on']
        ])
      },
      get autoElimMathImpossibilitiesClassName() {
        return generateClassName('toggle', [
          [self.autoElimMathImpossibilities, 'on']
        ])
      },
      get walkthroughClassName() {
        return generateClassName('toggle', [
          [self.walkthrough, 'on']
        ])
      },
    }
  })
  .actions(self => {
    return {
      setOption(option, val) {
        self[option] = val
      },
      toggleAutoBlock() {
        self.autoBlock = !self.autoBlock
      },
      toggleAutoEliminate() {
        self.autoEliminate = !self.autoEliminate
      },
      toggleAutoElimMathImpossibilities() {
        self.autoElimMathImpossibilities = !self.autoElimMathImpossibilities
      },
      toggleWalkthrough() {
        self.walkthrough = !self.walkthrough
      },
      setMaxDisplayedPossibilities(num) {
        if (num < 2 || num > 9) {
          return false
        } else {
          self.maxDisplayedPossibilities = num
          return true
        }
      },
      reset() {
        for (let option in defaultOptions) {
          self[option] = defaultOptions[option]
        }
      }
    }
  })

export default Options