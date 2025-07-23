# Questions

## ✅ Part 1: `req.files.avatar[0].path`

### ❓What is `req.files`?

`req.files` is an object added by **Multer** (your file upload middleware) to the incoming `request` (`req`) when the content type is `multipart/form-data`.

In your case, you've configured Multer like this:

```js
upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
```

So Multer builds `req.files` as:

```js
{
  avatar: [ { ...fileDataForAvatar } ],
  coverImage: [ { ...fileDataForCoverImage } ]
}
```

Each of these is an array of file objects (because Multer allows `maxCount > 1`), even though you're only uploading 1 file for each.

### ❗So what does `req.files.avatar[0].path` mean?

👉 It's accessing the **path of the first (and only) uploaded file under the field `avatar`**, which Multer has stored temporarily on your **local file system**.

The file object looks like this (simplified):

```js
{
  fieldname: 'avatar',
  originalname: 'photo.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'public/temp/',
  filename: 'avatar-1721645390231-21973149',
  path: 'public/temp/avatar-1721645390231-21973149',
  size: 10245
}
```

So:

| Code                  | Meaning                                                  |
| --------------------- | -------------------------------------------------------- |
| `req.files.avatar[0]` | First file under the `avatar` field                      |
| `.path`               | Full local path where Multer temporarily stored the file |

Same applies to `req.files.coverImage[0].path`.

---

## ✅ Part 2: How Can We Delete a File From Local If It’s Already on Cloudinary?

### 🤔 Isn’t the File Already on Cloudinary?

Yes — but **here's the full picture**:

### 🔁 Upload Flow Recap

1. **Multer** stores the file **locally** first — this is the file on `req.files.avatar[0].path` (e.g., `public/temp/avatar-12345.jpg`)
2. You then pass this local file path to Cloudinary:

   ```js
   const response = await cloudinary.uploader.upload(localFilePath);
   ```

3. Cloudinary **reads** the file **from your server** (using the local path you passed), uploads it to their storage system, and returns a URL.
4. **After Cloudinary upload is complete**, your server still has the local copy.
5. So you run:

   ```js
   fs.unlinkSync(localFilePath);
   ```

   to **manually delete** that temporary local copy.

### 🧠 Why Is It Needed?

Because **Cloudinary doesn't remove the file from your server**, it just **reads it during upload**.

It’s your job to clean up local storage, or else:

- Server disk fills up over time
- Security risk (if sensitive images are stored)
- Wastes space unnecessarily

So:

> ✅ Cloudinary **uploads** from the **local file path**
> ❌ Cloudinary **does not delete** the local file
> ✅ You use `fs.unlinkSync(localFilePath)` to delete it manually

---

### 💡 Real-Life Analogy

Imagine you're uploading a PDF to Google Drive:

- You **choose a file** from your computer.
- Google **uploads it**, but your file **still stays on your computer**.
- You have to **manually delete** it if you want to clean up space.

Same principle here.

---

Let me know if you want a diagram or how you could automate file cleanup with `fs.promises` for async deletion!
