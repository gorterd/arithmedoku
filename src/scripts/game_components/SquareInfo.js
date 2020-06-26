import SquareInfoRender from "../render_components/SquareInfoRender";
import Info from "./Info";

export default class SquareInfo extends Info {
  constructor(puzzle, root) {
    super(puzzle);
    this.renderer = new SquareInfoRender(root, this);
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