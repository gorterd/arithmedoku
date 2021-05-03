import { addNoFocusClickListener, createSVGElement } from "../shared/dom_util"
import { throttle } from "../shared/general_util"
import Spotlight from "../shared/spotlight"

export default ({ env }) => {
  const caption = env.templates.spotlightCaption.cloneNode(true)
  const svg = createSVG()

  let removeListener = () => { }
  const steps = getSpotlights(env.elements).map(spotlight => () => {
    removeListener()
    appendIfRemoved(svg, caption)

    function update() {
      spotlight.updateSVG({ element: svg, regenerate: true })
      spotlight.updateCaption({ element: caption, regenerate: false })
    }

    window.addEventListener('resize', update)
    removeListener = () => window.removeEventListener('resize', update)

    update()
  })

  return new Promise((resolve) => {
    const finish = () => {
      svg.remove()
      caption.remove()
      resolve()
    }
    steps.push(finish)

    let curStep = 0
    const { nextBtn, previousBtn, finishBtn } = getCaptionElements(caption)
    addNoFocusClickListener(nextBtn, () => {
      steps[++curStep]()
    })

    addNoFocusClickListener(previousBtn, () => {
      if (curStep > 0) steps[--curStep]()
    })

    addNoFocusClickListener(finishBtn, finish)

    steps[curStep]()
  })
}

function getSpotlights({ puzzle, infoBox }) {
  return [
    Spotlight.fromEle(puzzle),
    Spotlight.fromEle(infoBox.parentElement, {
      padding: 10,
      captionPosition: 'left',
      captionOffset: {
        x: '-10px',
        y: '50px'
      }
    }),
  ]
}

function getCaptionElements(captionEle) {
  return {
    nextBtn: captionEle.querySelector('#spotlight-next'),
    previousBtn: captionEle.querySelector('#spotlight-previous'),
    finishBtn: captionEle.querySelector('#spotlight-finish'),
  }
}

function createSVG() {
  const svg = createSVGElement('svg')
  const path = createSVGElement('path')
  path.setAttribute('fill-rule', 'evenodd')

  svg.appendChild(path)
  svg.setAttribute('class', 'spotlight-frame')
  return svg
}

function appendIfRemoved(...eles) {
  const removedEles = eles.filter(ele => !document.body.contains(ele))
  document.body.append(...removedEles)
}