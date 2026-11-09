import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  acceptProjectInvitation,
} from "../controllers/invitationAcceptance.controller.js";

const router = express.Router();

// Accept a project invitation
router.post(
  "/accept",
  authenticateUser,
  acceptProjectInvitation
);

export default router;
