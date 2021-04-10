import { GameBase } from './base'

const Options = GameBase
  .named('Options')
  .props({
    autoBlock: true,
    autoEliminate: true,
    autoElimMathImpossibilities: false,
    maxDisplayedPossibilities: 4,
  })
  .views(self => {
    const toggleClassName = isActive => isActive
      ? 'toggle toggle--on'
      : 'toggle'

    return {
      get autoBlockClassName() {
        return toggleClassName(self.autoBlock)
      },
      get autoElimClassName() {
        return toggleClassName(self.autoEliminate)
      },
      get autoElimMathImpossibilitiesClassName() {
        return toggleClassName(self.autoElimMathImpossibilities)
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