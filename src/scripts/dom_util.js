export const getSquareDiv = square => {
  const [row, col] = square;
  return document.querySelector(`div[data-pos="${row},${col}"`);
}

export const getSquareInp = square => {
  return getSquareDiv(square).querySelector('input');
}

export const handleConflicts = (square, conflictingSquares) => {
  const conflictingDivs = conflictingSquares.map( sq => getSquareDiv(sq));
  const squareInp = getSquareInp(square);

  conflictingDivs.forEach( sq => sq.classList.add('conflicting'));
  squareInp.classList.add('mistake');

  window.setTimeout( () => {
    conflictingDivs.forEach( sq => sq.classList.remove('conflicting'));
    squareInp.classList.remove('mistake');
    squareInp.value = '';
  }, 600);
}