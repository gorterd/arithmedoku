export const combinations = (numElements, {
  min = 1,
  max = 9,
  numRepeatsAllowed = 0,
}) => {
  const rangeSize = max - min + 1
  const nextOptions = { min: min + 1, max, numRepeatsAllowed }

  if (numElements === 0) {
    // 0 elements; return the empty combination
    return [[]]
  } else if (rangeSize <= 0 || numElements > rangeSize + numRepeatsAllowed) {
    // impossible request; return no combinations
    return []
  } else {
    // recursive step
    const withRepeatedMin = numRepeatsAllowed > 0 && numElements >= 2
      ? combinations(numElements - 2, {
        ...nextOptions,
        numRepeatsAllowed: numRepeatsAllowed - 1
      }).map(combo => [min, min, ...combo])
      : []

    const withMin = combinations(numElements - 1, nextOptions)
      .map(combo => [min, ...combo])

    const withoutMin = combinations(numElements, nextOptions)

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
  .map(arg => arg instanceof Array
    ? arg[0]
      ? arg[1]
      : null
    : arg
  )
  .filter(arg => arg)
  .join(' ')

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

export const stringSwitch = (
  input,
  casesFn,
  {
    fallthrough = false,
    multipleMatches = false
  } = {}
) => {
  if (typeof input !== 'string') {
    throw new Error('First argument to stringSwitch must be a string')
  } else if (typeof casesFn !== 'function') {
    throw new Error('Second argument to stringSwitch must be a function')
  }
  let matched = false

  function _case(...args) {
    const { exec, isMatch } = _parseCaseArgs(args)

    const shouldExecByMatch = isMatch(input) && (!matched || multipleMatches)
    const shouldExecByFallthrough = matched && fallthrough

    if (shouldExecByMatch || shouldExecByFallthrough) {
      matched = true
      exec(input)
    }
  }

  function _default(exec) {
    if (typeof exec !== 'function') {
      throw new Error('Argument to default function must be a function')
    }

    if (!matched || fallthrough) exec(input)
  }

  casesFn(_case, _default)
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

function _parseCaseArgs(args) {
  const exec = args.pop()
  if (typeof exec !== 'function') {
    throw new Error('Last argument to case function must be a callback to execute if the case matches')
  }

  const isMatch = input => args.every(matcher => _parseMatcher(matcher)(input))
  return { exec, isMatch }
}
function _parseMatcher(matcher) {
  switch (matcher.constructor.name) {
    case 'RegExp':
      return input => matcher.test(input)
    case 'String':
      return input => matcher === input
    case 'Boolean':
      return () => matcher
    case 'Array':
      return input => matcher.some(sub => _parseMatcher(sub)(input))
    default:
      throw new Error('Matcher arguments to case function must be a string, regular expression, boolean, or array of such')
  }
}
