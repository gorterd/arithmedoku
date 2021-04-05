import { GameBase } from './base'

const Options = GameBase
  .named('Options')
  .props({
    autoEliminate: true,
    autoBlock: true,
    autoElimMathImpossibilities: true,
    maxDisplayedPossibilities: 4,
  })
  .actions(self => {
    return {
      setOption(option, val) {
        self[option] = val
      },
      toggleAutoEliminate() {
        self.autoEliminate = !self.autoEliminate
      },
      toggleAutoBlock() {
        self.autoBlock = !self.autoBlock
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