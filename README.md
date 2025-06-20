# 🚀 backend_Professional-Level-Project

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) ![bcrypt](https://img.shields.io/badge/bcrypt-FFCA28?style=for-the-badge&logo=security&logoColor=black) ![dotenv](https://img.shields.io/badge/dotenv-4895ef?style=for-the-badge) ![Multer](https://img.shields.io/badge/Multer-F7DF1E?style=for-the-badge&logo=multer&logoColor=black) ![Cookie-Parser](https://img.shields.io/badge/Cookie--Parser-ff9800?style=for-the-badge) ![CORS](https://img.shields.io/badge/CORS-00ACC1?style=for-the-badge) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black) ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=black)

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

### Production Grade Multer and Cloudinary Setup

This section explains how to handle file uploads in a **production-grade** Node.js application using **Multer** for local storage and **Cloudinary** for cloud storage. The system first stores the uploaded file temporarily on the server and then uploads it to Cloudinary. This approach offers better fault tolerance, allowing for retries in case of upload errors.

#### 🗂️ Project Flow

1. User uploads a file via a client (form or API call).
2. Multer stores the file temporarily in a specified local folder.
3. The server uploads the file from local storage to Cloudinary.
4. On success, the Cloudinary URL is saved in the database (optional).
5. The local file can be optionally deleted after successful upload.

#### ⚙️ Setup Multer with `diskStorage`

```js
const multer = require("multer");
const path = require("path");

// Configure local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Preserve original extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });
```

> ✅ **Note:** Multer does not create directories when using a custom `destination` function. Ensure the `uploads/` folder exists beforehand.

#### ☁️ Upload to Cloudinary

```js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Upload from local storage to cloudinary
const uploadToCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "your-folder-name",
    });

    // Optional: delete local file after successful upload
    fs.unlinkSync(localFilePath);
    return result;
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};
```

#### 🧪 Express Route Example

```js
const express = require("express");
const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const localPath = req.file.path;
    const cloudinaryResponse = await uploadToCloudinary(localPath);
    res.status(200).json({
      message: "File uploaded successfully",
      cloudinaryUrl: cloudinaryResponse.secure_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

#### 🛡️ Why This Approach is Production-Grade?

- **Redundancy:** Local backup enables retry on failed cloud uploads.
- **Traceability:** Files are stored with unique names and extensions.
- **Security:** Files are not stored permanently on the server.
- **Scalability:** Upload logic is modular and reusable.

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

## Standardization and HTTP Headers

This section provides a comprehensive overview of web standards around HTTP, including the purpose of headers, common types, security practices, CORS configuration, HTTP methods with examples, and standard response codes.

### 🔗 URL, URI, and URN — What's the Difference?

| Term    | Full Form                   | Description                                                | Example                                      |
| ------- | --------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| **URL** | Uniform Resource Locator    | Specifies the **location** of a resource                   | `https://example.com/index.html`             |
| **URI** | Uniform Resource Identifier | Identifies a resource either by name or location (or both) | `https://example.com`, `urn:isbn:0451450523` |
| **URN** | Uniform Resource Name       | Names the resource **without** indicating its location     | `urn:isbn:0451450523`                        |

### 🧾 HTTP Headers Metadata

Headers are key-value pairs sent with HTTP requests/responses. They provide metadata to help the client or server understand how to process the data.

They are used for:

- 🔐 Authentication
- ⚙️ Managing state
- 🧠 Caching
- 🧩 Content Negotiation

#### 📦 Deprecated `X-` Prefix

Before 2012, custom headers often started with `X-` (e.g. `X-Custom-Token`). Since then, the standard has deprecated the use of `X-` prefixes in favor of meaningful names.

**Example:**

```http
X-Powered-By: Express  // ❌ Deprecated pattern
Server: Express         // ✅ Modern pattern
```

### 🔀 Types of HTTP Headers

- **Request Headers**: Sent by the client (browser or Postman).
- **Response Headers**: Sent by the server (Express, Django, etc.).
- **Representation Headers**: Describe the encoding or compression.
- **Payload Headers**: Describe the body data being transferred.

### 🧰 Most Common HTTP Headers

| Header          | Description                                                                             |
| --------------- | --------------------------------------------------------------------------------------- |
| `Accept`        | Tells the server what content types the client can process. Example: `application/json` |
| `User-Agent`    | Identifies the application making the request (e.g., Chrome, Postman)                   |
| `Authorization` | Carries credentials for authentication (e.g., Bearer Token)                             |
| `Content-Type`  | Describes the format of the request/response body                                       |
| `Cookie`        | Contains stored session or preference information                                       |
| `Cache-Control` | Controls how caching is handled by the browser or proxy                                 |

### 🌐 CORS: Cross-Origin Resource Sharing

Cross-Origin Resource Sharing allows restricted resources on a web page to be requested from another domain.

| Header                             | Purpose                                      |
| ---------------------------------- | -------------------------------------------- |
| `Access-Control-Allow-Origin`      | Specifies the origin(s) allowed              |
| `Access-Control-Allow-Credentials` | Allows sending of cookies and auth headers   |
| `Access-Control-Allow-Methods`     | Lists allowed HTTP methods (e.g., GET, POST) |

### 🛡️ Security Headers

| Header                         | Purpose                                             |
| ------------------------------ | --------------------------------------------------- |
| `Cross-Origin-Embedder-Policy` | Prevents unauthorized resources from being embedded |
| `Cross-Origin-Opener-Policy`   | Isolates browsing context for improved security     |
| `Content-Security-Policy`      | Prevents XSS attacks by restricting sources         |
| `X-XSS-Protection`             | Activates browser’s XSS protection mechanisms       |

### ⚙️ HTTP Methods with Real-Life Examples

| Method    | Description                | Example                                       |
| --------- | -------------------------- | --------------------------------------------- |
| `GET`     | Retrieve a resource        | `GET /users` — Fetch all users                |
| `HEAD`    | Fetch only headers         | `HEAD /users` — Get metadata only             |
| `OPTIONS` | Discover supported methods | `OPTIONS /users` — Returns: GET, POST         |
| `TRACE`   | Debug, echoes back request | Rarely used in modern APIs                    |
| `DELETE`  | Remove a resource          | `DELETE /users/123` — Delete user with ID 123 |
| `PUT`     | Replace a resource         | `PUT /users/123` with full user object        |
| `POST`    | Create a new resource      | `POST /users` with user data                  |
| `PATCH`   | Modify part of a resource  | `PATCH /users/123` with name update           |

**Example (Express.js POST endpoint):**

```js
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  // Save to DB
  res.status(201).json({ message: "User created" });
});
```

### 📊 HTTP Response Status Codes

Status codes indicate the result of an HTTP request. They are grouped into five categories:

| Class | Description                                     |
| ----- | ----------------------------------------------- |
| `1xx` | Informational (e.g., 100 Continue)              |
| `2xx` | Success (e.g., 200 OK, 201 Created)             |
| `3xx` | Redirection (e.g., 307 Temporary Redirect)      |
| `4xx` | Client Errors (e.g., 404 Not Found)             |
| `5xx` | Server Errors (e.g., 500 Internal Server Error) |

#### ✅ Common Status Codes

| Code  | Meaning               |
| ----- | --------------------- |
| `100` | Continue              |
| `102` | Processing            |
| `200` | OK                    |
| `201` | Created               |
| `202` | Accepted              |
| `307` | Temporary Redirect    |
| `308` | Permanent Redirect    |
| `400` | Bad Request           |
| `401` | Unauthorized          |
| `402` | Payment Required      |
| `404` | Not Found             |
| `500` | Internal Server Error |
| `504` | Gateway Timeout       |

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
- [Multer Docs](https://github.com/expressjs/multer)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---
