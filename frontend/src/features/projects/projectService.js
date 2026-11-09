import api from "../../services/api";

// Create a new project
export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

// Get all projects belonging to the logged-in user
export const getAllProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

// Get a single project
export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

// Update an existing project
export const updateProject = async (projectId, projectData) => {
  const response = await api.put(
    `/projects/${projectId}`,
    projectData
  );

  return response.data;
};

// Delete a project
export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};