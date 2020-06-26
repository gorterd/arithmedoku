export default class InfoRender {

  constructor(root) {
    this.root = root;
  }

  render(){
    
  }
  
  update() {
  }
  
  show(){
    this.root.classList.add('show');
  }

  clear() {
    this.root.classList.remove('show');
  }

}