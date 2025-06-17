import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Configuring middleware when we will get JSON Data
app.use(
  express.json({
    limit: "16kb", // This can be adjusted based on your needs. This limits the size of the JSON body to 16KB.
  })
);

// Configuration for receiving data from URL

app.use(
  // .urlencoded() is used to parse incoming requests with URL-encoded payloads
  express.urlencoded({
    limit: "16kb", // This can be adjusted based on your needs. This limits the size of the URL-encoded body to 16KB.
    extended: true, // Allows for rich objects and arrays to be encoded into the URL-encoded format
  })
);

// Middleware for storing static files
app.use(express.static("public"));

// Middleware for parsing cookies
app.use(cookieParser());

export { app };
