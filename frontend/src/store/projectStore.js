import { create } from "zustand";

import {
  createProject as createProjectAPI,
  getAllProjects,
  updateProject as updateProjectAPI,
  deleteProject as deleteProjectAPI,
} from "../features/projects/projectService";

export const useProjectStore = create((set, get) => ({
  // State
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  // Fetch all projects
  fetchProjects: async () => {
    set({ loading: true, error: null });

    try {
      const response = await getAllProjects();

      set({
        projects: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch projects",
        loading: false,
      });

      throw error;
    }
  },

  // Create project
  addProject: async (projectData) => {
    set({ loading: true, error: null });

    try {
      const response = await createProjectAPI(projectData);

      const newProject = response.data;

      set((state) => ({
        projects: [newProject, ...state.projects],
        loading: false,
      }));

      return newProject;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create project",
        loading: false,
      });

      throw error;
    }
  },

  // Select a project
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  // Update project
  editProject: async (projectId, projectData) => {
    set({ loading: true, error: null });

    try {
      const response = await updateProjectAPI(projectId, projectData);

      const updatedProject = response.data;

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId ? updatedProject : project
        ),
        currentProject:
          state.currentProject?.id === projectId
            ? updatedProject
            : state.currentProject,
        loading: false,
      }));

      return updatedProject;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update project",
        loading: false,
      });

      throw error;
    }
  },

  // Delete project
  removeProject: async (projectId) => {
    set({ loading: true, error: null });

    try {
      await deleteProjectAPI(projectId);

      set((state) => ({
        projects: state.projects.filter(
          (project) => project.id !== projectId
        ),
        currentProject:
          state.currentProject?.id === projectId
            ? null
            : state.currentProject,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete project",
        loading: false,
      });

      throw error;
    }
  },

  // Clear project state
  clearProjects: () => {
    set({
      projects: [],
      currentProject: null,
      loading: false,
      error: null,
    });
  },
}));