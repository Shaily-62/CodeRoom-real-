export const getProjectTeam = async ({ db, projectId }) => {
  const { data, error } = await db.rpc("get_project_team", {
    p_project_id: projectId,
  });

  if (error) {
    throw Object.assign(
      new Error(error.message || "Unable to fetch project team"),
      { statusCode: 500 },
    );
  }

  return data;
};

// Update a project member's role
export const updateProjectMemberRole = async ({
  db,
  user,
  projectId,
  memberId,
  role,
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
      new Error("Only the project owner can change member roles"),
      { statusCode: 403 },
    );
  }

  // 2. Prevent changing the owner's role
  if (memberId === user.id) {
    throw Object.assign(
      new Error("The project owner's role cannot be changed"),
      { statusCode: 400 },
    );
  }

  // 3. Update the member's role
  const { data: member, error: updateError } = await db
    .from("project_members")
    .update({ role })
    .eq("project_id", projectId)
    .eq("user_id", memberId)
    .select("id, project_id, user_id, role")
    .maybeSingle();

  if (updateError) {
    throw Object.assign(new Error("Unable to update member role"), {
      statusCode: 500,
    });
  }

  if (!member) {
    throw Object.assign(new Error("Project member not found"), {
      statusCode: 404,
    });
  }

  return member;
};

// Remove a member from a project
export const removeProjectMember = async ({
  db,
  user,
  projectId,
  memberId,
}) => {
  // 1. Verify project ownership
  const { data: project, error: projectError } = await db
    .from("projects")
    .select("id, owner_id")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError || !project) {
    throw Object.assign(
      new Error("Project not found"),
      { statusCode: 404 }
    );
  }

  if (project.owner_id !== user.id) {
    throw Object.assign(
      new Error("Only the project owner can remove members"),
      { statusCode: 403 }
    );
  }

  // 2. Prevent removing the project owner
  if (memberId === user.id) {
    throw Object.assign(
      new Error("The project owner cannot be removed"),
      { statusCode: 400 }
    );
  }

  // 3. Delete the membership
  const { data: member, error: deleteError } = await db
    .from("project_members")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", memberId)
    .select("id, project_id, user_id, role")
    .maybeSingle();

  if (deleteError) {
    throw Object.assign(
      new Error("Unable to remove project member"),
      { statusCode: 500 }
    );
  }

  if (!member) {
    throw Object.assign(
      new Error("Project member not found"),
      { statusCode: 404 }
    );
  }

  return member;
};
