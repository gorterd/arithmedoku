import { ICONS } from "../util/constants"
import { kebabToCamel } from "../util/general_util"

export default function initialMount() {
  document.querySelectorAll('i').forEach(icon => {
    icon.className = ICONS[kebabToCamel(icon.className)]
  })
}