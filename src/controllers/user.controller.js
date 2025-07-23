import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.config.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validations on those user details
  // check if user exists (username, email, id)
  // secure the password
  // check for images and other data
  // upload them to cloudinary -> obtain its url
  // check if successfully uploaded avatar
  // make user object and createion call for making entry in database
  // get response remove password and refresh token field form response
  // check for usrer creation


  // Extracted Data Points from the request body
  const { username, email, fullname, password } = req.body;

  // console.log(req.body);

  // console.log(username, email, fullname, password);

  // Did validations on those data points and handled errors

  if (
    [username, email, fullname, password].some((field) => {
      return field === null || field === undefined || field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  // Checks if user with the given username or email address exists or not
  // $or: MongoDB operator to match either the username or email.

  // Checked for existing user
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // console.log(existingUser);

  // If the user existed raised error else proceeded with next steps
  if (existingUser) {
    throw new ApiError(
      409,
      "User with the given username or email already exists!"
    );
  }

  // middleware adds new fields to the request (Modifying the request object)
  // console.log(req.files); If the frontend automatically retries failed requests, or if form submission happens more than once, the backend route gets hit multiple times.

  // console.log(req.files);

  // Extracted required avatar image from req.files uploaded using middleware
  const avatarLocalPath = req.files?.avatar[0]?.path;
  /*
    avatar: [
      {
        fieldname: 'avatar',
        originalname: 'ic_happy_filled.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'E:\\backend_Professional-Project\\public\\temp',
        filename: 'avatar-1753254151167-557726167',
        path: 'E:\\backend_Professional-Project\\public\\temp\\avatar-1753254151167-557726167',
        size: 1521
      }
    ]
  */

    // Was not mandatory, added checks, if given the cover image then proceed with it
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // Got TypeError: Cannot read properties of undefined (reading &#39;0&#39;) on not sending the cover images
  // This error occurs when coverImage is undefined, and you're trying to access index [0] directly
  // This is a javascript issue

  // Classical way to handle the error 
  /*
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
    */

  // console.log(avatarLocalPath);
  // console.log(coverImageLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!");
  }

  /*
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is required!");
  }
  */

  // Although I was using async handler, I used await here because cloudinary may take time to upload and hence I used async in my function
  // Waited to upload the image on cloudinary
  const cloudinaryAvatarResponse = await uploadOnCloudinary(avatarLocalPath);
  const cloudinaryCoverImageResponse =
    await uploadOnCloudinary(coverImageLocalPath); // If no cover image cloudinary returns us the empty string

  if (!cloudinaryAvatarResponse) {
    throw new ApiError(400, "Avatar upload failed!");
  }

  /*
  if (!cloudinaryCoverImageResponse) {
    throw new ApiError(400, "Cover Image upload failed!");
  }
    */

  // Created user for saving to database
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    avatar: cloudinaryAvatarResponse.url,
    coverImage: cloudinaryCoverImageResponse?.url || "",
    password,
  });

  // Checked for created user and removed password and username from it
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // See when posting the user, we are making sure that we donot post the password and refresh token
  if (!createdUser) {
    throw new ApiError(400, "User creation failed!");
  } else {
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User created successfully!"));
  }
});

export { registerUser };
