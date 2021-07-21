import { generateClassName } from '../shared/general_util'
import { GameBase } from './base'

const Options = GameBase
  .named('Options')
  .props({
    autoBlock: true,
    autoEliminate: true,
    autoElimMathImpossibilities: true,
    maxDisplayedPossibilities: 9,
  })
  .views(self => {
    return {
      get autoBlockClassName() {
        return generateClassName('toggle', [self.autoBlock, 'on'])
      },
      get autoElimClassName() {
        return generateClassName('toggle', [self.autoEliminate, 'on'])
      },
      get autoElimMathImpossibilitiesClassName() {
        return generateClassName('toggle', [self.autoElimMathImpossibilities, 'on'])
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
      setMaxDisplayedPossibilities(num) {
        if (num < 2 || num > 9) {
          return false
        } else {
          self.maxDisplayedPossibilities = num
          return true
        }
      },
    }
  })

export default Options