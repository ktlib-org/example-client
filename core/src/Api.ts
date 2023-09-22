import { API_URL } from "core/constants"
import fetch from "cross-fetch"
import { toType, toTypeList } from "core/serialization"
import { ValidationError } from "core/models/Form"

export class HttpError {
  status: number
  message: string
  validationErrors: ValidationError[]

  constructor(status: number, message: string, validationErrors?: ValidationError[]) {
    this.status = status
    this.message = message
    this.validationErrors = validationErrors || []
  }
}

type ApiStatus = { up: boolean; version: string }

let baseEncodeJson = false

export default class Api {
  static get<T>(r: GetRequest<T>) {
    return doFetch<T, T>(r, "GET")
  }

  static getList<T>(r: GetRequest<T>) {
    return doFetch<T, T[]>(r, "GET")
  }

  static delete(r: BaseRequest) {
    return doFetch(r, "DELETE")
  }

  static post<T>(r: Request<T>) {
    return doFetch<T, T>(r, "POST")
  }

  static put<T>(r: Request<T>) {
    return doFetch<T, T>(r, "PUT")
  }

  static patch<T>(r: Request<T>) {
    return doFetch<T, T>(r, "PATCH")
  }

  static setToken(token: string | null) {
    addOrRemoveHeader("Authorization", token ? `Bearer ${token}` : null)
  }

  static setOrganizationId(organizationId: string | null) {
    addOrRemoveHeader("Organization", organizationId)
  }

  static async getStatus() {
    try {
      return (await Api.get({ path: "/status" })) as ApiStatus
    } catch (e) {
      return { up: false, version: "" } as ApiStatus
    }
  }

  static async isEmployee() {
    return (await Api.get({ path: "/q" })) === 1
  }

  static async checkEncoding() {
    try {
      baseEncodeJson = (await Api.get({ path: "/e" })) === 1
    } catch (e) {
      return false
    }
  }
}

interface BaseRequest {
  path: string
  query?: { [key: string]: any }
}

interface GetRequest<T> extends BaseRequest {
  result?: new () => T
}

interface Request<T> extends GetRequest<T> {
  body?: any
}

const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

async function doFetch<T, R>(info: Request<T>, method: string): Promise<R> {
  const options: any = { method: method, headers: HEADERS }

  if (info.body) {
    if (baseEncodeJson) {
      options.body = btoa(JSON.stringify(info.body))
    } else {
      options.body = JSON.stringify(info.body)
    }
  }

  let url = API_URL + info.path

  if (info.query) {
    url += url.includes("?") ? "&" : "?"
    url += Object.keys(info.query)
      .map((key) => `${key}=${encodeURIComponent(info.query[key])}`)
      .join("&")
  }

  const response = await fetch(url, options)

  if (response.status == 400) {
    const { errors } = await response.json()
    throw new HttpError(response.status, "validation errors", errors)
  }

  if (!response.ok) {
    throw new HttpError(response.status, await response.text())
  }

  let data: any

  try {
    if (!baseEncodeJson || response.headers.get("content-type") === "application/json") {
      data = await response.json()
    } else {
      data = JSON.parse(atob(await response.text()))
    }
  } catch (e) {
    data = {} as any
  }

  if (!info.result) {
    return data
  }

  try {
    if (Array.isArray(data)) {
      return toTypeList(data as any, info.result) as any
    } else {
      return toType(data, info.result) as any
    }
  } catch (e) {
    console.log(e)
    throw new HttpError(response.status, e.message)
  }
}

function addOrRemoveHeader(name: string, value: string | number | null) {
  if (value) {
    HEADERS[name] = value.toString()
  } else {
    delete HEADERS[name]
  }
}
