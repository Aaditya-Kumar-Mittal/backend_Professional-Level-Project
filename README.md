# backend_Professional-Level-Project

- Folders are not pushed to Github so we make .gitkeep files to push and keep track of empty folders
- Create a .env file to store the environment variables. You can use online gitignore generators for that.
- More organized codes in src folder
- Dev dependencies are not pushed to Github and are used only for development during production
- All the dependencies are listed in package.json
- Must add Prettier to format the code, as in professional grade settings, there may be a lot of conflicts, To achieve so, we use prettier-config-standard.
  - npm i -D prettier
  - Configuring .prettierrc file
- During production mode, we never allow access from anywhere during Mongodb Atlas Setup in Network Access
- Always keep the code for database access in try-catch block. This is for security reasons.
- Database is always in another continent. Async and await is must.
- As early as possible in your application, import and configure dotenv.
- "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  import dotenv from "dotenv";
  import mongoose from "mongoose";
  import { DB_NAME } from "./constants.js";
  import connectDatabase from "./database/db.js";

dotenv.config({ path: "./env" });
