export const getSquareDiv = square => {
  const [row, col] = square;
  return document.querySelector(`div[data-pos="${row},${col}"`);
}

export const getSquareInp = square => {
  return getSquareDiv(square).querySelector('input');
}