import SquareInfo from "./SquareInfo";

export default class Square {
  constructor(pos, puzzle) {
    this.val = null;
    this.pos = pos;
    this.puzzle = puzzle;
    this.squareInfo = new SquareInfo(puzzle);
  }
}