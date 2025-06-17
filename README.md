# backend_Professional-Level-Project

Shields for Express Nodejs Cookie-parser mongoose mongodb cors nodemon

- Folders are not pushed to Github so we make .gitkeep files to push and keep track of empty folders
- Create a .env file to store the environment variables. You can use online gitignore generators for that.
- More organized codes in src folder
- Dev dependencies are not pushed to Github and are used only for development during production
- All the dependencies are listed in package.json
- Must add Prettier to format the code, as in professional grade settings, there may be a lot of conflicts, To achieve so, we use prettier-config-standard.
  - npm i -D prettier
  - Configuring .prettierrc file
- During production mode, we never allow access from anywhere during Mongodb Atlas Setup in Network Access
- Always keep the code for database access in try-catch block. This is for security reasons.
- Database is always in another continent. Async and await is must.
- As early as possible in your application, import and configure dotenv.
- "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  import dotenv from "dotenv";
  import mongoose from "mongoose";
  import { DB_NAME } from "./constants.js";
  import connectDatabase from "./database/db.js";

dotenv.config({ path: "./env" });

- CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
  - var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }

app.use(
express.json({
limit: "16kb", // This can be adjusted based on your needs. This limits the size of the JSON body to 16KB.
})
);

### ✅ **What is `asyncHandler`?**

In Express.js, **asynchronous route handlers** that throw errors (e.g., due to a failed DB operation or API call) don’t automatically trigger the error-handling middleware unless you use `try...catch`.

`asyncHandler` is a **higher-order function** (function that returns another function) used to automatically catch errors from `async/await` functions and pass them to Express's error handler without repeating `try...catch` everywhere.

---

### 🧠 **Step-by-Step Breakdown of the Original Code**

```js
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(err.code || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      error: error,
    });
    next(error);
  }
};
```

#### 🔍 Step-by-Step:

1. **`const asyncHandler = (fn) => ...`**

   - A function `asyncHandler` that takes another function `fn` as a parameter. `fn` is usually an **asynchronous route handler** like `async (req, res) => { ... }`.

2. **`async (req, res, next) => { ... }`**

   - Returns a new **middleware function** with Express parameters `req`, `res`, and `next`.
   - This returned function is **async**, so it can use `await`.

3. **Inside the `try` block:**

   - `await fn(req, res, next);` executes the passed-in async function.

4. **Inside the `catch` block:**

   - If `fn` throws an error, it gets caught here.
   - `res.status(...).json(...)` sends an error response.
   - `next(error)` forwards the error to Express's default error handler.

5. ⚠️ **Bug in original code:**

   - Uses `err.code` which is undefined — should be `error.code`.

---

### ✅ **Improved Code with Comments**

```js
/**
 * asyncHandler is a utility function that wraps an asynchronous route handler
 * to catch any errors and forward them to the Express error handler.
 *
 * This avoids repetitive try-catch blocks in every route.
 *
 * @param {Function} fn - The async route handler to wrap
 * @returns {Function} - A new Express middleware function
 */
const asyncHandler = (fn) => {
  // Return a new middleware function that Express can use
  return async (req, res, next) => {
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
        error: process.env.NODE_ENV === "development" ? error : {}, // Avoid leaking stack trace in prod
      });

      // Forward the error to the next middleware (Express error handler)
      next(error);
    }
  };
};

export { asyncHandler };
```

---

### ✅ **How to Use It in Express Routes**

```js
import express from "express";
import { asyncHandler } from "./utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    // Simulating async operation
    const users = await getUsersFromDatabase();
    res.json({ success: true, data: users });
  })
);
```

---

### ✅ **Benefits**

- ✅ Clean and DRY code — no more `try/catch` in every route
- ✅ Centralized error handling
- ✅ Works with any async route, middleware, or controller

---

- Centralize the error handling and ap response
- Error class has constructor with code and message
