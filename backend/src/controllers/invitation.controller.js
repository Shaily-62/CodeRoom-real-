import {
  createInvitation,
  getProjectInvitations,
  revokeProjectInvitation,
} from "../services/invitation.service.js";

import { createInvitationSchema } from "../validators/invitation.validator.js";

import { sendProjectInvitationEmail } from "../services/email.service.js";

// Create invitation and send invitation email
export const sendInvitation = async (req, res, next) => {
  try {
    const validation = createInvitationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation details",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { invited_email, role } = validation.data;

    // 1. Create invitation in the database
    const result = await createInvitation({
      db: req.supabase,
      user: req.user,
      projectId: req.params.projectId,
      invitedEmail: invited_email,
      role,
    });

    // 2. Send invitation email
    try {
      await sendProjectInvitationEmail({
        recipientEmail: invited_email,
        inviterName: req.user.user_metadata?.full_name || req.user.email,
        projectName: result.projectName,
        role: result.invitation.role,
        invitationToken: result.invitationToken,
      });
    } catch (emailError) {
      console.error("RESEND EMAIL ERROR:", emailError);
      // Remove the pending invitation if email delivery fails
      await req.supabase
        .from("project_invitations")
        .delete()
        .eq("id", result.invitation.id)
        .eq("status", "pending");

      throw Object.assign(
        new Error(
          "Invitation was created, but the email could not be sent. Please try again.",
        ),
        { statusCode: 502 },
      );
    }

    // 3. Return success without exposing the token
    return res.status(201).json({
      success: true,
      message: "Invitation created and email sent successfully",
      data: result.invitation,
    });
  } catch (error) {
    next(error);
  }
};

// Get pending invitations for a project
export const getPendingInvitations = async (req, res, next) => {
  try {
    const invitations = await getProjectInvitations({
      db: req.supabase,
      projectId: req.params.projectId,
    });

    return res.status(200).json({
      success: true,
      message: "Project invitations fetched successfully",
      data: invitations,
    });
  } catch (error) {
    next(error);
  }
};

// Revoke a pending project invitation
export const revokeInvitation = async (req, res, next) => {
  try {
    const invitation = await revokeProjectInvitation({
      db: req.supabase,
      user: req.user,
      projectId: req.params.projectId,
      invitationId: req.params.invitationId,
    });

    return res.status(200).json({
      success: true,
      message: "Invitation revoked successfully",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};
