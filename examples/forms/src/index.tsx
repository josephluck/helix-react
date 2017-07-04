import h from '../../../src/html'
import HelixReact from '../../../src/index'
import Helix from 'helix-js'
import Twine from 'twine-js'

type FormState<F extends any> = F
interface FormReducers<F extends any> {
  resetForm: Twine.ScopedReducer0<FormState<F>>
  setField: Twine.ScopedReducer2<FormState<F>, string, any>
}
type FormActions<F extends any> = Twine.Actions<FormReducers<F>, {}, {}>
type DefaultForm<F> = () => F

function formModel<F extends any>(
  defaultForm: DefaultForm<F>
): Twine.ScopedModel<FormState<F>, FormReducers<F>, {}, {}> {
  return {
    scoped: true,
    state: defaultForm(),
    reducers: {
      resetForm(state) {
        return defaultForm()
      },
      setField(state, key, value) {
        return Object.assign({}, state, {
          [key]: value,
        })
      },
    },
    effects: {},
  }
}

interface Comment {
  name: string
  comment: string
}
interface CommentsLocalState {
  comments: Comment[]
}
interface CommentsState extends CommentsLocalState {
  form: FormState<Comment>
}
interface CommentsReducers {
  setComments: Twine.Reducer<Models, CommentsState, Comment[]>
}
interface CommentsEffects {
  addNewComment: Twine.Effect0<Models, Promise<null>>
}
type CommentsLocalActions = Twine.Actions<CommentsReducers, CommentsEffects, {}>

interface CommentsActions extends CommentsLocalActions {
  form: FormActions<Comment>
}
type CommentsModelApi = Twine.ModelApi<CommentsState, CommentsActions>

function commentsModel(): Twine.ModelImpl<CommentsLocalState, CommentsReducers, CommentsEffects, {}> {
  return {
    state: {
      comments: [],
    },
    reducers: {
      setComments(state, comments) {
        return { ...state, comments }
      }
    },
    effects: {
      addNewComment(state, actions) {
        return new Promise(resolve => {
          setTimeout(() => {
            const newComments = state.comments.comments.concat(state.comments.form)
            actions.comments.setComments(newComments)
            actions.comments.form.resetForm()
            resolve(null)
          }, 1000)
        })
      },
    },
    models: {
      form: formModel(() => {
        return {
          name: '',
          comment: '',
        }
      }),
    },
  }
}

interface RegisterForm {
  username: string
  password: string
}
interface RegisterLocalState { }
interface RegisterState extends RegisterLocalState {
  form: FormState<RegisterForm>
}
interface RegisterReducers { }
interface RegisterEffects { }
type RegisterLocalActions = Twine.Actions<RegisterReducers, RegisterEffects, {}>

interface RegisterActions extends RegisterLocalActions {
  form: FormActions<RegisterForm>
}
type RegisterModelApi = Twine.ModelApi<RegisterState, RegisterActions>

function registerModel(): Twine.ModelImpl<RegisterLocalState, RegisterReducers, RegisterEffects, {}> {
  return {
    state: {},
    reducers: {},
    effects: {},
    models: {
      form: formModel(() => {
        return {
          username: '',
          password: '',
        }
      }),
    },
  }
}

type Models = Helix.Models<{
  'comments': CommentsModelApi,
  'register': RegisterModelApi,
}>

const component: Helix.Component<Models> = (state, previous, actions) => {
  function renderComment(comment: Comment) {
    return <div><strong>{comment.name}</strong> <i>{comment.comment}</i></div>
  }
  return (
    <div>
      <h1>Comments</h1>
      {state.comments.comments.map(renderComment)}
      <label>
        Name
        <input
          value={state.comments.form.name}
          onInput={(e: any) => actions.comments.form.setField('name', e.target.value)}
        />
      </label>
      <label>
        Comment
        <input
          value={state.comments.form.comment}
          onInput={(e: any) => actions.comments.form.setField('comment', e.target.value)}
        />
      </label>
      <button onClick={actions.comments.addNewComment}>Add Comment</button>
      <hr />
      <h1>Registration</h1>
      <label>
        Username
        <input
          value={state.register.form.username}
          onInput={(e: any) => actions.register.form.setField('username', e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type='password'
          value={state.register.form.password}
          onInput={(e: any) => actions.register.form.setField('password', e.target.value)}
        />
      </label>
      {state.register.form.username} - {state.register.form.password}
    </div>
  )
}

const mount = document.createElement('div')
document.body.appendChild(mount)

HelixReact({
  model: {
    state: {},
    reducers: {},
    effects: {},
    models: {
      comments: commentsModel(),
      register: registerModel(),
    },
  },
  component,
  mount,
})
