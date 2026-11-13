import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  getFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
} from "../controllers/file.controller.js";

const router = express.Router();

// All file routes require authentication
router.use(authenticateUser);

// Project file management
router.get("/:projectId/files", getFiles);
router.post("/:projectId/files", createFile);
router.get("/:projectId/files/:fileId", getFile);
router.patch("/:projectId/files/:fileId", updateFile);
router.delete("/:projectId/files/:fileId", deleteFile);

export default router;
