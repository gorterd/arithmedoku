import { ARROW_REGEX, NUM_REGEX } from "./constants"

export const isTruthy = a => a

export const combos = (numElements, {
  min = 1,
  max = 9,
  numRepeatsAllowed = 0,
}) => {
  const rangeSize = max - min + 1
  const nextOptions = { min: min + 1, max, numRepeatsAllowed }

  if (numElements === 0) {
    // 0 elements; return the empty combo
    return [[]]
  } else if (rangeSize <= 0 || numElements > rangeSize + numRepeatsAllowed) {
    // impossible request; return no combos
    return []
  } else {
    // recursive step
    const withRepeatedMin = numRepeatsAllowed > 0 && numElements >= 2
      ? combos(numElements - 2, {
        ...nextOptions,
        numRepeatsAllowed: numRepeatsAllowed - 1
      }).map(combo => [min, min, ...combo])
      : []

    const withMin = combos(numElements - 1, nextOptions)
      .map(combo => [min, ...combo])

    const withoutMin = combos(numElements, nextOptions)

    return [...withRepeatedMin, ...withMin, ...withoutMin]
  }
}

export const maxPossibleRepeats = (
  positions,
  curIdx = 0,
  filled = {},
  nextFillVal = 0
) => {
  if (curIdx + 1 > positions.length) {
    return Object.values(filled)
      .map(({ rows }) => rows.length)
      .filter(numSquaresWithVal => numSquaresWithVal === 2)
      .length
  } else {
    const [nextRow, nextCol] = positions[curIdx]

    const possibleVals = Object.keys(filled)
      .filter(val => {
        const { rows, cols } = filled[val]
        return !rows.includes(nextRow) && !cols.includes(nextCol)
      })
      .concat(nextFillVal)

    return possibleVals.reduce((maxRepeats, val) => {
      const filledClone = deepClone(filled)
      filledClone[val] = filledClone[val] || { rows: [], cols: [] }
      filledClone[val].rows.push(nextRow)
      filledClone[val].cols.push(nextCol)

      const maxRepeatsWithVal = maxPossibleRepeats(
        positions,
        curIdx + 1,
        filledClone,
        nextFillVal + 1
      )

      return maxRepeatsWithVal > maxRepeats ? maxRepeatsWithVal : maxRepeats
    }, 0)
  }
}

export const areEqualArrays = (a, b) => (
  a.length === b.length
  && a.every((ele, idx) => ele === b[idx])
)

export const arrayUnion = (a, b) => {
  const aCounts = {}
  a.forEach(ele => aCounts[ele] = aCounts[ele] ? aCounts[ele] + 1 : 1)

  const union = []
  b.forEach(ele => {
    if (aCounts[ele] && aCounts[ele] > 0) {
      aCounts[ele]--
      union.push(ele)
    }
  })

  return union
}

export const includesArray = (outerArray, innerArray) =>
  outerArray.some(subArray => areEqualArrays(subArray, innerArray))

export const indexOfArray = (outerArray, innerArray) =>
  outerArray.findIndex(subArray => areEqualArrays(subArray, innerArray))

export const includesDistinct = (array, ...requiredElements) => {
  const visitedIndices = {}
  return requiredElements.every(requiredEle => {
    const eleIndex = array.findIndex((ele, idx) =>
      ele === requiredEle && !visitedIndices[idx]
    )

    if (eleIndex === -1) {
      return false
    } else {
      visitedIndices[eleIndex] = true
      return true
    }
  })
}

export const nextId = (() => {
  let id = 0
  return () => `${id++}`
})()

export const classes = (...args) => args
  .map(arg => {
    if (arg instanceof Array) {
      return arg[0]
        ? arg[1]
        : arg[2]
    } else {
      return arg
    }
  })
  .filter(arg => arg)
  .join(' ')

function evalClassNameComponent(component) {
  if (component instanceof Array) {
    return component[0] ? component[1] : component[2]
  } else {
    return component
  }
}

function evalClassNameComponents(components) {
  return components
    .map(evalClassNameComponent)
    .filter(isTruthy)
}

function evalClassNameFlags(base, flags) {
  return evalClassNameComponents(flags)
    .map(flag => `${base}--${flag}`)
}

function generateClassNameFromArray(components) {
  return evalClassNameComponents(components).join(' ')
}

function generateClassNameFromBaseAndFlags(base, flags) {
  return [base, ...evalClassNameFlags(base, flags)].join(' ')
}

