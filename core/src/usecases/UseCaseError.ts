import { ValidationError } from "core/models/Form"

export enum UseCaseErrorType {
  ItemNotFound,
  Unauthorized,
  InvalidRequest,
  CommunicationError,
  Unknown,
}

export default class UseCaseError {
  message: string
  type: UseCaseErrorType
  validationErrors: ValidationError[]

  constructor(type: UseCaseErrorType | number, message: string, validationErrors?: ValidationError[]) {
    this.type = typeof type === "number" ? getUseCaseErrorType(type) : type
    this.message = message
    this.validationErrors = validationErrors || []
  }
}

function getUseCaseErrorType(status: number) {
  switch (status) {
    case 403:
      return UseCaseErrorType.Unauthorized
    case 401:
      return UseCaseErrorType.Unauthorized
    case 404:
      return UseCaseErrorType.ItemNotFound
    case 400:
      return UseCaseErrorType.InvalidRequest
    default:
      return UseCaseErrorType.Unknown
  }
}
