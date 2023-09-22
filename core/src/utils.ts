import { isEmpty, isFunction } from "radash"

export function substringBefore(value: string, separator: string) {
  const index = value.indexOf(separator)
  return index === -1 ? value : value.substring(0, index)
}

export function substringAfter(value: string, separator: string) {
  const index = value.indexOf(separator)
  return index === -1 ? value : value.substring(index + 1)
}

export function defaultIfEmpty(value: string, defaultValue: string) {
  return isEmpty(value) ? defaultValue : value
}

export function isBlank(value: string) {
  return !value || isEmpty(value.trim())
}

export function isNotBlank(value: string) {
  return !isBlank(value)
}

export function isField(object: any, key: string, prototype?: any): boolean {
  if (!prototype) {
    prototype = Object.getPrototypeOf(object)
  }

  if (isFunction(object[key])) return false

  const desc = Object.getOwnPropertyDescriptor(prototype, key)
  const hasGetter = desc && typeof desc.get === "function"
  return !hasGetter
}

export function delay(delayTime: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null), delayTime)
  })
}

export function autoRerun(action: () => any, freqencyInSeconds: number) {
  let keepRunning = true

  const doCall = () => {
    try {
      if (keepRunning) {
        action()
      }
    } catch (e) {
      console.log(e)
    } finally {
      if (keepRunning) {
        setTimeout(doCall, freqencyInSeconds * 1000)
      }
    }
  }

  doCall()

  return () => {
    keepRunning = false
  }
}
