// export const baseIcons = (...classNames) => ([
//   createIcon('square', ...classNames),
// ])

import { ICONS } from "./constants"

// export const eliminatedIcons = (...classNames) => ([
//   createIcon('square', '--eliminated', ...classNames),
//   createIcon('slash', '--eliminated', '--small', ...classNames),
// ])

// export const alternativeIcons = (...classNames) => ([
//   createIcon('square', ...classNames),
//   createIcon('square', '--alternative', ...classNames),
// ])

// export const requiredIcons = (...classNames) => ([
//   createIcon('square', '--required', ...classNames),
// ])

const BASE_ICON_CLASS = 'possibility-icon'


const createBasicIcon = (iconName) => {
  const icon = document.createElement('i')
  icon.className = ICONS[iconName]
  return icon
}

const createIcon = (iconName, ...spanClasses) => {
  const iconSpan = document.createElement('span')

  iconSpan.appendChild(createBasicIcon(iconName))
  iconSpan.classList.add(
    BASE_ICON_CLASS,
    ...spanClasses.map(className => BASE_ICON_CLASS + className)
  )

  return iconSpan
}

export const baseIcons = () => ([
  createIcon('square'),
])

export const eliminatedIcons = () => ([
  createIcon('square', '--eliminated'),
  createIcon('slash', '--small'),
])

export const alternativeIcons = () => ([
  createIcon('square', '--alternative'),
  createIcon('square', '--alternative-inner'),
])

export const requiredIcons = () => ([
  createIcon('square', '--required'),
])

export const filterPossibilityClassName = (...flags) => {
  const baseName = 'filter-possibility'
  return [baseName]
    .concat(flags.map(flag => `${baseName}--${flag}`))
    .join(' ')
}