import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, // cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // Obtained from the video file from cloudinary
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  { timestamps: true }
);

// Adding pagination plugin to the Video schema
VideoSchema.plugin(mongooseAggregatePaginate);

// This would allow us to write aggregate queries with pagination
// Example: Video.aggregatePaginate(query, options);

export const Video = mongoose.model("Video", VideoSchema);
