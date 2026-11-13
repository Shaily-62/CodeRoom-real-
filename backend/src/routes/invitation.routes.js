import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";

import {
  sendInvitation,
  getPendingInvitations,
  revokeInvitation,
} from "../controllers/invitation.controller.js";

import { acceptProjectInvitation } from "../controllers/invitationAcceptance.controller.js";

const router = express.Router();

// All invitation routes require authentication.
router.use(authenticateUser);

// Send an invitation to a project.
router.post("/projects/:projectId/invitations", sendInvitation);

// Get pending project invitations.
router.get("/projects/:projectId/invitations", getPendingInvitations);

// Revoke a pending invitation.
router.delete(
  "/projects/:projectId/invitations/:invitationId",
  revokeInvitation,
);

// Accept an invitation.
router.post("/invitations/accept", acceptProjectInvitation);

export default router;
