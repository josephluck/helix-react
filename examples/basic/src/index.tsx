import h from '../../../src/html'
import HelixReact from '../../../src/index'
import Helix from 'helix-js'
import Twine from 'twine-js'

interface State {
  title: string
}

interface Reducers {
  set: Twine.Reducer<Models, State, string>
}

interface Effects {}

interface Subscriptions {}

interface ModelApi {
  state: State
  actions: Twine.Actions<Reducers, Effects, Subscriptions>
}

type Models = Helix.Model<ModelApi>

function model (): Twine.ModelImpl<State, Reducers, Effects, Subscriptions> {
  return {
    state: {
      title: 'not set',
    },
    reducers: {
      set (state, title) {
        return Object.assign({}, state, {
          title: title,
        })
      },
    },
  }
}

function Links ({
  onRouteClick,
}) {
  const style = {
    marginRight: '10px',
  }
  return (
    <div>
      <a style={style} href='/'>view one</a>
      <a style={style} href='/bar'>view two</a>
      <a style={style} href='/bar/123'>view three (123)</a>
      <a style={style} href='/bar/456'>view three (456)</a>
      <a style={style} href='/bar/789'>view three (789)</a>
      <a style={style} onClick={() => onRouteClick('/bar/abc')}>view three (abc)</a>
      <a style={style} onClick={() => onRouteClick('/bar/def')}>view three (def)</a>
    </div>
  )
}

const pageOne: Helix.Page<Models> = {
  view (state, prev, actions) {
    return (
      <div>
        <Links
          onRouteClick={actions.location.set}
        />
        <h1>view one</h1>
        {state.title}
        <div>
          <input value={state.title} onInput={(e: any) => actions.set(e.target.value)} />
        </div>
      </div>
    )
  },
}

const pageTwo: Helix.Page<Models> = {
  onEnter (state, prev, actions) {
    actions.set('You have entered bar')
    console.log('bar onEnter', state.location.pathname)
  },
  onUpdate (state, prev, actions) {
    actions.set('You have updated bar')
    console.log('bar onUpdate', state.location.pathname)
  },
  onLeave (state, prev, actions) {
    actions.set('You have left bar')
    console.log('bar onLeave', state.location.pathname)
  },
  view (state, prev, actions) {
    return (
      <div>
        <Links
          onRouteClick={actions.location.set}
        />
        <h1>view two</h1>
        {state.title}
        <div>
          <input value={state.title} onInput={(e: any) => actions.set(e.target.value)} />
        </div>
      </div>
    )
  },
}

const pageThree: Helix.Page<Models> = {
  onEnter (state, prev, actions) {
    actions.set(`You have entered bar:/baz ${state.location.params.baz}`)
    console.log('bar/:baz onEnter', state.location.pathname)
  },
  onUpdate (state, prev, actions) {
    actions.set(`You have updated bar:/baz ${state.location.params.baz}`)
    console.log('bar/:baz onUpdate', state.location.pathname)
  },
  onLeave (state, prev, actions) {
    actions.set(`You have left bar:/baz ${state.location.params.baz}`)
    console.log('bar/:baz onLeave', state.location.pathname)
  },
  view (state, prev, actions) {
    return (
      <div>
        <Links
          onRouteClick={actions.location.set}
        />
        <h1>view three {state.location.params.baz}</h1>
        {state.title}
        <div>
          <input value={state.title} onInput={(e: any) => actions.set(e.target.value)} />
        </div>
      </div>
    )
  },
}

let mount = document.createElement('div')
document.body.appendChild(mount)

const actions = HelixReact({
  model:  model(),
  routes: {
    '/': pageOne,
    '/bar': pageTwo,
    '/bar/:baz': pageThree,
  },
  mount,
})

setTimeout(() => {
  actions.set('I was set')
}, 2000)
