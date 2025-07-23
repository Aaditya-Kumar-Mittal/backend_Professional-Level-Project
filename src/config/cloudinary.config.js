import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration for cloudinary that gives us permission to upload the files
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // Just remove any file from local server first, to remove any malicious file that may be harmful

    fs.unlinkSync(localFilePath); // Removes the locally saved temporary file as the upload operation failed

    return null;
  }
};

export { uploadOnCloudinary };
