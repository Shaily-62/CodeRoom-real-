
import { useState } from "react";
import { X, FolderPlus } from "lucide-react";

function CreateFolderModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a folder name.");
      return;
    }

    if (
      trimmedName === "." ||
      trimmedName === ".." ||
      /[/\\]/.test(trimmedName)
    ) {
      setError("Please enter a valid folder name.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      await onCreate({
        name: trimmedName,
        type: "folder",
      });

      setName("");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not create folder."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus size={20} />
            <h2 className="text-lg font-semibold">New Folder</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Folder name
            </label>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: components"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFolderModal;
