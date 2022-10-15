import ENVIRONMENT from "./environment";
import LOCAL_HOST from "./local-host";

export const EMPTY_OBJECT = Object.freeze({});
export const EMPTY_ARRAY = Object.freeze([]);
export const IDENTITY_FUNC = (x: any) => x;
export const EMPTY_FUNC = (): any => null;
export const TRUE_FUNC = () => true;

export const APP_NAME = "React Base";
export const IS_PROD = ENVIRONMENT.includes("prod");
export const IS_LOCAL = ENVIRONMENT.includes("local");
export const IS_NOT_PROD = !IS_PROD;

export const API_URL = {
  local: `http://${LOCAL_HOST}:8080`,
  dev: "https://my-dev.app",
  prod: "https://my-pro.app",
}[ENVIRONMENT];

export type ButtonColor = "gray" | "blue" | "red" | "green";
