import { ICONS } from "./constants"
import { generateClassName } from "./general_util"

const createBasicIcon = (iconName) => {
  const icon = document.createElement('i')
  icon.className = ICONS[iconName]
  return icon
}

const createIcon = (iconName, ...flags) => {
  const iconSpan = document.createElement('span')
  iconSpan.appendChild(createBasicIcon(iconName))
  iconSpan.className = generateClassName('possibility-icon', flags)

  return iconSpan
}

export const baseIcons = () => ([
  createIcon('square'),
])

export const eliminatedIcons = () => ([
  createIcon('square', 'eliminated'),
  createIcon('slash', 'small'),
])

export const alternativeIcons = () => ([
  createIcon('square', 'alternative'),
  createIcon('square', 'alternative-inner'),
])

export const requiredIcons = () => ([
  createIcon('square', 'required'),
])