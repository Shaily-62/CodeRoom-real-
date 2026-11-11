const FILE_COLUMNS = `
  id,
  project_id,
  parent_id,
  name,
  type,
  content,
  language,
  created_by,
  updated_by,
  created_at,
  updated_at
`;

// Get all files and folders in a project
export const getProjectFiles = async (db, projectId) => {
  const { data, error } = await db
    .from("project_files")
    .select(FILE_COLUMNS)
    .eq("project_id", projectId)
    .order("type", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;

  return data;
};

// Create a file or folder
export const createProjectFile = async (
  db,
  userId,
  projectId,
  fileData
) => {
  const { data, error } = await db
    .from("project_files")
    .insert({
      project_id: projectId,
      parent_id: fileData.parent_id ?? null,
      name: fileData.name,
      type: fileData.type,
      content: fileData.type === "file" ? fileData.content ?? "" : null,
      language: fileData.type === "file" ? fileData.language ?? null : null,
      created_by: userId,
      updated_by: userId,
    })
    .select(FILE_COLUMNS)
    .single();

  if (error) throw error;

  return data;
};

// Get a single file or folder
export const getProjectFileById = async (db, projectId, fileId) => {
  const { data, error } = await db
    .from("project_files")
    .select(FILE_COLUMNS)
    .eq("id", fileId)
    .eq("project_id", projectId)
    .single();

  if (error) throw error;

  return data;
};

// Update file or folder
export const updateProjectFile = async (
  db,
  userId,
  projectId,
  fileId,
  updates
) => {
  const updateData = {
    updated_by: userId,
  };

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.language !== undefined) updateData.language = updates.language;
  if (updates.parent_id !== undefined) updateData.parent_id = updates.parent_id;

  const { data, error } = await db
    .from("project_files")
    .update(updateData)
    .eq("id", fileId)
    .eq("project_id", projectId)
    .select(FILE_COLUMNS)
    .single();

  if (error) throw error;

  return data;
};

// Delete file or folder
export const deleteProjectFile = async (db, projectId, fileId) => {
  const { data, error } = await db
    .from("project_files")
    .delete()
    .eq("id", fileId)
    .eq("project_id", projectId)
    .select("id")
    .single();

  if (error) throw error;

  return data;
};