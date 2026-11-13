import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Code2, Loader2, Save } from "lucide-react";

import { getProjectById } from "../features/projects/projectService";

import FileExplorer from "../features/workspace/FileExplorer";
import CodeEditor from "../features/workspace/CodeEditor";
import WorkspaceTabs from "../features/workspace/WorkspaceTabs";

import CreateFileModal from "../features/workspace/CreateFileModal";
import CreateFolderModal from "../features/workspace/CreateFolderModal";
import RenameItemModal from "../features/workspace/RenameItemModal";
import DeleteItemModal from "../features/workspace/DeleteItemModal";
import MoveItemModal from "../features/workspace/MoveItemModal";

import useWorkspaceActions from "../features/workspace/useWorkspaceActions";

import { useWorkspaceStore } from "../store/workspaceStore";
import { useAuthStore } from "../store/authStore";
import { createCollaborationSession } from "../features/workspace/collaborationService";

function WorkspacePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const accessToken = useAuthStore((state) => state.accessToken);

  const [collaborationSession, setCollaborationSession] = useState(null);
  const [collaborationStatus, setCollaborationStatus] =
    useState("disconnected");
  const [collaborationSynced, setCollaborationSynced] = useState(false);
  const [collaborationError, setCollaborationError] = useState("");

  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");

  const [showFileModal, setShowFileModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const [targetFolderId, setTargetFolderId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeMoveItem, setActiveMoveItem] = useState(null);

  const [editorContent, setEditorContent] = useState("");

  const files = useWorkspaceStore((state) => state.files);
  const selectedFile = useWorkspaceStore((state) => state.selectedFile);
  const updateFile = useWorkspaceStore((state) => state.updateFile);
  const saving = useWorkspaceStore((state) => state.saving);
  const clearWorkspace = useWorkspaceStore((state) => state.clearWorkspace);

  const setDraft = useWorkspaceStore((state) => state.setDraft);
  const getFileContent = useWorkspaceStore((state) => state.getFileContent);
  const isDirty = useWorkspaceStore((state) => state.isDirty);
  const drafts = useWorkspaceStore((state) => state.drafts);

  const {
    folders,
    handleCreateFile,
    handleCreateFolder,
    handleRename,
    handleDelete,
    handleMove,
  } = useWorkspaceActions(projectId);

  // Check whether any file has unsaved changes.
  const hasUnsavedChanges = () =>
    Object.keys(drafts).some((fileId) => isDirty(fileId));

  // Protect against losing edits when navigating away.
  const handleBackToDashboard = () => {
    if (hasUnsavedChanges()) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this workspace?",
      );

      if (!confirmed) return;
    }

    navigate("/dashboard");
  };

  // Exclude the selected folder and its descendants
  // from possible move destinations.
  const availableMoveFolders = useMemo(() => {
    if (!activeMoveItem || activeMoveItem.type !== "folder") {
      return folders;
    }

    const unavailableIds = new Set([activeMoveItem.id]);

    files.forEach((file) => {
      let parentId = file.parent_id;

      while (parentId) {
        if (unavailableIds.has(parentId)) {
          unavailableIds.add(file.id);
          break;
        }

        const parent = files.find((item) => item.id === parentId);
        parentId = parent?.parent_id ?? null;
      }
    });

    return folders.filter((folder) => !unavailableIds.has(folder.id));
  }, [folders, files, activeMoveItem]);

  // Clear previous project's workspace state.
  useEffect(() => {
    clearWorkspace();
    setEditorContent("");
  }, [projectId, clearWorkspace]);

  // Load project details.
  useEffect(() => {
    let active = true;

    const loadProject = async () => {
      setProjectLoading(true);
      setProjectError("");
      setProject(null);

      try {
        const response = await getProjectById(projectId);

        if (active) {
          setProject(response.data);
        }
      } catch (error) {
        if (active) {
          setProjectError(
            error.response?.data?.message || "Could not load this project.",
          );
        }
      } finally {
        if (active) {
          setProjectLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      active = false;
    };
  }, [projectId]);

  // Manage the collaboration connection for the selected file.
  useEffect(() => {
    if (!selectedFile || !accessToken) {
      setCollaborationSession(null);
      setCollaborationStatus("disconnected");
      setCollaborationSynced(false);
      setCollaborationError("");
      return;
    }

    let active = true;
    let session = null;

    setCollaborationSession(null);
    setCollaborationStatus("connecting");
    setCollaborationSynced(false);
    setCollaborationError("");

    try {
      session = createCollaborationSession({
        projectId,
        fileId: selectedFile.id,
        accessToken,

        onStatus: (status) => {
          if (active) {
            setCollaborationStatus(status);
          }
        },

        onSynced: (synced) => {
          if (active && synced) {
            setCollaborationSynced(true);
          }
        },

        onAuthenticationFailed: () => {
          if (active) {
            setCollaborationError(
              "Collaboration authentication failed. Please log in again.",
            );
          }
        },
      });

      if (active) {
        setCollaborationSession(session);
      }
    } catch (error) {
      setCollaborationError(error.message || "Could not start collaboration.");
      setCollaborationStatus("disconnected");
    }

    return () => {
      active = false;

      if (session) {
        session.destroy();
      }
    };
  }, [projectId, selectedFile?.id, accessToken]);

  // Update editor when selected file changes.
  useEffect(() => {
    if (!selectedFile) {
      setEditorContent("");
      return;
    }

    setEditorContent(getFileContent(selectedFile));
  }, [selectedFile?.id, getFileContent]);

  // Protect against browser refresh or tab closure.
  useEffect(() => {
    if (!hasUnsavedChanges()) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [drafts, isDirty]);

  // Save the current file using Ctrl + S or Cmd + S.
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isSaveShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s";

      if (!isSaveShortcut) return;

      event.preventDefault();

      if (!selectedFile || !isDirty(selectedFile.id) || saving) {
        return;
      }

      handleSave();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedFile, editorContent, saving, isDirty]);

  // Save current file.
  const handleSave = async () => {
    if (!selectedFile) return;

    try {
      await updateFile(projectId, selectedFile.id, {
        content: editorContent,
      });
    } catch {
      // Zustand maintains the error state.
    }
  };

  // Create actions.
  const openCreateFile = (folderId = null) => {
    setTargetFolderId(folderId);
    setShowFileModal(true);
  };

  const openCreateFolder = (folderId = null) => {
    setTargetFolderId(folderId);
    setShowFolderModal(true);
  };

  // Rename and delete actions.
  const openRename = (item) => {
    setActiveItem(item);
    setShowRenameModal(true);
  };

  const openDelete = (item) => {
    setActiveItem(item);
    setShowDeleteModal(true);
  };

  // Move action.
  const openMove = (item) => {
    setActiveMoveItem(item);
    setShowMoveModal(true);
  };

  const closeMove = () => {
    setShowMoveModal(false);
    setActiveMoveItem(null);
  };

  // Editor changes.
  const handleEditorChange = (content) => {
    setEditorContent(content);

    if (selectedFile) {
      setDraft(selectedFile.id, content);
    }
  };

  if (projectLoading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2">
        <Loader2 className="animate-spin" size={20} />
        <span>Loading workspace...</span>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-500">
          {projectError || "Project not found."}
        </p>

        <button
          onClick={handleBackToDashboard}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Workspace Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border)] px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToDashboard}
            className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/5"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            <Code2 size={19} />

            <div>
              <h1 className="text-sm font-semibold">{project.name}</h1>
              <p className="text-xs opacity-60">CodeRoom Workspace</p>
            </div>

            <div className="ml-3 flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1">
              <span
                className={`h-2 w-2 rounded-full ${
                  collaborationStatus === "connected" && collaborationSynced
                    ? "bg-green-500"
                    : collaborationStatus === "connecting"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />

              <span className="text-xs opacity-70">
                {collaborationSynced
                  ? "Live"
                  : collaborationStatus === "connecting"
                    ? "Connecting"
                    : "Disconnected"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!selectedFile || !isDirty(selectedFile.id) || saving}
          className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}

          {saving ? "Saving..." : "Save"}
        </button>
      </header>

      {/* Workspace Content */}
      <div className="flex min-h-0 flex-1">
        {/* File Explorer */}
        <div className="w-64 shrink-0 overflow-hidden border-r border-[var(--border)]">
          <FileExplorer
            projectId={projectId}
            onCreateFile={openCreateFile}
            onCreateFolder={openCreateFolder}
            onRename={openRename}
            onDelete={openDelete}
            onMove={openMove}
          />
        </div>

        {/* Editor Area */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <WorkspaceTabs />

          {selectedFile ? (
            <div className="min-h-0 flex-1">
              {!collaborationSynced ? (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  {collaborationError ? (
                    <p className="text-sm text-red-500">{collaborationError}</p>
                  ) : (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      <p className="text-sm opacity-60">
                        {collaborationStatus === "connected"
                          ? "Synchronizing document..."
                          : "Connecting to collaboration server..."}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <CodeEditor
                  key={selectedFile.id}
                  fileId={selectedFile.id}
                  value={editorContent}
                  language={selectedFile.language || "plaintext"}
                  onChange={handleEditorChange}
                  ydoc={collaborationSession?.ydoc}
                  provider={collaborationSession?.provider}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 opacity-50">
              <Code2 size={42} />
              <h2 className="text-lg font-medium">Welcome to CodeRoom</h2>
              <p className="text-sm">
                Select a file from the explorer to start coding.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Create File */}
      <CreateFileModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        onCreate={(data) =>
          handleCreateFile({
            ...data,
            parent_id: targetFolderId,
          })
        }
      />

      {/* Create Folder */}
      <CreateFolderModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onCreate={(data) =>
          handleCreateFolder({
            ...data,
            parent_id: targetFolderId,
          })
        }
      />

      {/* Rename */}
      <RenameItemModal
        isOpen={showRenameModal}
        item={activeItem}
        onClose={() => {
          setShowRenameModal(false);
          setActiveItem(null);
        }}
        onRename={handleRename}
      />

      {/* Delete */}
      <DeleteItemModal
        isOpen={showDeleteModal}
        item={activeItem}
        onClose={() => {
          setShowDeleteModal(false);
          setActiveItem(null);
        }}
        onDelete={handleDelete}
      />

      {/* Move */}
      <MoveItemModal
        item={showMoveModal ? activeMoveItem : null}
        folders={availableMoveFolders}
        onClose={closeMove}
        onMove={handleMove}
      />
    </div>
  );
}

export default WorkspacePage;
