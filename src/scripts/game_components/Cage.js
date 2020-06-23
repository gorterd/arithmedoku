import Square from './Square'

export default class Cage {
  constructor(cageData, puzzle) {
    Object.assign(this, cageData);

    const sortedSquares = cageData.squares.sort( (a,b) => {
      const compareVal = a[0] - b[0];
      return compareVal || a[1] - b[1];
    });
    this.anchor = sortedSquares[0];
    this.squares = sortedSquares.map( square => new Square(square, puzzle) );
    this.puzzle = puzzle;
    
    this.anchorText = `${this.result} ${this.operation}`;
  }

  getBounds(){
    const traversed = [], topBounds = [], leftBounds = [];

    this.squares.forEach( square => {
      const [row,col] = pos = square.pos;
      if ( !traversed.includes([row-1, col]) ){
        topBounds.push(pos);
      }
      if ( !traversed.includes([row, col-1]) ){
        leftBounds.push(pos);
      }
      traversed.push(pos);
    })

    return { topBounds, leftBounds };
  }
}