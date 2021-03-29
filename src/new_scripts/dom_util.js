export const extractPosFromSquare = square =>
  square?.dataset.pos.split(',')

export const extractPosFromEvent = e =>
  extractPosFromSquare(e.target.closest('.square'))

