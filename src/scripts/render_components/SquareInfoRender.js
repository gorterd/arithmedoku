import InfoRender from "./InfoRender";

export default class SquareInfoRender extends InfoRender {

  constructor(root, squareInfo) {
    super(root);
    this.squareInfo = squareInfo;
    this.nums = root.querySelector('.gm-info-nums');
  }

  render(){
    const numDivs = [];
    const size = this.squareInfo.puzzle.size;

    for (let i=1; i <= size; i++){
      let numDiv = document.createElement('div');
      numDiv.className = 'info-num-wrapper';
      numDiv.style = `flex-basis: ${200/(size % 2 === 0 ? size : size+1)}%`;
      let numSpan = document.createElement('span');
      numSpan.innerText = i;
      numSpan.className = 'info-num';
      numDiv.append(numSpan);
      numDivs.push(numDiv);
    }
    this.nums.prepend(...numDivs);
  }

}