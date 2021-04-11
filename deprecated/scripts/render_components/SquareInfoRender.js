import InfoRender from "./InfoRender";

export default class SquareInfoRender extends InfoRender {

  constructor(puzzle) {
    super(puzzle, puzzle.divs.squareInfoDiv);
    this.size = puzzle.size;
    this.nums = this.root.querySelector('.gm-info-nums');
    this.check = this.nums.querySelector('.info-nums-check');
    this.numSpans = [];
  }

  render(){
    const numDivs = [];
    if ( this.size <= 6 ) { this.nums.classList.add('small') };

    for ( let i = 0; i < this.size/3; i ++){
      let numDiv = document.createElement('div');
      numDiv.className = 'info-num-wrapper';
      numDiv.style = `grid-area: ${i+1} / 1 / ${i+2} / 2`;
      for ( let j = i*3 + 1; j <= (i+1)*3 && j <= this.size; j++ ){
        let numSpan = document.createElement('span');
        numSpan.innerText = j;
        numSpan.className = 'info-num';
        numDiv.append(numSpan);
        this.numSpans.push(numSpan);
      }
      numDivs.push(numDiv);
    }

    this.nums.prepend(...numDivs);
  }

  update(square, appearing){
    this.square = this.puzzle.getSquare(square);
    this.squareInfo = this.square.squareInfo;
    
    this.numSpans.forEach( (numSpan, idx) => this._renderNum(numSpan, idx));

    const checkClasses = this.check.classList;
    if (checkClasses.contains('selected') !== this.squareInfo.locked){
      checkClasses.toggle('selected');
    }

    if (appearing) { super.show() };
  }

  _renderNum(numSpan, idx){
    const selected = this.squareInfo.options.includes(idx + 1);
    const locked = this.squareInfo.locked;
    
    let [lockedClass, selectedClass] = ['', ''];
    if (selected){
      lockedClass = locked ? 'ruled-in' : '';
      selectedClass = 'selected';
    } else {
      lockedClass = locked ? 'ruled-out' : '';
    }

    numSpan.className = `info-num ${lockedClass} ${selectedClass}`;
  }

}