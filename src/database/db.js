import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

const connectDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // Through this we will be aware to what host we are connected to!
    console.log(
      `\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(
      "MongoDB Connection FAILED!! Error in connectiong to the database:",
      error
    );
    process.exit(1);
  }
};

export default connectDatabase;
