// require("dotenv").config({ path: "./env" });

import { DB_NAME } from "./constants.js";
import { app } from "./app.js";
import connectDatabase from "./database/db.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./env" });

connectDatabase()
  .then(() => {
    // Listen to the Application
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });

    app.on("error", (error) => {
      console.error("❌ Error in Express app:", error);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

/*
import express from "express";

const app = express();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log("Connected to MongoDB");
        app.on("error", (error) => {
            console.error("Error in Express app:", error);
        });

        app.listen(process.env.PORT || 3000, () => {
            console.log(
                `Server is running on port ${process.env.PORT || 3000}`
            );
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
})();
*/
