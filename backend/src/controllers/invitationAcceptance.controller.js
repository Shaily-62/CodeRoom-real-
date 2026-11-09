import { acceptInvitation } from "../services/invitationAcceptance.service.js";

export const acceptProjectInvitation = async (req, res, next) => {
  try {
    const { token } = req.body;

    const result = await acceptInvitation({
      db: req.supabase,
      token,
    });

    return res.status(200).json({
      success: true,
      message: "You have successfully joined the project!",
      data: {
        project_id: result.project_id,
        role: result.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Receives the invitation token from the request body.

// Uses the authenticated user's Supabase client.

// Calls the acceptance service.

// Returns the project ID and assigned role.