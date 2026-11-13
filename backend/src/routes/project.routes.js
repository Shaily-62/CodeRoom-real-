import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";

import {
  createProjectController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller.js";

const router = express.Router();

// All project routes require authentication
router.use(authenticateUser);

// Create a new project
router.post("/", createProjectController);

//get all projects
router.get("/", getAllProjectsController);

// Fetch a single project
router.get("/:projectId", getProjectByIdController);

//update a project
router.put("/:projectId", updateProjectController);

//delete a project
router.delete("/:projectId", deleteProjectController);

export default router;
