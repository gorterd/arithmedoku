import {
  unprotect,
  applySnapshot,
  getSnapshot
} from 'mobx-state-tree'
import './shared/spotlight'


let devFlag = false
export const activateDevFlag = () => devFlag = true

export const setupDev = (game) => {
  if (!devFlag) return

  unprotect(game.gameStore)
  setupPalette()

  window.gs = game.gameStore
  window.getSnap = getSnapshot
  window.applySnap = applySnapshot
  document.body.style.overflow = 'auto'
}

export const devLog = (...args) => {
  if (!devFlag) return
  console.log(...args)
}

function setupPalette() {
  const COLORS = [
    'light-brick-1',
    'light-brick-2',
    'light-brick-2-transparent',
    'light-brick-3',
    'light-brick-4',
    'light-brick-5',
    'light-brick-6',
    'light-brick-7',
    'brick-1',
    'brick-2',
    'violet-1',
    'violet-1-transparent',
    'violet-2',
    'violet-3',
    'violet-4',
    'light-ocean-1',
    'light-ocean-2',
    'light-ocean-2-transparent',
    'light-ocean-3',
    'light-ocean-4',
    'light-ocean-5',
    'ocean-1',
    'ocean-2',
    'ocean-2-semi-translucent',
    'grey-ocean-1',
    'grey-ocean-2',
    'grey-ocean-3',
    'grey-ocean-4',
    'grey-ocean-5',
    'grey-ocean-6',
    'green-1',
    'green-1-transparent',
    'green-2',
    'green-3',
    'green-4',
    'cream-1',
    'cream-2',
    'cream-3',
    'cream-4',
    'cream-5',
    'cream-6',
    'cream-7',
    'cream-8',
    'cream-9',
    'cream-10',
    'cappuccino-1',
    'cappuccino-2',
    'cappuccino-3',
  ]

  const palette = document.createElement('section')
  palette.className = 'hidden'
  palette.id = 'color-palette'

  COLORS.forEach(color => {
    let colorDiv = document.createElement('div')
    colorDiv.className = `color-div ${color}`

    let colorLabel = document.createElement('span')
    colorLabel.className = `color-label`
    colorLabel.innerText = color
    colorDiv.appendChild(colorLabel)

    palette.appendChild(colorDiv)
  })

  let testDiv = document.createElement('div')
  testDiv.className = `color-div brick-1`

  let colorLabel = document.createElement('span')
  colorLabel.className = `color-label`
  colorLabel.innerText = 'testDiv'
  testDiv.appendChild(colorLabel)
  palette.appendChild(testDiv)
  testDiv.onclick = () => testDiv.classList.toggle('test-color-div')

  document.addEventListener('keydown', e => {
    if (e.code === 'KeyP') palette.classList.toggle('hidden')
  })

  document.querySelector('.app').append(palette)
}

