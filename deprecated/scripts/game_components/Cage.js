import Square from './Square'
import GroupInfo from './GroupInfo';

export default class Cage {
  constructor(cageData, puzzle) {
    Object.assign(this, cageData);

    this.squareCoords = cageData.squares.sort( (a,b) => {
      const compareVal = a[0] - b[0];
      return compareVal || a[1] - b[1];
    });
    this.anchor = this.squareCoords[0];
    this.squares = this.squareCoords.map( square => new Square(square, puzzle) );
    this.puzzle = puzzle;
    this.groupInfo = new GroupInfo(puzzle);
    
    this.anchorText = `${this.result} ${this.operation}`;
  }

  getBounds(){
    const traversed = [], topBounds = [], leftBounds = [];

    this.squares.forEach( square => {
      const pos = square.pos;
      const [row,col] = pos;
      if ( !traversed.some( a => a[0] === row-1 && a[1] === col) ){
        topBounds.push(pos);
      }
      if (!traversed.some(a => a[0] === row && a[1] === col - 1) ){
        leftBounds.push(pos);
      }
      traversed.push(pos);
    })

    return { topBounds, leftBounds };
  }
}