function generateClassNameFromOptions({
  base = null,
  flags = [],
  classes = []
}) {
  const classNames = evalClassNameComponents([base, ...classes])
  const flagNames = evalClassNameFlags(base, flags)

  return [...classNames, ...flagNames].join(' ')
}

export const generateClassName = (dynamicArg, flags) => {
  if (dynamicArg instanceof Array) {
    return generateClassNameFromArray(dynamicArg)
  } else if (typeof dynamicArg === 'string' && flags instanceof Array) {
    return generateClassNameFromBaseAndFlags(dynamicArg, flags)
  } else {
    return generateClassNameFromOptions(dynamicArg)
  }
}

export const copyPuzzle = puzzle => {
  const copy = puzzle.clone()
  copy.resetUuid()
  return copy
}

export const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms))

export const product = numArray => {
  return numArray.reduce((product, num) => product * num, 1)
}

export const sum = numArray => {
  return numArray.reduce((sum, num) => sum + num, 0)
}

export const difference = ([a, b]) => {
  const [larger, smaller] = a > b ? [a, b] : [b, a]
  return larger - smaller
}

export const quotient = ([a, b]) => {
  const [larger, smaller] = a > b ? [a, b] : [b, a]
  return larger / smaller
}

// export const stringSwitch = (
//   input,
//   casesFn,
//   {
//     fallthrough = false,
//     multipleMatches = false
//   } = {}
// ) => {
//   if (typeof input !== 'string') {
//     throw new Error('First argument to stringSwitch must be a string')
//   } else if (typeof casesFn !== 'function') {
//     throw new Error('Second argument to stringSwitch must be a function')
//   }
//   let matched = false
//   let result

//   function _case(...args) {
//     const { exec, isMatch } = _parseCaseArgs(args)

//     const shouldExecByMatch = isMatch(input) && (!matched || multipleMatches)
//     const shouldExecByFallthrough = matched && fallthrough

//     if (shouldExecByMatch || shouldExecByFallthrough) {
//       matched = true
//       result = exec(input)
//     }
//   }

//   function _default(exec) {
//     if (typeof exec !== 'function') {
//       throw new Error('Argument to default function must be a function')
//     }

//     if (!matched || fallthrough) {
//       result = exec(input)
//     }
//   }

//   function _ensure(exec) {
//     if (typeof exec !== 'function') {
//       throw new Error('Argument to ensure function must be a function')
//     }

//     if (matched) {
//       exec(input)
//     }
//   }

//   casesFn({ _case, _default, _ensure })
//   return result
// }

// function _parseCaseArgs(args) {
//   const exec = args.pop()
//   if (typeof exec !== 'function') {
//     throw new Error('Last argument to case function must be a callback to execute if the case matches')
//   }

//   const isMatch = input => args.every(matcher => _parseMatcher(matcher)(input))
//   return { exec, isMatch }
// }
// function _parseMatcher(matcher) {
//   const matcherType = matcher.constructor.name
//   switch (matcherType) {
//     case 'BabelRegExp':
//     case 'RegExp':
//       return input => matcher.test(input)
//     case 'String':
//       return input => matcher === input
//     case 'Boolean':
//       return () => matcher
//     case 'Array':
//       return input => matcher.some(sub => _parseMatcher(sub)(input))
//     default:
//       throw new Error(`Matcher arguments to case function must be a string, regular expression, boolean, or array of such. Instead, received ${matcherType}`)
//   }
// }



export const getNumFromCode = code => parseInt(NUM_REGEX.exec(code)?.groups.num)

export const getDirFromCode = code => ARROW_REGEX.exec(code)?.groups?.dir

export const kebabToCamel = string => {
  return string
    .split('-')
    .map((segment, idx) => idx > 0
      ? segment[0].toUpperCase() + segment.slice(1)
      : segment
    )
    .join('')
}

export const genStepper = iterable => {
  const basicStepper = genBasicStepper(iterable)
  return () => basicStepper.next().value
}

function* genBasicStepper(iterable) {
  yield* iterable
}

function deepClone(obj) {
  switch (obj.constructor.name) {
    case 'Object':
      return Object.fromEntries(
        Object.entries(obj).map(([key, val]) => ([key, deepClone(val)]))
      )
    case 'Array':
      return obj.map(ele => deepClone(ele))
    default:
      return obj
  }
}


export const throttle = (func, ms = 200) => {
  let lastFired = Date.now()

  return (...args) => {
    const now = Date.now()

    if (now - lastFired >= ms) {
      lastFired = now
      func(...args)
    }
  }
}

