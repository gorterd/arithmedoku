import { 
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE,
 } from '../../constants'

export default puzzle01 = {
  id: 1,
  size: 9,
  difficulty: 'hard',
  operations: [ADD, SUBTRACT, MULTIPLY, DIVIDE],
  cages: [
    {
      squares: [
        [0,0],
        [1,0],
      ],
      operation: DIVIDE,
      result: 2
    },
    {
      squares: [
        [0,1],
        [1,1],
      ],
      operation: SUBTRACT,
      result: 1
    },
    {
      squares: [
        [0,2],
        [1,2],
      ],
      operation: DIVIDE,
      result: 3
    },
    {
      squares: [
        [0,3],
        [1,3],
      ],
      operation: MULTIPLY,
      result: 56
    },
    {
      squares: [
        [0,5],
        [0,6],
      ],
      operation: SUBTRACT,
      result: 4
    },
    {
      squares: [
        [0,6],
        [1,6],
      ],
      operation: ADD,
      result: 11
    },
    {
      squares: [
        [0,7],
        [0,8],
      ],
      operation: DIVIDE,
      result: 2
    },
    {
      squares: [
        [1, 4],
        [2, 4],
      ],
      operation: SUBTRACT,
      result: 2
    },
    {
      squares: [
        [1, 5],
        [2, 5],
      ],
      operation: MULTIPLY,
      result: 72  
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
        [1, 7],
        [2, 7],
        [3, 7],
      ],
      operation: ADD,
      result: 17
    },
    {
      squares: [
        [1, 8],
        [2, 8],
      ],
      operation: DIVIDE,
      result: 3
    },
    {
      squares: [
        [2, 0],
        [2, 1],
      ],
      operation: SUBTRACT,
      result: 7
    },
    {
      squares: [
        [2, 2],
        [2, 3],
      ],
      operation: MULTIPLY,
      result: 24
    },
    {
      squares: [
        [3, 0],
        [4, 0],
      ],
      operation: ADD,
      result: 14
    },
    {
      squares: [
        [3, 1],
        [4, 1],
      ],
      operation: MULTIPLY,
      result: 12
    },
    {
      squares: [
        [3, 2],
        [3, 3],
      ],
      operation: ADD,
      result: 11
    },
    {
      squares: [
        [3, 4],
        [3, 5],
      ],
      operation: ADD,
      result: 9
    },
    {
      squares: [
        [3, 8],
        [4, 8],
      ],
      operation: MULTIPLY,
      result: 54
    },
    {
      squares: [
        [4, 2],
        [5, 1],
        [5, 2],
      ],
      operation: MULTIPLY,
      result: 90
    },
    {
      squares: [
        [4, 3],
        [4, 4],
      ],
      operation: ADD,
      result: 11
    },
    {
      squares: [
        [4, 5],
        [5, 5],
      ],
      operation: DIVIDE,
      result: 3
    },
    {
      squares: [
        [4, 6],
        [4, 7],
        [5, 7],
      ],
      operation: MULTIPLY,
      result: 320
    },
    {
      squares: [
        [5, 0],
        [6, 0],
        [6, 1],
      ],
      operation: ADD,
      result: 15
    },
    {
      squares: [
        [5, 3],
        [5, 4],
        [6, 4],
      ],
      operation: MULTIPLY,
      result: 16
    },
    {
      squares: [
        [5, 6],
        [6, 6],
      ],
      operation: SUBTRACT,
      result: 5
    },
    {
      squares: [
        [5, 8],
        [6, 8],
      ],
      operation: ADD,
      result: 9
    },
    {
      squares: [
        [6, 2],
        [6, 3],
      ],
      operation: MULTIPLY,
      result: 7
    },
    {
      squares: [
        [6, 5],
        [7, 5],
      ],
      operation: DIVIDE,
      result: 3
    },
    {
      squares: [
        [6, 7],
        [7, 6],
        [7, 7],
        [7, 8],
      ],
      operation: MULTIPLY,
      result: 45
    },
    {
      squares: [
        [7, 0],
        [8, 0],
      ],
      operation: SUBTRACT,
      result: 4
    },
    {
      squares: [
        [7, 1],
        [7, 2],
      ],
      operation: SUBTRACT,
      result: 2
    },
    {
      squares: [
        [7, 3],
        [7, 4],
      ],
      operation: ADD,
      result: 13
    },
    {
      squares: [
        [8, 1],
        [8, 2],
      ],
      operation: DIVIDE,
      result: 2
    },
    {
      squares: [
        [8, 3],
        [8, 4],
      ],
      operation: SUBTRACT,
      result: 1
    },
    {
      squares: [
        [8, 5],
        [8, 6],
      ],
      operation: SUBTRACT,
      result: 3
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

