export default class InfoRender {

  constructor(root) {
    this.root = root;
  }

  render() {
    this.root.classList.add('show');
  }

  update() {
  }

  clear() {
    this.root.classList.remove('show');
  }

}