export const togglePresenceInArray = (
  array,
  ele,
  indexOfFunc = (array, ele) => array.indexOf(ele)
) => {
  const idx = indexOfFunc(array, ele)

  if (idx >= 0) {
    array.splice(idx, 1)
  } else {
    array.push(ele)
  }
}

export const pushIfNotIncluded = (
  array,
  ele,
  includesFunc = (array, ele) => array.includes(ele)
) => {
  if (!includesFunc(array, ele)) array.push(ele)
}

export const removeIfIncluded = (
  array,
  ele,
  indexOfFunc = (array, ele) => array.indexOf(ele)
) => {
  const idx = indexOfFunc(array, ele)

  if (idx >= 0) {
    array.splice(idx, 1)
  }
}

export const getInterveningPositions = ([startX, startY], [endX, endY]) => {
  const xRange = getRange(startX, endX)
  const yRange = getRange(startY, endY)

  return xRange.reduce((positions, x) => {
    const newPositions = yRange.map(y => [x, y])
    return positions.concat(newPositions)
  }, [])
}

function getRange(a, b) {
  const mapper = a < b
    ? (_, idx) => idx + a
    : (_, idx) => a - idx

  return Array.from({ length: Math.abs(a - b) + 1 }).map(mapper)
}

export const stringSwitch = (input, casesFn, options) => {
  validateStringSwitchArgs({ input, casesFn })

  const caseArgParser = (args) => stringSwitchCaseArgParser(input, args)
  return baseSwitch(caseArgParser, casesFn, options)
}

export const funcSwitch = (input, comparator, casesFn, options) => {
  validateFuncSwitchArgs({ comparator, casesFn })
  const caseArgParser = (args) => funcSwitchCaseArgParser(input, comparator, args)
  return baseSwitch(caseArgParser, casesFn, options)
}

function baseSwitch(
  caseArgParser,
  casesFn,
  {
    fallthrough = false,
    multipleMatches = false
  } = {}
) {
  let matched = false
  let result

  function _case(...args) {
    const { exec, isMatch } = caseArgParser(args)

    const shouldExecByMatch = isMatch() && (!matched || multipleMatches)
    const shouldExecByFallthrough = matched && fallthrough

    if (shouldExecByMatch || shouldExecByFallthrough) {
      matched = true
      result = exec()
    }
  }

  function _default(exec) {
    if (typeof exec !== 'function') {
      throw new Error('Argument to default function must be a function')
    }

    if (!matched || fallthrough) {
      result = exec()
    }
  }

  function _ensure(exec) {
    if (typeof exec !== 'function') {
      throw new Error('Argument to ensure function must be a function')
    }

    if (matched) {
      exec()
    }
  }

  casesFn({ _case, _default, _ensure })
  return result
}

function validateStringSwitchArgs({ input, casesFn }) {
  if (typeof input !== 'string') {
    throw new Error('First argument to stringSwitch must be a string')
  } else if (typeof casesFn !== 'function') {
    throw new Error('Second argument to stringSwitch must be a function')
  }
}

function validateFuncSwitchArgs({ comparator, casesFn }) {
  if (typeof comparator !== 'function') {
    throw new Error('Second argument to funcSwitch must be a comparator function')
  } else if (typeof casesFn !== 'function') {
    throw new Error('Third argument to funcSwitch must be a function that defines your case statements')
  }
}

function stringSwitchCaseArgParser(input, args) {
  const exec = args.pop()
  if (typeof exec !== 'function') {
    throw new Error('Last argument to case function must be a callback to execute if the case matches')
  }

  const isMatch = () => args.every(matcher => parseMatcher(matcher)(input))
  return { exec, isMatch }
}

function funcSwitchCaseArgParser(input, comparator, args) {
  const exec = args.pop()
  if (typeof exec !== 'function') {
    throw new Error('Last argument to case function must be a callback to execute if the case matches')
  }

  const isMatch = () => {
    return (
      comparator(input, ...args[0])
      && args.slice(1).every(matcher => parseMatcher(matcher)(input))
    )
  }

  return { exec, isMatch }
}

function parseMatcher(matcher) {
  const isMatcherType = (type) => matcher instanceof type

  if (typeof matcher === 'string') {
    return input => matcher === input
  } else if (typeof matcher === 'boolean') {
    return () => matcher
  } else if (isMatcherType(RegExp)) {
    return input => matcher.test(input)
  } else if (isMatcherType(Array)) {
    return input => matcher.some(sub => parseMatcher(sub)(input))
  } else {
    throw new Error(`Matcher arguments to case function must be a string, regular expression, boolean, or array of such. Instead, received ${matcher}`)
  }
}
