import { ButtonColor } from "core/constants";
import { action, makeObservable, observable } from "mobx";
import { Store } from "./store";

export class ModalState<T, R> {
  @observable open: boolean = false;
  @observable state: T = {} as T;
  onClose: (result?: R) => any;
  onHidden: () => any;
  onOpen: () => any;
  beforeOpen: () => any;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  show(state: T, onClose?: (result?: R) => any) {
    this.state = state;
    if (this.beforeOpen) this.beforeOpen();
    this.onClose = onClose;
    this.open = true;
    if (this.onOpen) setTimeout(this.onOpen, 50);
  }

  @action.bound
  hide(result?: R) {
    this.open = false;
    if (this.onClose) {
      try {
        this.onClose(result);
      } finally {
        this.onClose = null;
      }
    }
    if (this.onHidden) {
      this.onHidden();
    }
  }
}

interface ConfirmationState {
  message: string | JSX.Element;
  okText?: string;
  okColor?: ButtonColor;
  hideOk?: boolean;
  cancelText?: string;
  cancelColor?: ButtonColor;
  hideCancel?: boolean;
  hideButtonIcons?: boolean;
  header?: string | JSX.Element;
}

export class ModalStoreClass extends Store {
  readonly confirmation = new ModalState<ConfirmationState, boolean>();
  readonly userProfile = new ModalState<void, void>();
  readonly updatePassword = new ModalState<void, void>();
  readonly organization = new ModalState<void, void>();
  readonly invite = new ModalState<void, void>();

  async clear() {}
}
