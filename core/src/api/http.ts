import { API_URL } from "core/constants";
import fetch from "cross-fetch";
import { toType, toTypeList } from "core/serialization";
import ApiError from "core/api/error";

const Http = {
  get: <T>(r: GetRequest<T>) => doFetch<T, T>(r, "GET"),

  getList: <T>(r: GetRequest<T>) => doFetch<T, T[]>(r, "GET"),

  delete: (r: BaseRequest) => doFetch(r, "DELETE"),

  post: <T>(r: Request<T>) => doFetch<T, T>(r, "POST"),

  put: <T>(r: Request<T>) => doFetch<T, T>(r, "PUT"),

  patch: <T>(r: Request<T>) => doFetch<T, T>(r, "PATCH"),

  setToken: (token: string | null) => addOrRemoveHeader("Authorization", token ? `Bearer ${token}` : null),

  setOrganizationId: (organizationId: number | null) => addOrRemoveHeader("Organization", organizationId),
};

export default Http;

interface BaseRequest {
  path: string;
  query?: { [key: string]: any };
}

interface GetRequest<T> extends BaseRequest {
  result?: new () => T;
}

interface Request<T> extends GetRequest<T> {
  body?: any;
}

const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

async function doFetch<T, R>(info: Request<T>, method: string): Promise<R> {
  const options: any = { method: method, headers: HEADERS };

  if (info.body) {
    options.body = JSON.stringify(info.body);
  }

  let url = API_URL + info.path;

  if (info.query) {
    url += url.includes("?") ? "&" : "?";
    url += Object.keys(info.query)
      .map((key) => `${key}=${encodeURIComponent(info.query[key])}`)
      .join("&");
  }

  const response = await fetch(url, options);

  if (response.status == 400) {
    const { errors } = await response.json();
    throw new ApiError(response.status, "validation errors", errors);
  }

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  const data = await response.json();

  if (!info.result) {
    return data;
  }

  try {
    if (Array.isArray(data)) {
      return toTypeList(data as any, info.result) as any;
    } else {
      return toType(data, info.result) as any;
    }
  } catch (e) {
    console.log(e);
    throw new ApiError(response.status, e.message);
  }
}

function addOrRemoveHeader(name: string, value: string | number | null) {
  if (value) {
    HEADERS[name] = value.toString();
  } else {
    delete HEADERS[name];
  }
}
