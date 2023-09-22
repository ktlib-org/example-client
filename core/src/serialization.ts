import { isArray, isFunction, isObject, map, omit } from "radash"
import { toJS } from "mobx"
import { isField } from "./utils"

export function serialize(object: any): string {
  return JSON.stringify(toData(object))
}

export function toData<T>(object: T): Partial<T> {
  return fromType(toJS(object))
}

function fromType(value: any): any {
  if (isArray(value)) {
    return map(value, fromType)
  } else if (isObject(value) && value.constructor) {
    const data = {}
    const proto = Object.getPrototypeOf(value)
    return Object.keys(omit(value, (value.constructor as any).ignores || [])).forEach((key) => {
      if (isField(value, key, proto)) {
        data[key] = fromType(value[key])
      }
    })
  }

  return value
}

export function deserialize<T>(json: string, type: (new () => T) | T): T {
  return toType<T>(JSON.parse(json), type)
}

export async function promiseTypeList<T>(data: Promise<Partial<T>[]>, type: new () => T): Promise<T[]> {
  return toTypeList(await data, type)
}

export function toTypeList<T>(data: Partial<T>[], type: new () => T): T[] {
  return data.map((d) => toType(d, type))
}

export async function promiseType<T>(data: Promise<Partial<T>>, type: (new () => T) | T): Promise<T> {
  return toType(await data, type)
}

export function toType<T>(data: Partial<T>, type: (new () => T) | T): T {
  let instance: T
  let Type: any

  if (!type) {
    throw "You must give a type constructor or instance"
  } else if (isFunction(type)) {
    Type = type as any
    instance = new Type()
  } else {
    instance = type as T
    Type = type.constructor
  }

  if (!data) return instance

  Object.assign(instance, omit(data, Type.ignores))

  if (Type.types) {
    Object.keys(Type.types).forEach((k) => {
      if (instance[k]) {
        instance[k] = isArray(instance[k]) ? toTypeList(instance[k], Type.types[k]) : toType(instance[k], Type.types[k])
      }
    })
  }

  return instance
}

export function type(type: new () => any): any {
  return (target: any, propName: any, descriptor: any) => {
    if (!target.constructor.types) {
      target.constructor.types = {}
    }
    target.constructor.types[propName] = type
    return descriptor
  }
}

export function ignore(target: any, propName: any, descriptor: PropertyDescriptor): PropertyDescriptor {
  if (!target.constructor.ignores) {
    target.constructor.ignores = []
  }
  target.constructor.ignores.push(propName)
  return descriptor
}
