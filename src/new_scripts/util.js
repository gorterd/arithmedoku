export const combinations = (() => {
  const memo = {}

  const recursiveCombinations = (min, max, numElements) => {
    const rangeSize = max - min + 1

    if (numElements < 0 || numElements > rangeSize) {
      throw new Error('Bad arguments.')
    } else if (numElements === 0) {
      return [[]]
    } else if (numElements === rangeSize) {
      return [Array.from(Array(numElements), (_, idx) => min + idx)]
    } else {
      const withMin = recursiveCombinations(min + 1, max, numElements - 1)
        .map(combo => [min, ...combo])
      const withoutMin = recursiveCombinations(min + 1, max, numElements)

      return [...withMin, ...withoutMin]
    }
  }

  return (num, upTo = 9) => {
    const key = `${num},${upTo}`
    memo[key] = memo[key] ?? recursiveCombinations(1, upTo, num)

    return memo[key]
  }
})()

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

