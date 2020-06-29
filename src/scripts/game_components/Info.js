export default class Info {
  constructor(puzzle, renderer) {
    this.puzzle = puzzle;
    this.renderer = renderer;
    this.square = null;
  }

  setSquare(square, appearing = false) {
    this.square = square;
    this.render(square, { update: true, appearing });
  }

  clearSquare() {
    this.square = null;
    this.render(null, { clear: true });
  }

  render(square = null, opts = {}) {
    if (opts.appearing) {
      this.renderer.show(square);
    } else if (opts.clear) {
      this.renderer.clear();
    } else if (opts.update) {
      this.renderer.update(square);
    } else {
      this.renderer.render();
    }
  }

}