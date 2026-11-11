import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode2,
  FileText,
  FilePlus2,
  FolderPlus,
  FolderInput,
  Pencil,
  Trash2,
} from "lucide-react";

function getFileIcon(name) {
  const extension = name.split(".").pop()?.toLowerCase();

  const codeExtensions = [
    "js",
    "jsx",
    "ts",
    "tsx",
    "py",
    "java",
    "cpp",
    "c",
    "html",
    "css",
    "json",
    "sql",
    "php",
    "go",
    "rs",
  ];

  return codeExtensions.includes(extension) ? FileCode2 : FileText;
}

function FileTreeItem({
  node,
  depth = 0,
  selectedFile,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  onMove,
}) {
  const [expanded, setExpanded] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const isFolder = node.type === "folder";
  const isSelected = selectedFile?.id === node.id;

  const Icon = isFolder
    ? expanded
      ? FolderOpen
      : Folder
    : getFileIcon(node.name);

  useEffect(() => {
    if (!contextMenu) return;

    const closeMenu = () => setContextMenu(null);

    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [contextMenu]);

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isFolder) setExpanded(true);

    setContextMenu({
      x: Math.min(event.clientX, window.innerWidth - 190),
      y: Math.min(event.clientY, window.innerHeight - 220),
    });
  };

  const handleCreate = (action) => {
    setContextMenu(null);

    if (action === "file") onCreateFile(node.id);
    else onCreateFolder(node.id);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (isFolder) setExpanded((previous) => !previous);
          else onSelectFile(node);
        }}
        onContextMenu={handleContextMenu}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
          isSelected
            ? "bg-black/10 font-medium dark:bg-white/10"
            : "hover:bg-black/5 dark:hover:bg-white/5"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {isFolder ? (
          expanded ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )
        ) : (
          <span className="w-[14px]" />
        )}

        <Icon size={16} className="shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>

      {contextMenu && (
        <div
          className="fixed z-[100] min-w-48 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          {isFolder && (
            <>
              <button
                type="button"
                onClick={() => handleCreate("file")}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
              >
                <FilePlus2 size={15} /> New File
              </button>

              <button
                type="button"
                onClick={() => handleCreate("folder")}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
              >
                <FolderPlus size={15} /> New Folder
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setContextMenu(null);
              onMove(node);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            <FolderInput size={15} /> Move
          </button>

          <button
            type="button"
            onClick={() => {
              setContextMenu(null);
              onRename(node);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Pencil size={15} /> Rename
          </button>

          <button
            type="button"
            onClick={() => {
              setContextMenu(null);
              onDelete(node);
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      )}

      {isFolder && expanded && (
        <div>
          {node.children?.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))}

          {node.children?.length === 0 && (
            <p
              className="py-2 text-xs opacity-50"
              style={{ paddingLeft: `${44 + depth * 16}px` }}
            >
              Empty folder
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default FileTreeItem;
