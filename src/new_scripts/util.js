export const combinations = (() => {
  const memo = {}

  return function recursiveCombinations(numElements, min = 1, max = 9) {
    const key = `${numElements},${min},${max}`
    if (!memo[key]) {
      const rangeSize = max - min + 1

      if (numElements < 0 || numElements > rangeSize) {
        throw new Error('Bad arguments.')
      } else if (numElements === 0) {
        memo[key] = [[]]
      } else if (numElements === rangeSize) {
        memo[key] = [Array.from(Array(numElements), (_, idx) => min + idx)]
      } else {
        const withMin = recursiveCombinations(numElements - 1, min + 1, max)
          .map(combo => [min, ...combo])
        const withoutMin = recursiveCombinations(numElements, min + 1, max)

        memo[key] = [...withMin, ...withoutMin]
      }
    }

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

