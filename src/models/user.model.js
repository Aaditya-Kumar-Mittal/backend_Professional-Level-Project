import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Using mongoose hooks, we use these plugins

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // For optimized search in MongoDB, set the index filed to true for that particular field
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    fullname: {
      type: String,
      required: true,
      index: true,
    },
    avatar: {
      type: String, // URL to the avatar image
      required: true,
    },
    coverImage: {
      type: String, // URL to the avatar image
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  // Avoid usuing arrow function here to maintain the context of 'this'
  // Whenver we are saving, take the password field encrypt it and save it

  if (!this.isModified("password")) return next();
  // Hash password only if password field is modified, to avoid hashing it again and again on every save
  this.password = bcrypt.hash(this.password, 10);
  next();
});

// Defining custom methods to check password
UserSchema.methods.isPasswordCorrect = async function (password) {
  // Compare the password with the hashed password
  return await bcrypt.compare(password, this.password);
};

// Method to generate Access Token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
  );
};

// Method to generate Refresh Token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      // refresh token has less information than access token and has more time to live
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    }
  );
};

export const User = mongoose.model("User", UserSchema);
