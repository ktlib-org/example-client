import { ValidationError } from "core/models/forms/form";

export default class ApiError {
  httpStatus: number;
  message: string;
  validationErrors: ValidationError[];
  isValidationError: boolean;

  constructor(httpStatus: number, message: string, validationErrors?: ValidationError[]) {
    this.httpStatus = httpStatus;
    this.message = message;
    this.validationErrors = validationErrors || [];
    this.isValidationError = !!validationErrors && validationErrors.length > 0;
  }
}
