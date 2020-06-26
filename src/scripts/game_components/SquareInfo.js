import SquareInfoRender from "../render_components/SquareInfoRender";
import Info from "./Info";

export default class SquareInfo extends Info {
  constructor(puzzle, root) {
    super(puzzle);
    this.renderer = new SquareInfoRender(root, this);
  }

}