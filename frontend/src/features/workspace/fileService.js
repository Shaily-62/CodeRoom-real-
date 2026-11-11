
import api from "../../services/api";

export const getProjectFiles = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/files`);
  return response.data;
};

export const getProjectFile = async (projectId, fileId) => {
  const response = await api.get(
    `/projects/${projectId}/files/${fileId}`
  );
  return response.data;
};

export const createProjectFile = async (projectId, fileData) => {
  const response = await api.post(
    `/projects/${projectId}/files`,
    fileData
  );
  return response.data;
};

export const updateProjectFile = async (
  projectId,
  fileId,
  updates
) => {
  const response = await api.patch(
    `/projects/${projectId}/files/${fileId}`,
    updates
  );
  return response.data;
};

export const deleteProjectFile = async (projectId, fileId) => {
  const response = await api.delete(
    `/projects/${projectId}/files/${fileId}`
  );
  return response.data;
};
