import { ZodError } from "zod";
import { CustomError } from "./custom-error.js";

export class RequestValidationError extends CustomError {
  statusCode = 422;

  constructor(public errors: ZodError["issues"]) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      const parsedField = error.path[0]?.toString();

      if (parsedField) {
        return { message: error.message, field: parsedField };
      }

      return { message: error.message };
    });
  }
}
