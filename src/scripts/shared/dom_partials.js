import { createIcon } from "./dom_util"

export const baseIcons = (...classNames) => ([
  createIcon('square', ...classNames),
])

export const eliminatedIcons = (...classNames) => ([
  createIcon('square', '--eliminated', ...classNames),
  createIcon('slash', '--eliminated', '--small', ...classNames),
])

export const alternativeIcons = (...classNames) => ([
  createIcon('square', ...classNames),
  createIcon('square', '--alternative', ...classNames),
])

export const requiredIcons = (...classNames) => ([
  createIcon('square', '--required', ...classNames),
])