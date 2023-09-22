import { createContext, DependencyList, useContext, useEffect as useEffectReact, useRef } from "react"
import { autoRerun } from "core/utils"
import Stores from "core/stores/Stores"
import { setLookups } from "core/models/Lookups"
import ActionInfo from "core/models/ActionInfo"
import Form from "core/models/Form"

type UnloadEffect = () => void | undefined | Promise<void>
type EffectCallback = () => void | Promise<void> | UnloadEffect

export function useEffect(effect: EffectCallback, deps?: DependencyList) {
  useEffectReact(() => effect() as any, deps)
}

export function useInitialEffect(effect: EffectCallback) {
  return useEffect(() => {
    effect()
  }, [])
}

export function useUnloadEffect(unloadEffect: UnloadEffect) {
  return useEffect(() => unloadEffect, [])
}

export function rerunWhileComponentLoaded(action: () => any, frequencyInSeconds: number) {
  useInitialEffect(() => autoRerun(action, frequencyInSeconds))
}

export function useRequestTracker() {
  const tracker = useRef(0)
  return {
    startRequest: () => (tracker.current = Math.random()),
    isLatestRequest: (num: number) => num == tracker.current,
  }
}

export function useOnlyLatestRequest<T>(request: () => Promise<T>, updater: (result: T) => any) {
  const { startRequest, isLatestRequest } = useRequestTracker()

  return async () => {
    const thisRun = startRequest()
    const result = await request()
    if (isLatestRequest(thisRun)) {
      updater(result)
    }
  }
}

export const StoresContext = createContext(null as Stores)

export async function createStores(actionInfo?: ActionInfo) {
  const stores = new Stores()
  setLookups(stores)
  await stores.initialize(actionInfo)
  return stores
}

export function useStore() {
  return useContext(StoresContext)
}

export const FormContext = createContext(null as Form)

export function useForm() {
  return useContext(FormContext)
}

class Field {
  form: Form
  key: keyof Form

  constructor(form: Form, key: keyof Form) {
    this.form = form
    this.key = key
  }

  get value(): any {
    return this.form[this.key]
  }

  get hasErrors() {
    return this.form.hasErrors(this.key)
  }

  get errorText() {
    return this.form.errorText(this.key)
  }

  get onChange() {
    return this.form.onChange(this.key)
  }
}

export function useFormField(name: string, formToUse?: Form) {
  const form = formToUse || useForm()
  form.validField(name)
  return new Field(form, name as keyof Form)
}
