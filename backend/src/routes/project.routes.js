import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";

import {
  createProjectController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller.js";

import {
  getTeamMembers,
  updateMemberRole,
  removeTeamMember,
} from "../controllers/team.controller.js";

import {
  sendInvitation,
  getPendingInvitations,
  revokeInvitation,
} from "../controllers/invitation.controller.js";

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

router.post("/:projectId/invitations", authenticateUser, sendInvitation);

// Get pending project invitations
router.get("/:projectId/invitations", authenticateUser, getPendingInvitations);

// Revoke a pending project invitation
router.delete(
  "/:projectId/invitations/:invitationId",
  authenticateUser,
  revokeInvitation,
);

/**
 * team's apis
 */

// Get team members of a project
router.get("/:projectId/members", authenticateUser, getTeamMembers);

// Update a project member's role
router.patch(
  "/:projectId/members/:memberId/role",
  authenticateUser,
  updateMemberRole,
);

// Remove a project member
router.delete(
  "/:projectId/members/:memberId",
  authenticateUser,
  removeTeamMember,
);

export default router;
