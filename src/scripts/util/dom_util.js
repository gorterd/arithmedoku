export const extractPosFromSquare = square =>
  square?.dataset.pos.split(',')

export const extractPosFromEvent = e =>
  extractPosFromSquare(e.target.closest('.square'))

export const mountDropdown = (button, dropdown, showClass) => {
  document.addEventListener('click', e => {
    const outsideDropdown = !dropdown.contains(e.target)
    const onButton = outsideDropdown && button.contains(e.target)
    const isShowing = dropdown.classList.contains(showClass)

    if (
      (isShowing && outsideDropdown)
      || (!isShowing && onButton)
    ) {
      dropdown.classList.toggle(showClass)
    }
  })
}
