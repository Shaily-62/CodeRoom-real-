import {
  generateInvitationToken,
  hashInvitationToken,
} from "../utils/invitationToken.js";

// Create a project invitation
export const createInvitation = async ({
  db,
  user,
  projectId,
  invitedEmail,
  role,
}) => {
  // 1. Verify project ownership
  const { data: project, error } = await db
    .from("projects")
    .select("id, owner_id, name")
    .eq("id", projectId)
    .single();

  if (error || !project) {
    throw Object.assign(new Error("Project not found"), { statusCode: 404 });
  }

  if (project.owner_id !== user.id) {
    throw Object.assign(
      new Error("Only the project owner can invite members"),
      { statusCode: 403 },
    );
  }

  // 2. Prevent inviting yourself
  if (user.email?.toLowerCase() === invitedEmail.toLowerCase()) {
    throw Object.assign(new Error("You cannot invite yourself"), {
      statusCode: 400,
    });
  }

  // 3. Check for an existing pending invitation
  const { data: existingInvitation, error: invitationError } = await db
    .from("project_invitations")
    .select("id, status")
    .eq("project_id", projectId)
    .eq("invited_email", invitedEmail)
    .eq("status", "pending")
    .maybeSingle();

  if (invitationError) {
    throw Object.assign(new Error("Unable to check existing invitations"), {
      statusCode: 500,
    });
  }

  if (existingInvitation) {
    throw Object.assign(
      new Error("A pending invitation already exists for this email"),
      { statusCode: 409 },
    );
  }

  // 4. Check the free plan member limit
  const { count: memberCount, error: memberCountError } = await db
    .from("project_members")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  if (memberCountError) {
    throw Object.assign(new Error("Unable to check project member count"), {
      statusCode: 500,
    });
  }

  // Owner + existing members
  const totalMembers = 1 + (memberCount || 0);

  if (totalMembers >= 4) {
    throw Object.assign(
      new Error("Free plan supports a maximum of 4 members per project"),
      { statusCode: 403 },
    );
  }

  // 5. Generate a secure invitation token
  const invitationToken = generateInvitationToken();

  // Store only the hash in the database
  const tokenHash = hashInvitationToken(invitationToken);

  // 6. Save invitation in Supabase
  const { data: invitation, error: createError } = await db
    .from("project_invitations")
    .insert({
      project_id: projectId,
      invited_email: invitedEmail.toLowerCase(),
      role,
      invited_by: user.id,
      token_hash: tokenHash,
    })
    .select(
      "id, project_id, invited_email, role, status, expires_at, created_at",
    )
    .single();

  if (createError) {
    throw Object.assign(new Error("Failed to create project invitation"), {
      statusCode: 500,
    });
  }

  // 7. Return invitation and original token internally
  // The controller will use the token for email delivery.
  return {
    invitation,
    invitationToken,
    projectName: project.name,
  };
};

// Get pending invitations for a project
export const getProjectInvitations = async ({ db, projectId }) => {
  const { data, error } = await db
    .from("project_invitations")
    .select(
      "id, project_id, invited_email, role, status, expires_at, created_at",
    )
    .eq("project_id", projectId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw Object.assign(new Error("Unable to fetch project invitations"), {
      statusCode: 500,
    });
  }

  return data;
};

// Revoke a pending project invitation
export const revokeProjectInvitation = async ({
  db,
  user,
  projectId,
  invitationId,
}) => {
  // 1. Verify project ownership
  const { data: project, error: projectError } = await db
    .from("projects")
    .select("id, owner_id")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError || !project) {
    throw Object.assign(new Error("Project not found"), { statusCode: 404 });
  }

  if (project.owner_id !== user.id) {
    throw Object.assign(
      new Error("Only the project owner can revoke invitations"),
      { statusCode: 403 },
    );
  }

  // 2. Revoke the pending invitation
  const { data: invitation, error: revokeError } = await db
    .from("project_invitations")
    .update({ status: "revoked" })
    .eq("id", invitationId)
    .eq("project_id", projectId)
    .eq("status", "pending")
    .select("id, project_id, invited_email, role, status")
    .maybeSingle();

  if (revokeError) {
    throw Object.assign(new Error("Unable to revoke invitation"), {
      statusCode: 500,
    });
  }

  if (!invitation) {
    throw Object.assign(new Error("Pending invitation not found"), {
      statusCode: 404,
    });
  }

  return invitation;
};

// Only pending invitations can be revoked. Accepted, expired, or previously revoked invitations cannot be changed through this operation.