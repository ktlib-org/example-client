import { omit, map, each, keys, assign, isFunction, isObjectLike, isArray, chain, isArrayLike } from "lodash";
import { toJS } from "mobx";
import { isField } from "./utils";

export function serialize(object: any): string {
  return JSON.stringify(toData(object));
}

export function toData<T>(object: T): Partial<T> {
  return fromType(toJS(object));
}

function fromType(value: any): any {
  if (isArray(value)) {
    return map(value, fromType);
  } else if (isObjectLike(value) && value.constructor) {
    const data = {};
    const proto = Object.getPrototypeOf(value);
    chain(value)
      .omit(value.constructor.ignores || [])
      .keys()
      .each((key) => {
        if (isField(value, key, proto)) {
          data[key] = fromType(value[key]);
        }
      })
      .value();

    return data;
  }

  return value;
}

export function deserialize<T>(json: string, type: (new () => T) | T): T {
  return toType<T>(JSON.parse(json), type);
}

export function toTypeList<T>(data: Partial<T>[], type: new () => T): T[] {
  return map(data, (d) => toType(d, type));
}

export function toType<T>(data: Partial<T>, type: (new () => T) | T): T {
  let instance: T;
  let Type: any;

  if (!type) {
    throw "You must give a type constructor or instance";
  } else if (isFunction(type)) {
    Type = type as any;
    instance = new Type();
  } else {
    instance = type as T;
    Type = type.constructor;
  }

  if (!data) return instance;

  assign(instance, omit(data, Type.ignores));

  if (Type.types) {
    each(keys(Type.types), (k) => {
      if (instance[k]) {
        instance[k] = isArrayLike(instance[k])
          ? toTypeList(instance[k], Type.types[k])
          : toType(instance[k], Type.types[k]);
      }
    });
  }

  return instance;
}

export function type(type: new () => any): any {
  return (target, propName, descriptor) => {
    if (!target.constructor.types) {
      target.constructor.types = {};
    }
    target.constructor.types[propName] = type;
    return descriptor;
  };
}

export function ignore(target, propName, descriptor: PropertyDescriptor): PropertyDescriptor {
  if (!target.constructor.ignores) {
    target.constructor.ignores = [];
  }
  target.constructor.ignores.push(propName);
  return descriptor;
}
