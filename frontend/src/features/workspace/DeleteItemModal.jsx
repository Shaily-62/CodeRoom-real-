import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

function DeleteItemModal({ isOpen, item, onClose, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !item) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      await onDelete(item);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Could not delete item.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            <h2 className="font-semibold">Delete {item.type}</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="text-sm opacity-80">
          Are you sure you want to delete <strong>{item.name}</strong>?
        </p>

        {item.type === "folder" && (
          <p className="mt-2 text-sm text-red-500">
            All files and folders inside this folder will also be deleted.
          </p>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteItemModal;
