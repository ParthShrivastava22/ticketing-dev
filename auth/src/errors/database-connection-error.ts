import { CustomError } from "./custom-error.js";

export class DatabaseConnectionError extends CustomError {
  statusCode = 503;
  reason = "Error connecting to the database";

  constructor() {
    super("Error connecting to Database");

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
