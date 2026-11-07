//create a project
export const createProject = async (userSupabase, userId, projectData) => {
  const { data, error } = await userSupabase
    .from("projects")
    .insert({
      name: projectData.name,
      description: projectData.description,
      owner_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

//get all the project
export const getAllProjects = async (userSupabase) => {
  const { data, error } = await userSupabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

//get a project by id
export const getProjectById = async (userSupabase, projectId) => {
  const { data, error } = await userSupabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

//update
export const updateProject = async (
  userSupabase,
  projectId,
  projectData
) => {
  const { data, error } = await userSupabase
    .from("projects")
    .update(projectData)
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

//delete a project
export const deleteProject = async (userSupabase, projectId) => {
  const { data, error } = await userSupabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};