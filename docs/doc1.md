// After middleware bring the routes!

import userRouter from "./routes/user.routes.js";

// Routes Declarations

// Standard Practice of Defining the Routes /api/version/prefix
app.use("/api/v1/users", userRouter);

router.route("/register").post(registerUser);
