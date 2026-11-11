
import { FilePlus2, FolderPlus } from "lucide-react";

function FileExplorerToolbar({ onCreateFile, onCreateFolder }) {
  return (
    <div className="flex items-center justify-between px-3 py-3">
      <h3 className="text-sm font-semibold tracking-wide">
        EXPLORER
      </h3>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onCreateFile(null)}
          title="New File in Root"
          className="rounded-md p-1.5 hover:bg-black/10 dark:hover:bg-white/10"
        >
          <FilePlus2 size={16} />
        </button>

        <button
          type="button"
          onClick={() => onCreateFolder(null)}
          title="New Folder in Root"
          className="rounded-md p-1.5 hover:bg-black/10 dark:hover:bg-white/10"
        >
          <FolderPlus size={16} />
        </button>
      </div>
    </div>
  );
}

export default FileExplorerToolbar;
