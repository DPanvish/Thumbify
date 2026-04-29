import express from "express";
import { loginUser, logoutUser, registerUser, verifyUser } from "../controllers/AuthController.js";
import protect from "../middlewares/AuthMiddleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);
AuthRouter.get("/logout", protect, logoutUser);
AuthRouter.get("/verify", protect, verifyUser);

export default AuthRouter;