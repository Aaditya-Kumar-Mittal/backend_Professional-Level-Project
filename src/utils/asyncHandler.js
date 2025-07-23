// const asyncHandler = () => {};
// const asyncHandler = (func) => () => {};

/**
 * asyncHandler - A utility to catch errors in async Express route handlers.
 *
 * This eliminates repetitive try-catch blocks and cleanly forwards errors to
 * Express's centralized error handler.
 *
 * @param {Function} requestHandler - The async route/controller function
 * @returns {Function} - A wrapped Express middleware with error forwarding
 */
const asyncHandler = (requestHandler) => {

  // Since this is a higher-order function, it returns a function
  return (req, res, next) => {
    // Wrap the async function call in Promise.resolve to catch any thrown error
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      // Forward the error to Express error-handling middleware
      next(error);
    });
  };
};

/**
 * asyncHandler is a utility function that wraps an asynchronous route handler
 * to catch any errors and forward them to the Express error handler.
 *
 * This avoids repetitive try-catch blocks in every route.
 *
 * @param {Function} fn - The async route handler to wrap
 * @returns {Function} - A new Express middleware function
 */

/*
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    // Attempt to run the async route handler
    await fn(req, res, next);
  } catch (error) {
    // Log the error for debugging (optional)
    console.error("Async error caught:", error);

    // Send a JSON error response to the client
    res.status(error.code || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });

    // Forward the error to the next middleware (Express error handler)
    next(error);
  }
};
*/

export { asyncHandler };

// This utility function act as a wrapper function for handling asynchronous operations in Express.js.
// A common pattern used in production applications to avoid repetitive try-catch blocks in route handlers.
// This utility function is used to handle asynchronous errors in Express.js routes.
// It takes a function `fn` as an argument and returns a new function that wraps the original function.
