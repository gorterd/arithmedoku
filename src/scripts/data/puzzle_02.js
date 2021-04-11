import {
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE,
} from '../constants'

export default {
  id: 2,
  size: 9,
  difficulty: 'hard',
  operations: [ADD, SUBTRACT, MULTIPLY, DIVIDE],
  cages: [
    {
      squares: [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      operation: MULTIPLY,
      result: 15
    },
    {
      squares: [
        [0, 1],
        [1, 1],
      ],
      operation: DIVIDE,
      result: 2
    },
    {
      squares: [
        [0, 2],
        [1, 2],
      ],
      operation: DIVIDE,
      result: 2
    },
    {
      squares: [
        [0, 3],
        [0, 4],
        [0, 5],
        [0, 6],
      ],
      operation: ADD,
      result: 25
    },
    {
      squares: [
        [0, 7],
        [0, 8],
        [1, 8],
        [2, 8],
      ],
      operation: MULTIPLY,
      result: 320
    },
    {
      squares: [
        [1, 3],
        [2, 3],
      ],
      operation: ADD,
      result: 11
    },
    {
      squares: [
        [1, 4],
        [2, 4],
      ],
      operation: ADD,
      result: 5
    },
    {
      squares: [
        [1, 5],
        [2, 5],
      ],
      operation: SUBTRACT,
      result: 1
    },
    {
      squares: [
        [1, 6],
        [1, 7],
      ],
      operation: SUBTRACT,
      result: 3
    },
    {
      squares: [
        [2, 1],
        [3, 1],
      ],
      operation: MULTIPLY,
      result: 45
    },
    {
      squares: [
        [2, 2],
        [3, 2],
      ],
      operation: MULTIPLY,
      result: 42
    },
    {
      squares: [
        [2, 6],
        [3, 6],
      ],
      operation: DIVIDE,
      result: 2
    },
    {
      squares: [
        [2, 7],
        [3, 7],
        [3, 8],
      ],
      operation: ADD,
      result: 14
    },
    {
      squares: [
        [3, 0],
        [4, 0],
      ],
      operation: MULTIPLY,
      result: 14
    },
    {
      squares: [
        [3, 3],
        [3, 4],
        [4, 4],
      ],
      operation: MULTIPLY,
      result: 80
    },
    {
      squares: [
        [3, 5],
        [4, 5],
      ],
      operation: ADD,
      result: 5
    },
    {
      squares: [
        [4, 1],
        [4, 2],
        [4, 3],
      ],
      operation: ADD,
      result: 12
    },
    {
      squares: [
        [4, 6],
        [5, 6],
        [6, 6],
      ],
      operation: MULTIPLY,
      result: 14
    },
    {
      squares: [
        [4, 7],
        [5, 7],
      ],
      operation: MULTIPLY,
      result: 45
    },
    {
      squares: [
        [4, 8],
        [5, 8],
      ],
      operation: DIVIDE,
      result: 2
    },
    {
      squares: [
        [5, 0],
        [6, 0],
      ],
      operation: DIVIDE,
      result: 2
    },
    {
      squares: [
        [5, 1],
        [6, 1],
      ],
      operation: ADD,
      result: 13
    },
    {
      squares: [
        [5, 2],
        [6, 2],
      ],
      operation: SUBTRACT,
      result: 1
    },
    {
      squares: [
        [5, 3],
        [6, 3],
      ],
      operation: SUBTRACT,
      result: 1
    },
    {
      squares: [
        [5, 4],
        [5, 5],
      ],
      operation: MULTIPLY,
      result: 14
    },
    {
      squares: [
        [6, 4],
        [6, 5],
      ],
      operation: SUBTRACT,
      result: 6
    },
    {
      squares: [
        [6, 7],
        [6, 8],
      ],
      operation: SUBTRACT,
      result: 5
    },
    {
      squares: [
        [7, 0],
        [7, 1],
      ],
      operation: ADD,
      result: 11
    },
    {
      squares: [
        [7, 2],
        [8, 2],
      ],
      operation: DIVIDE,
      result: 3
    },
    {
      squares: [
        [7, 3],
        [8, 3],
      ],
      operation: MULTIPLY,
      result: 28
    },
    {
      squares: [
        [7, 4],
        [8, 4],
      ],
      operation: DIVIDE,
      result: 4
    },
    {
      squares: [
        [7, 5],
        [8, 5],
      ],
      operation: ADD,
      result: 11
    },
    {
      squares: [
        [7, 6],
        [8, 6],
      ],
      operation: SUBTRACT,
      result: 3
    },
    {
      squares: [
        [7, 7],
        [7, 8],
      ],
      operation: SUBTRACT,
      result: 1
    },
    {
      squares: [
        [8, 0],
        [8, 1],
      ],
      operation: SUBTRACT,
      result: 5
    },
    {
      squares: [
        [8, 7],
        [8, 8],
      ],
      operation: SUBTRACT,
      result: 1
    },

  ]
}