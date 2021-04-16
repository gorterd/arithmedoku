export default class InfoRender {

  constructor(puzzle, root) {
    this.puzzle = puzzle;
    this.root = root;
  }

  render(){

  }
  
  update(square, appearing) {
  }
  
  show(){
    this.root.classList.add('show');
  }

  clear() {
    this.root.classList.remove('show');
  }

}