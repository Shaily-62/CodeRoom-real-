import { hashInvitationToken } from "../utils/invitationToken.js";

export const acceptInvitation = async ({ db, token }) => {
  // 1. Validate token
  if (!token || typeof token !== "string") {
    throw Object.assign(new Error("Invalid invitation token"), {
      statusCode: 400,
    });
  }

  // 2. Hash the received token
  const tokenHash = hashInvitationToken(token);

  // 3. Call the secure PostgreSQL function
  const { data, error } = await db.rpc("accept_project_invitation", {
    p_token_hash: tokenHash,
  });

  if (error) {
    throw Object.assign(
      new Error(error.message || "Unable to accept invitation"),
      { statusCode: 400 },
    );
  }

  if (!data || data.length === 0) {
    throw Object.assign(new Error("Invitation acceptance failed"), {
      statusCode: 400,
    });
  }

  return data[0];
};


// The recipient submits the original invitation token.

// The backend hashes it using SHA-256.

// It calls our PostgreSQL function.

// The database verifies the invitation and adds the member.

// The service returns the project ID and assigned role.