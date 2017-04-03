import helix from '../../../src/index'
import h from '../../../src/html'

let startTime
let lastMeasure
function startMeasure (name) {
  startTime = performance.now()
  lastMeasure = name
}
function stopMeasure () {
  const last = lastMeasure
  if (lastMeasure) {
    window.setTimeout(function metaStopMeasure () {
      lastMeasure = null
      const stop = performance.now()
      console.log(last + ' took ' + (stop - startTime))
    }, 0)
  }
}

function view (state, prev, actions) {
  function run () {
    startMeasure('run')
    actions.run()
  }

  function runLots () {
    startMeasure('runLots')
    actions.runLots()
  }

  function add () {
    startMeasure('add')
    actions.add()
  }

  function update () {
    startMeasure('update')
    actions.update()
  }

  function clear () {
    startMeasure('clear')
    actions.clear()
  }

  function swapRows () {
    startMeasure('swapRows')
    actions.swapRows()
  }

  function del (id) {
    return function (e) {
      startMeasure('delete')
      actions.delete({ id: id })
    }
  }

  function click (id) {
    return function (e) {
      startMeasure('click')
      actions.select({ id: id })
    }
  }

  function className (id) {
    return id === state.selected ? 'danger' : ''
  }

  function printDuration () {
    stopMeasure()
  }

  printDuration()

  function row ({id, label}) {
    return (
      <tr className={className(id)}>
        <td className='col-md-1'>{id}</td>
        <td className='col-md-4'>
          <a onClick={click(id)}>{label}</a>
        </td>
        <td className='col-md-1'>
          <a onClick={del(id)}>
            <span className='glyphicon glyphicon-remove' aria-hidden='true'></span>
          </a>
        </td>
        <td className='col-md-6'></td>
      </tr>
    )
  }

  return (
    <div className='container'>
      <div className='jumbotron'>
        <div className='row'>
          <div className='col-md-6'>
            <h1>Helix</h1>
          </div>
        <div className='col-md-6'>
          <div className='row'>
            <div className='col-sm-6 smallpad'>
              <button type='button' className='btn btn-primary btn-block' id='run' onClick={run}>Create 1,000 rows</button>
            </div>
            <div className='col-sm-6 smallpad'>
              <button type='button' className='btn btn-primary btn-block' id='runlots' onClick={runLots}>Create 10,000 rows</button>
            </div>
            <div className='col-sm-6 smallpad'>
              <button type='button' className='btn btn-primary btn-block' id='add' onClick={add}>Append 1,000 rows</button>
            </div>
            <div className='col-sm-6 smallpad'>
              <button type='button' className='btn btn-primary btn-block' id='update' onClick={update}>Update every 10th row</button>
            </div>
            <div className='col-sm-6 smallpad'>
              <button type='button' className='btn btn-primary btn-block' id='clear' onClick={clear}>Clear</button>
            </div>
            <div className='col-sm-6 smallpad'>
              <button type='button' className='btn btn-primary btn-block' id='swaprows' onClick={swapRows}>Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table className='table table-hover table-striped test-data'>
      <tbody>
        {state.data.map((d, i) => {
          return row({
            id: d.id,
            label: d.label,
          })
        })}
      </tbody>
    </table>
    <span className='preloadicon glyphicon glyphicon-remove' aria-hidden='true'></span>
    </div>
  )
}

function model () {
  let id = 1

  function _random (max) {
    return Math.round(Math.random() * 1000) % max
  }

  function buildData (count) {
    count = count || 1000
    const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
    const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
    const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']

    return new Array(count).fill('').map(() => {
      return {
        id: id++,
        label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
      }
    })
  }

  return {
    state: {
      data: [],
      selected: false,
    },
    reducers: {
      run (state) {
        return { data: buildData(1000), selected: undefined }
      },
      add (state) {
        return {
          data: state.data.slice().concat(buildData(1000)),
          selected: undefined,
        }
      },
      runLots (state) {
        return { data: buildData(10000), selected: undefined }
      },
      clear (state) {
        return { data: [], selected: undefined }
      },
      update (state) {
        return {
          data: state.data.slice()
            .map((d, i) => {
              if (i % 10 === 0) {
                d.label = `{d.label} !!!`
              }
              return d
            }),
          selected: undefined,
        }
      },
      swapRows (state) {
        if (state.data.length > 10) {
          const newData = state.data.slice()
          const a = newData[4]
          newData[4] = newData[9]
          newData[9] = a

          return {
            data: newData,
            selected: state.selected,
          }
        } else {
          return state
        }
      },
      select (state, data) {
        return {
          data: state.data,
          selected: data.id,
        }
      },
      delete (state, data) {
        return {
          data: state.data.filter((d) => d.id !== data.id),
        }
      },
    },
  }
}

let mount = document.createElement('div')
document.body.appendChild(mount)

helix({
  model: model(),
  routes: {
    '': {
      view,
    },
  },
  mount,
})
