import Cage from "./Cage";

export default class Puzzle {
  constructor(puzzle, solution, options = {}){
    this.puzzle = puzzle;
    this.solution = solution.grid;
    this.grid = Array.from( 
      new Array(puzzle.size),
      () => new Array(puzzle.size, null) 
    );
    
    this.cages = this._generateCages(puzzle.cages);
    this.bounds = this._generateBounds();
  }

  // the puzzle IS solved if it is NOT the case that there's an error:
  // ie, that there's some row, with some square, where that square's value 
  // doesn't match the solution
  isSolved(){
    return !this.grid.some( (row, i) => {
      row.some( (square, j) => parseInt(square.value) !== this.solution[i][j])
    })
  }

  _generateBounds(){
    const topBounds = [], leftBounds = [];

    this.cages.forEach( cage => {
      const { topBounds: top, leftBounds: left } = cage.getBounds();
      topBounds.concat(top);
      leftBounds.concat(left);
    });

    return { topBounds, leftBounds };
  }

  iterateSquares(cb){
    this.grid.forEach( row => {
      row.forEach( square => cb(square) );
    });
  }

  _generateCages(cagesData){
    return cagesData.map( cageData => {
      const cage = new Cage(cageData, this);
      this._addSquares(cage.squares);
      return cage;
    })
  }

  _addSquares(squares){
    squares.forEach( square => {
      const [row, col] = square.pos;
      this.grid[row][col] = square;
    });
  }
}