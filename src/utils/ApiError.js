/**
 * ApiError - Custom error class for API errors.
 *
 * This class extends the built-in Error class to provide additional properties
 * for HTTP status codes and error messages, making it easier to handle API errors
 * in a consistent manner.
 */
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong, please try again",
    errors = [],
    stack = ""
  ) {
    // overriding the super constructor

    super(message);
    this.statusCode = statusCode; // HTTP status code for the error
    this.errors = errors; // Additional error details, if any
    this.data = null; // Placeholder for any additional data related to the error
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      // Capture the stack trace for debugging purposes
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
