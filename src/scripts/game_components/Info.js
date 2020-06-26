export default class Info {
  constructor(puzzle) {
    this.puzzle = puzzle;
    this.square = null;
  }

  setSquare(square, isNew = false) {
    this.square = square;
    this.render({ newSquare: isNew });
  }

  clearSquare() {
    this.square = null;
    this.render({ clearSquare: true });
  }

  render(opts = {}) {
    if (opts.newSquare) {
      this.renderer.show();
    } else if (opts.clearSquare) {
      this.renderer.clear();
    } else if (opts.updateSquare) {
      this.renderer.update();
    } else {
      this.renderer.render();
    }
  }

}