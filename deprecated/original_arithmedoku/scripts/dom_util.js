export const getSquareDiv = square => {
  const [row, col] = square;
  return document.querySelector(`div[data-pos="${row},${col}"`);
}

export const getSquareInp = square => {
  return getSquareDiv(square).querySelector('input');
}

export const handleConflicts = (square, conflictingSquares) => {
  illumineSquares(conflictingSquares);

  const squareInp = getSquareInp(square);
  squareInp.classList.add('mistake');

  window.setTimeout(() => {
    squareInp.classList.remove('mistake');
    squareInp.value = '';
  }, 600);
}

export const illumineSquares = squares => {
  const squareDivs = squares.map(sq => getSquareDiv(sq));

  squareDivs.forEach(sq => sq.classList.add('conflicting'));

  window.setTimeout(() => {
    squareDivs.forEach(sq => sq.classList.remove('conflicting'));
  }, 600);
}

e