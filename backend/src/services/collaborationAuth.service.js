import { supabase } from "../config/supabase.js";
import { createUserSupabaseClient } from "../config/supabaseUser.js";

export const authenticateCollaborationUser = async (
  accessToken,
  projectId,
  fileId,
) => {
  if (!accessToken) {
    throw new Error("Authentication token is required.");
  }

  if (!projectId || !fileId) {
    throw new Error("Invalid collaboration document name.");
  }

  // 1. Verify the Supabase access token.
  const { data: authData, error: authError } =
    await supabase.auth.getUser(accessToken);

  if (authError || !authData?.user) {
    throw new Error("Invalid or expired authentication token.");
  }

  const user = authData.user;

  // 2. Create a Supabase client using this user's access token.
  // This ensures database queries respect Row Level Security.
  const db = createUserSupabaseClient(accessToken);

  // 3. Verify that the project exists and the user can access it.
  const { data: project, error: projectError } = await db
    .from("projects")
    .select("id, owner_id")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError || !project) {
    throw new Error("Project not found or access denied.");
  }

  // 4. Determine the user's project role.
  let role = "owner";

  if (project.owner_id !== user.id) {
    const { data: membership, error: membershipError } = await db
      .from("project_members")
      .select("role")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError || !membership) {
      throw new Error("You are not a member of this project.");
    }

    role = membership.role;
  }

  // 5. Verify that the requested file belongs to this project.
  const { data: file, error: fileError } = await db
    .from("project_files")
    .select("id")
    .eq("id", fileId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (fileError || !file) {
    throw new Error("File not found or access denied.");
  }

  return {
    id: user.id,
    email: user.email,
    projectId,
    fileId,
    role,
    canEdit: role === "owner" || role === "editor",
  };
};

// Validates the Supabase login token.

// Checks project access using the user's own Supabase permissions.

// Identifies whether the user is an owner, editor or viewer.

// Verifies that the file actually belongs to the requested project.

// Returns canEdit so we can enforce viewer restrictions in the collaboration server.