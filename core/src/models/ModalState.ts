import { action, makeObservable, observable } from "mobx"

const modalStack: ModalState<any, any>[] = []

export default class ModalState<T, R> {
  @observable open: boolean = false
  @observable state: T | null = {} as T
  onClose: (result?: R) => any
  onHidden: (result?: R) => any
  onOpen: () => any
  beforeOpen: (state: T | null) => any

  constructor() {
    makeObservable(this)
  }

  @action.bound
  show(state: T | null = null, onClose?: (result?: R) => any) {
    this.push()
    this.state = state
    if (this.beforeOpen) this.beforeOpen(state)
    this.onClose = onClose
    this.open = true
    if (this.onOpen) setTimeout(this.onOpen, 250)
  }

  @action
  private pop() {
    modalStack.pop()
    if (modalStack.length > 0) {
      modalStack[modalStack.length - 1].open = true
    }
  }

  @action
  private push() {
    if (modalStack.length > 0) {
      modalStack[modalStack.length - 1].open = false
    }
    modalStack.push(this)
  }

  @action.bound
  hide(result?: R) {
    this.open = false
    if (this.onClose) {
      try {
        this.onClose(result)
      } finally {
        this.onClose = null
      }
    }
    this.pop()
    if (this.onHidden) setTimeout(() => this.onHidden(result), 250)
  }
}
