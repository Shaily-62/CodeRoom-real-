import { X, FileCode2 } from "lucide-react";
import { useWorkspaceStore } from "../../store/workspaceStore";

function WorkspaceTabs() {
  const openTabs = useWorkspaceStore((state) => state.openTabs);
  const selectedFile = useWorkspaceStore((state) => state.selectedFile);
  const selectFile = useWorkspaceStore((state) => state.selectFile);
  const closeTab = useWorkspaceStore((state) => state.closeTab);
  const isDirty = useWorkspaceStore((state) => state.isDirty);

  if (openTabs.length === 0) return null;

  const handleCloseTab = (event, file) => {
    event.stopPropagation();

    if (isDirty(file.id)) {
      const confirmed = window.confirm(
        `"${file.name}" has unsaved changes. Close this tab without saving?`,
      );

      if (!confirmed) return;
    }

    closeTab(file.id, true);
  };

  return (
    <div className="flex h-10 shrink-0 items-center overflow-x-auto border-b border-[var(--border)] bg-[var(--surface)]">
      {openTabs.map((file) => {
        const isActive = selectedFile?.id === file.id;
        const hasUnsavedChanges = isDirty(file.id);

        return (
          <div
            key={file.id}
            onClick={() => selectFile(file)}
            className={`group flex h-full min-w-0 cursor-pointer items-center gap-2 border-r border-[var(--border)] px-3 text-sm ${
              isActive
                ? "border-b-2 border-b-[var(--primary)] bg-[var(--surface-secondary)] text-[var(--foreground)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-secondary)]"
            }`}
          >
            <FileCode2 size={14} />

            <span className="max-w-40 truncate">{file.name}</span>

            {hasUnsavedChanges && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]"
                title="Unsaved changes"
              />
            )}

            <button
              type="button"
              onClick={(event) => handleCloseTab(event, file)}
              className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-[var(--border)] group-hover:opacity-100"
              title="Close tab"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default WorkspaceTabs;
