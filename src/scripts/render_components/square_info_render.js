export default class SquareInfoRender {

  constructor(root, squareInfo) {
    this.root = root;
    this.squareInfo = squareInfo;
  }

  render() {
  }

  update() {
    this.root.classList.add('show');
  }

}