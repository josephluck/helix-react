import helix from 'helix-js'
import * as dom from 'react-dom'

function renderer (elm) {
  return function (node, state, prev, actions) {
    if (node) {
      dom.render(node(state, prev, actions), elm)
    }
  }
}

export default function (opts) {
  const config = Object.assign({}, opts, {
    render: renderer(opts.mount),
  })
  return helix(config)
}
