import Cage from "./Cage";
import PuzzleRender from "../render_components/PuzzleRender";
import SquareInfoRender from "../render_components/SquareInfoRender";
import GroupInfoRender from "../render_components/GroupInfoRender";

export default class Puzzle {
  constructor(puzzle, solution, divs){
    const { cages, ...rest } = puzzle;
    Object.assign(this, rest);

    this.solution = solution.grid;
    this.divs = divs;
    this.renderers = {
      puzzle: new PuzzleRender(this),
      squareInfo: new SquareInfoRender(this),
      groupInfo: new GroupInfoRender(this)
    }   

    this.grid = Array.from( 
      new Array(puzzle.size),
      () => new Array(puzzle.size, null) 
    );
    
    this.cages = this._generateCages(cages);
    this.groups = this.cages;
    this.bounds = this._generateBounds();
    this.focusedSquare = null;
  }

  // the puzzle IS solved if it is NOT the case that there's an error:
  // ie, that there's some row, with some square, where that square's value 
  // doesn't match the solution
  isSolved(){
    return !this.grid.some( (row, i) => {
      row.some( (square, j) => parseInt(square.value) !== this.solution[i][j])
    })
  }

  getSquare(pos){
    const [row, col] = pos;
    return this.grid[row][col];
  }

  getRow(idx){
    return this.grid[idx];
  }

  getCol(idx){
    return this.grid.map( row => row[idx]);
  }

  getSquareGroups(pos){
    return this.groups.filter( grp => {
      grp.squareCoords.includes(pos);
    })
  }

  checkConflicts(pos, val){
    return this._rowAndColMatches(pos, sq => sq.val === val);
  }

  autoEliminate(pos, val){
    return this._rowAndColMatches(pos, sq => {
      const options = sq.squareInfo.options;
      const idx = options.indexOf(parseInt(val));
      return idx >= 0 ? options.splice(idx, 1) : null;
    });
  }

  iterateSquares(cb){
    this.grid.forEach( row => {
      row.forEach( square => cb(square) );
    });
  }

  render() {
    Object.values(this.renderers).forEach( r => r.render() );
  }

  _rowAndColMatches(pos, cb) {
    const [row, col] = pos;

    const matchingSquares = [];
    [this.getRow(row), this.getCol(col)]
      .forEach(ln => ln.forEach(sq => {
        if (cb(sq)) {
          matchingSquares.push(sq.pos);
        }
      }));
    return matchingSquares;
  }

  _generateBounds(){
    let topBounds = [], leftBounds = [];

    this.cages.forEach( cage => {
      const { topBounds: top, leftBounds: left } = cage.getBounds();
      topBounds = topBounds.concat(top);
      leftBounds = leftBounds.concat(left);
    });

    return { topBounds, leftBounds };
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