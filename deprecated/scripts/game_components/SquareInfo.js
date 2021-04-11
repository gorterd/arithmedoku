import Info from "./Info";

export default class SquareInfo extends Info {
  constructor(puzzle) {
    super(puzzle, puzzle.renderers.squareInfo);
    this.options = [];
    this.locked = false;
  }

  toggleOption(n){
    const opts = this.options;
    opts.includes(n) ? opts.splice(opts.indexOf(n), 1) : opts.push(n);
  }

  toggleLocked(){
    this.locked = !this.locked;
  }

}