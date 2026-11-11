import { useEffect, useMemo } from "react";
import { FolderOpen } from "lucide-react";

import { useWorkspaceStore } from "../../store/workspaceStore";
import { buildFileTree } from "./fileTree.utils";

import FileExplorerToolbar from "./FileExplorerToolbar";
import FileTreeItem from "./FileTreeItem";

function FileExplorer({
  projectId,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onMove,
}) {
  const files = useWorkspaceStore((state) => state.files);
  const selectedFile = useWorkspaceStore((state) => state.selectedFile);

  const loading = useWorkspaceStore((state) => state.loading);
  const error = useWorkspaceStore((state) => state.error);

  const fetchFiles = useWorkspaceStore((state) => state.fetchFiles);
  const selectFile = useWorkspaceStore((state) => state.selectFile);

  useEffect(() => {
    if (!projectId) return;

    fetchFiles(projectId).catch(() => {});
  }, [projectId, fetchFiles]);

  const fileTree = useMemo(() => buildFileTree(files), [files]);

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-r border-black/10 dark:border-white/10">
      <FileExplorerToolbar
        onCreateFile={onCreateFile}
        onCreateFolder={onCreateFolder}
      />

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <p className="px-3 py-4 text-sm opacity-60">Loading files...</p>
        ) : error ? (
          <p className="px-3 py-4 text-sm text-red-500">{error}</p>
        ) : fileTree.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <FolderOpen size={28} className="opacity-40" />

            <p className="text-sm font-medium">No files yet</p>

            <p className="text-xs opacity-60">
              Create a file or folder to get started.
            </p>
          </div>
        ) : (
          fileTree.map((node) => (
            <FileTreeItem
              key={node.id}
              node={node}
              selectedFile={selectedFile}
              onSelectFile={selectFile}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        )}
      </div>
    </aside>
  );
}

export default FileExplorer;
