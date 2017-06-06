import Helix from 'helix-js'

declare function HelixReact(opts: HelixReact.Opts): any

declare namespace HelixReact {
  interface Opts extends Helix.Opts {
    mount: HTMLElement
  }
}

export = HelixReact
