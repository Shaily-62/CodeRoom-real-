import express from "express";

import { authenticateUser } from "../middleware/auth.middleware.js";

import {
  getTeamMembers,
  updateMemberRole,
  removeTeamMember,
} from "../controllers/team.controller.js";

const router = express.Router();

// All team routes require authentication.
router.use(authenticateUser);

// Get all members of a project.
router.get("/:projectId/members", getTeamMembers);

// Update a member's role.
router.patch("/:projectId/members/:memberId/role", updateMemberRole);

// Remove a member from a project.
router.delete("/:projectId/members/:memberId", removeTeamMember);

export default router;
