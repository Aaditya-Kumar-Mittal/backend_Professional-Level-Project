import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../public/temp");

// Configuration for cloudinary that gives us permission to upload the files
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteLocalFileSafely = (filePath) => {
  // console.log(filePath);

  // console.log(uploadDir);

  const resolvedPath = path.resolve(uploadDir, path.basename(filePath));

  console.log("Deleting local file:", resolvedPath);

  if (resolvedPath.startsWith(uploadDir)) {
    fs.unlinkSync(resolvedPath);
  } else {
    throw new Error("Invalid file path – potential path traversal attack");
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    //Check: If file path exists of not
    if (!localFilePath) return null;

    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been successfully uploaded
    // console.log("File is uploaded on cloudinary!", response.url);
    // console.log(response);

    // Removes the file even on successfully upload
    // Delete the local file from the server synchronously (i.e., wait until it is removed)
    // console.log(localFilePath);
    
    deleteLocalFileSafely(localFilePath);

    return response;
  } catch (error) {
    // Just remove any file from local server first, to remove any malicious file that may be harmful

    deleteLocalFileSafely(localFilePath); // Removes the locally saved temporary file as the upload operation failed

    return null;
  }
};

export { uploadOnCloudinary };
