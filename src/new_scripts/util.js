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

// TODO: implement an AVL BST https://en.wikipedia.org/wiki/AVL_tree
export class ArrayBST {
  static compare(arr1, arr2) {
    return arr1.length === 0
      ? 0
      : Math.sign(arr1[0] - arr2[0]) === 0
        ? this.compare(arr1.slice(1), arr2.slice(1))
        : 0
  }
  constructor(arrays) {

  }
  insert() { }
  remove() { }
  includes() { }
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