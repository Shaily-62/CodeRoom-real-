import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";

import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// signup: POST /api/auth/signup
router.post("/signup", signup);

// Login: POST  /api/auth/login
router.post("/login", login);

// Protected route
router.post("/logout", authenticateUser, logout);
router.get("/me", authenticateUser, getMe);

export default router;
