import { useMemo } from "react";

import { useWorkspaceStore } from "../../store/workspaceStore";

function useWorkspaceActions(projectId) {
  const files = useWorkspaceStore((state) => state.files);

  const createFile = useWorkspaceStore((state) => state.createFile);

  const updateFile = useWorkspaceStore((state) => state.updateFile);

  const deleteFile = useWorkspaceStore((state) => state.deleteFile);

  const folders = useMemo(() => {
    const folderMap = new Map(
      files
        .filter((file) => file.type === "folder")
        .map((folder) => [folder.id, folder]),
    );

    const getFolderPath = (folder) => {
      const parts = [folder.name];
      let parentId = folder.parent_id;
      let depth = 0;

      while (parentId && folderMap.has(parentId) && depth < 100) {
        const parent = folderMap.get(parentId);

        parts.unshift(parent.name);
        parentId = parent.parent_id;
        depth += 1;
      }

      return parts.join("/");
    };

    return [...folderMap.values()]
      .map((folder) => ({
        ...folder,
        path: getFolderPath(folder),
      }))
      .sort((a, b) => a.path.localeCompare(b.path));
  }, [files]);

  const handleCreateFile = async (fileData) => {
    return createFile(projectId, fileData);
  };

  const handleCreateFolder = async (folderData) => {
    return createFile(projectId, folderData);
  };

  const handleRename = async (item, newName) => {
    return updateFile(projectId, item.id, {
      name: newName,
    });
  };

  const handleDelete = async (item) => {
    return deleteFile(projectId, item.id);
  };

  const handleMove = async (item, parentId) => {
    await updateFile(projectId, item.id, {
      parent_id: parentId,
    });
  };

  return {
    folders,
    handleCreateFile,
    handleCreateFolder,
    handleRename,
    handleDelete,
    handleMove,
  };
}

export default useWorkspaceActions;
