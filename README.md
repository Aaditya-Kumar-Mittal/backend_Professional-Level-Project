# 🚀 backend_Professional-Level-Project

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) ![bcrypt](https://img.shields.io/badge/bcrypt-FFCA28?style=for-the-badge&logo=security&logoColor=black) ![dotenv](https://img.shields.io/badge/dotenv-4895ef?style=for-the-badge)![Multer](https://img.shields.io/badge/Multer-F7DF1E?style=for-the-badge&logo=multer&logoColor=black) ![Cookie-Parser](https://img.shields.io/badge/Cookie--Parser-ff9800?style=for-the-badge) ![CORS](https://img.shields.io/badge/CORS-00ACC1?style=for-the-badge) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black) ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=black)

---

## 📁 Folder Structure

```bash
src/
│
├── config/              # Configuration files (DB, Cloudinary, etc.)
├── constants.js         # App constants
├── controllers/         # Route controllers
├── middleware/          # Custom middlewares
├── models/              # Mongoose models
├── routes/              # Express routes
├── utils/               # Utility functions
├── database/            # DB connection logic
├── constants.js        # App constants
├── app.js               # Express app
└── index.js             # Entry point

```

> **Note:** Empty folders are tracked using `.gitkeep` files. These ensure structure is preserved in Git.

---

## 📦 Installation & Setup

```bash
git clone https://github.com/your-username/backend_Professional-Level-Project.git
cd backend_Professional-Level-Project
npm install
cp .env.example .env
```

---

## ⚙️ Scripts

```json
"scripts": {
  "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
}
```

Use the development script to run the server with environment variables auto-loaded.

---

## 🔐 Environment Variables

Environment-specific secrets and configurations are placed inside a `.env` file.

```env
MONGODB_URI=your_mongodb_uri
PORT=8000
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_token
REFRESH_TOKEN_SECRET=your_refresh_token
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> You can generate strong JWT secrets using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

Sure! Here's a professional and segmented `README.md` with `###`-level sections for all the concepts and tools you've listed. This is ideal for a production-grade Express.js backend and designed to serve as high-quality documentation in your repository.

---

## ✅ What is `asyncHandler`?

In Express.js, asynchronous route handlers that throw errors (e.g., failed DB operations) don’t automatically trigger the error-handling middleware. That’s where `asyncHandler` comes in.

It is a **higher-order function** (a function that returns another function) that helps:

- Automatically catch errors from async functions.
- Forward them to the default Express error handler via `next(error)`.
- Avoid repetitive `try...catch` blocks in each route or controller.

---

## 🧠 Breakdown of the Original Code

```js
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      error: error,
    });
    next(error);
  }
};
```

> ⚠️ Fix: Change `err.code` to `error.code`.

---

## ✅ Improved `asyncHandler` with Comments

```js
/**
 * Wraps an async route/controller function and forwards any errors to Express error handler
 * Avoids boilerplate try-catch blocks across the app.
 */
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("Error caught in asyncHandler:", error);

      res.status(error.code || 500).json({
        success: false,
        message: error.message || "Something went wrong",
        error: process.env.NODE_ENV === "development" ? error : {},
      });

      next(error);
    }
  };
};

export { asyncHandler };
```

---

## 🔄 Centralized Error Handling with Custom Error Class

```js
// utils/ErrorHandler.js

class ErrorHandler extends Error {
  constructor(message, code) {
    super(message);
    this.code = code; // Maintains proper stack trace

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
```

Use in routes like:

```js
throw new ErrorHandler("User not found", 404);
```

---

## 🧠 JSON Web Tokens (JWT)

JWT (JSON Web Token) is a **stateless authentication** mechanism consisting of:

- Header (Algorithm & Type)
- Payload (user data)
- Signature (secured with secret)

🔑 Secret Key Generator:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set it in `.env`:

```env
ACCESS_TOKEN_SECRET=your_generated_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

📝 Tokens are Bearer tokens — the one who _bears_ it has access to resources.

---

## ♻️ Access & Refresh Tokens

### 🔸 Access Token

- Short-lived (e.g., 15 min)
- Used in API headers to authenticate users

### 🔸 Refresh Token

- Long-lived (e.g., 7 days)
- Used to issue new access tokens
- Stored securely (HTTP-only cookies recommended)

```env
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
```

---

## ☁️ File Upload in Production

### ❗ Avoid Local File Storage in Production

Use cloud storage services like:

- AWS S3
- Cloudinary
- Google Cloud Storage
- Azure Blob Storage

### 🛠 Popular Libraries

- `multer` → Used to parse `multipart/form-data` for file uploads
- `cloudinary` → Used for image/file hosting and transformation

Example Cloudinary Config:

```js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

---

## 📦 mongoose-aggregate-paginate-v2

A pagination plugin for Mongoose aggregation pipelines.

### 🔧 Setup

```js
import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const MySchema = new mongoose.Schema({
  name: String,
  age: Number,
});

MySchema.plugin(aggregatePaginate);
export default mongoose.model("User", MySchema);
```

### 🔁 Usage (Promise)

```js
const options = { page: 1, limit: 10 };
const aggregate = User.aggregate();

User.aggregatePaginate(aggregate, options)
  .then((results) => console.log(results))
  .catch((err) => console.error(err));
```

### 🧠 Usage (Callback)

```js
User.aggregatePaginate(aggregate, options, (err, results) => {
  if (err) return console.error(err);
  console.log(results);
});
```

---

## 🧰 Developer Utilities

### ⚙️ Prettier Setup

Install:

```bash
npm i -D prettier
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### ⚙️ Nodemon Script

```json
"scripts": {
  "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
}
```

---

## ✨ Features & Best Practices

- ✅ **Organized codebase** inside `src` folder.
- ✅ **MongoDB** connected via **Mongoose** with proper async-await & try-catch for DB security.
- ✅ Uses **dotenv** for environment configuration.
- ✅ Integrates **JWT** for secure auth (access & refresh tokens).
- ✅ Image/file handling using **Multer** and **Cloudinary**.
- ✅ **CORS** enabled for secure cross-origin access:

  ```js
  app.use(cors({ origin: process.env.CORS_ORIGIN }));
  ```

- ✅ Limits large incoming JSON:

  ```js
  app.use(express.json({ limit: "16kb" }));
  ```

- ✅ Cookie support via:

  ```js
  import cookieParser from "cookie-parser";
  app.use(cookieParser());
  ```

- ✅ Uses **Prettier** for consistent formatting:

  - Install: `npm i -D prettier`
  - Create `.prettierrc`:

    ```json
    {
      "semi": true,
      "singleQuote": true,
      "tabWidth": 2,
      "trailingComma": "es5"
    }
    ```

- ✅ Follows production security: DB access IP-limited in **MongoDB Atlas**.
- - ✅ Keep `.env` secure and gitignored
- ✅ Use `.gitkeep` to track empty folders
- ✅ Modularize code into `src` with subfolders
- ✅ Use `cors` for restricted API access
- ✅ Apply size limits to incoming requests:

  ```js
  app.use(express.json({ limit: "16kb" }));
  ```

- ✅ Store access & refresh token expiry values in `.env`
- ✅ Restrict MongoDB Atlas access to IP ranges (never `0.0.0.0/0` in production)
- ✅ Always catch async DB errors in routes or use `asyncHandler`

---

## ⚠️ Notes for Production

- ❌ Never push `.env` or secrets — use `.gitignore` to exclude them.
- ✅ In MongoDB Atlas, restrict access to your server IP only.
- ✅ Place all DB connections in `try-catch` blocks to avoid crashes.
- ✅ Serve secure headers with packages like `helmet`.

---

## 📘 What's Next?

To take your backend development to the next level:

- 🏗 **System Design**
- 🗄️ **Database Design**
- 🚀 **Code Optimization**
- 🧩 **Debugging & Profiling**

---

## 📚 Resources

- [JWT Official Docs](https://jwt.io)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Mongoose Docs](https://mongoosejs.com/)
- [Express Docs](https://expressjs.com/)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---
