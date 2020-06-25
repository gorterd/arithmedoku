import SquareInfoRender from "../render_components/square_info_render";

export default class SquareInfo {
  constructor(puzzle, root) {
    this.puzzle = puzzle;
    this.square = null;

    this.renderer = new SquareInfoRender(root, this);
  }

  setSquare(square){
    this.square = square;
    this.render({newSquare: true});
  }

  render(opts = {}){
    if (opts.newSquare){
      this.renderer.update();
    }
    this.renderer.render();
  }

}