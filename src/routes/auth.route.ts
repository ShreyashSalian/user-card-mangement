import express from "express";

import { loginUser, logout } from "../controllers/auth.controller";
import { verifyUser } from "../middlewares/auth.middleware";
import { loginValidation } from "../validations/login.validation";
import { validateAPI } from "../middlewares/validate.middleware";

const authRouter = express.Router();

authRouter.post("/login", loginValidation(), validateAPI, loginUser);
authRouter.get("/logout", verifyUser, logout);

export default authRouter;
