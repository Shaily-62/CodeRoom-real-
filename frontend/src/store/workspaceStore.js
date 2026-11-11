import { create } from "zustand";

import {
  getProjectFiles,
  createProjectFile,
  updateProjectFile,
  deleteProjectFile,
} from "../features/workspace/fileService";

export const useWorkspaceStore = create((set, get) => ({
  files: [],
  selectedFile: null,
  openTabs: [],
  drafts: {},
  loading: false,
  saving: false,
  error: null,

  // Fetch project files
  fetchFiles: async (projectId) => {
    set({ loading: true, error: null });

    try {
      const response = await getProjectFiles(projectId);

      set({
        files: response.data ?? [],
        loading: false,
      });

      return response.data ?? [];
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load project files.",
      });

      throw error;
    }
  },

  // Create file or folder
  createFile: async (projectId, fileData) => {
    try {
      const response = await createProjectFile(projectId, fileData);
      const newFile = response.data;

      set((state) => ({
        files: [...state.files, newFile],
      }));

      if (newFile.type === "file") {
        get().openFile(newFile);
      }

      return newFile;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create file.",
      });

      throw error;
    }
  },

  // Store editor draft
  setDraft: (fileId, content) => {
    set((state) => ({
      drafts: {
        ...state.drafts,
        [fileId]: content,
      },
    }));
  },

  // Get editor content (draft first, then saved content)
  getFileContent: (file) => {
    if (!file) return "";

    const drafts = get().drafts;

    return Object.prototype.hasOwnProperty.call(drafts, file.id)
      ? drafts[file.id]
      : (file.content ?? "");
  },

  // Check whether a file has unsaved changes
  isDirty: (fileId) => {
    const state = get();

    if (!Object.prototype.hasOwnProperty.call(state.drafts, fileId)) {
      return false;
    }

    const file = state.files.find((item) => item.id === fileId);

    return file ? state.drafts[fileId] !== (file.content ?? "") : false;
  },

  // Update file metadata or save editor content
  updateFile: async (projectId, fileId, updates) => {
    set({ saving: true, error: null });

    try {
      const response = await updateProjectFile(projectId, fileId, updates);

      const updatedFile = response.data;

      set((state) => {
        const updatedDrafts = { ...state.drafts };

        // Clear the draft only if the saved content
        // is still the latest draft.
        if (
          Object.prototype.hasOwnProperty.call(updates, "content") &&
          updatedDrafts[fileId] === updates.content
        ) {
          delete updatedDrafts[fileId];
        }

        return {
          files: state.files.map((file) =>
            file.id === fileId ? updatedFile : file,
          ),

          selectedFile:
            state.selectedFile?.id === fileId
              ? updatedFile
              : state.selectedFile,

          openTabs: state.openTabs.map((file) =>
            file.id === fileId ? updatedFile : file,
          ),

          drafts: updatedDrafts,
          saving: false,
        };
      });

      return updatedFile;
    } catch (error) {
      set({
        saving: false,
        error: error.response?.data?.message || "Failed to update file.",
      });

      throw error;
    }
  },

  // Delete file or folder and its descendants

  deleteFile: async (projectId, fileId) => {
    try {
      await deleteProjectFile(projectId, fileId);

      set((state) => {
        const deletedIds = new Set([fileId]);

        let foundNewChild = true;

        while (foundNewChild) {
          foundNewChild = false;

          state.files.forEach((file) => {
            if (
              file.parent_id &&
              deletedIds.has(file.parent_id) &&
              !deletedIds.has(file.id)
            ) {
              deletedIds.add(file.id);
              foundNewChild = true;
            }
          });
        }

        const remainingFiles = state.files.filter(
          (file) => !deletedIds.has(file.id),
        );

        const remainingTabs = state.openTabs.filter(
          (file) => !deletedIds.has(file.id),
        );

        const updatedDrafts = { ...state.drafts };

        deletedIds.forEach((id) => {
          delete updatedDrafts[id];
        });

        const selectedFile = deletedIds.has(state.selectedFile?.id)
          ? remainingTabs[remainingTabs.length - 1] || null
          : state.selectedFile;

        return {
          files: remainingFiles,
          openTabs: remainingTabs,
          selectedFile,
          drafts: updatedDrafts,
        };
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete file.",
      });

      throw error;
    }
  },

  // Open file
  openFile: (file) => {
    if (!file || file.type !== "file") return;

    set((state) => ({
      selectedFile: file,

      openTabs: state.openTabs.some((tab) => tab.id === file.id)
        ? state.openTabs
        : [...state.openTabs, file],
    }));
  },

  // Select file
  selectFile: (file) => {
    get().openFile(file);
  },

  // Close tab
  // Returns false if the file has unsaved changes.
  closeTab: (fileId, force = false) => {
    if (!force && get().isDirty(fileId)) {
      return false;
    }

    set((state) => {
      const updatedTabs = state.openTabs.filter((tab) => tab.id !== fileId);

      const updatedSelectedFile =
        state.selectedFile?.id === fileId
          ? updatedTabs[updatedTabs.length - 1] || null
          : state.selectedFile;

      return {
        openTabs: updatedTabs,
        selectedFile: updatedSelectedFile,
      };
    });

    return true;
  },

  // Clear entire workspace
  clearWorkspace: () => {
    set({
      files: [],
      selectedFile: null,
      openTabs: [],
      drafts: {},
      loading: false,
      saving: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
