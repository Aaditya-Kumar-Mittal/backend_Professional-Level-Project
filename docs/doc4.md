# 🧭 **File Upload Flow (Your Code)**

---

## ✅ 1. **Frontend Sends FormData**

- A user submits a form with text fields (`username`, `email`, etc.) and files (`avatar`, `coverImage`) as a `multipart/form-data` HTTP `POST` request to `/register`.

---

## ✅ 2. **Multer Middleware Handles File Upload**

### Route

```js
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
```

### Behind the scenes

- The `upload` middleware is triggered **before** `registerUser`.
- `multer.diskStorage()` is configured to store files in:

```js
../../public/temp
```

- It generates **unique file names** using `Date.now()` and `Math.random()`.
- These files are saved **physically to the server** (in your project’s temp folder).
- Uploaded files are now accessible via:

```js
req.files.avatar[0].path;
req.files.coverImage[0].path;
```

---

## ✅ 3. **Controller `registerUser()` Begins Execution**

- Validates required fields from `req.body`.
- Checks if user already exists in DB.
- If any required field or user check fails, error is thrown before file uploads to Cloudinary even begin.

---

## ✅ 4. **Local File Path Retrieved**

```js
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;
```

- These paths are local paths to files temporarily saved by multer on the server.

---

## ✅ 5. **Cloudinary Upload Triggered**

```js
const cloudinaryAvatarResponse = await uploadOnCloudinary(avatarLocalPath);
const cloudinaryCoverImageResponse =
  await uploadOnCloudinary(coverImageLocalPath);
```

### Inside `uploadOnCloudinary()`

```js
const response = await cloudinary.uploader.upload(localFilePath, {
  resource_type: "auto",
});
```

- Cloudinary **uploads the file** (image, video, etc.).
- If successful:

  ```js
  fs.unlinkSync(localFilePath); // Local file deleted after upload
  ```

- If upload fails:

  ```js
  fs.unlinkSync(localFilePath); // Clean-up even on failure
  ```

> 📌 **This ensures your server never stores any image permanently** — it's either on Cloudinary or deleted.

---

## ✅ 6. **User Created in Database**

- Cloudinary returns an object like:

```json
{
  url: "https://res.cloudinary.com/...",
  public_id: "user_avatar_123",
  ...
}
```

- This URL is saved in the MongoDB user document.

---

## ✅ 7. **Response Sent to Client**

- You remove sensitive fields:

```js
.select("-password -refreshToken")
```

- And finally respond with:

```js
res
  .status(201)
  .json(new ApiResponse(200, createdUser, "User created successfully!"));
```

---

## 🗑️ What Happens to the File After Upload?

| Phase              | File Location      | Action                                  |
| ------------------ | ------------------ | --------------------------------------- |
| After Multer saves | `/public/temp/...` | Temporary save                          |
| After Cloudinary   | Cloud              | Deleted locally using `fs.unlinkSync()` |
| On failure         | —                  | Still deleted locally                   |

---

## 🔁 How to Trace Duplicate Uploads?

If you’re seeing **multiple Cloudinary uploads**, it could be due to:

- Multiple hits to `/register` route (client retry, reload, etc.)
- Same file being attached to both `avatar` and `coverImage`
- Duplicate middleware execution

To debug, add logs:

```js
console.log("Uploading avatar to cloudinary", avatarLocalPath);
console.log("Uploading cover image to cloudinary", coverImageLocalPath);
```

---
