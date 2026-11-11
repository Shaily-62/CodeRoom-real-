
import { useEffect, useState } from "react";
import { Folder, X } from "lucide-react";

function MoveItemModal({ item, folders = [], onClose, onMove }) {
  const [parentId, setParentId] = useState("");
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setParentId(item?.parent_id ?? "");
    setError("");
  }, [item]);

  if (!item) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (parentId === item.id) {
      setError("An item cannot be moved into itself.");
      return;
    }

    try {
      setMoving(true);
      setError("");

      await onMove(item, parentId || null);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to move this item."
      );
    } finally {
      setMoving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Move item
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Choose a destination folder.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-secondary)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-lg bg-[var(--surface-secondary)] p-3">
          <Folder size={18} className="text-[var(--primary)]" />
          <span className="truncate text-sm text-[var(--foreground)]">
            {item.name}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
            Destination
          </label>

          <select
            value={parentId}
            onChange={(event) => setParentId(event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
          >
            <option value="">Root directory</option>

            {folders
              .filter((folder) => folder.id !== item.id)
              .map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.path || folder.name}
                </option>
              ))}
          </select>

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface-secondary)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={moving}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {moving ? "Moving..." : "Move"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MoveItemModal;
