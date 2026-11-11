import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";

function RenameItemModal({ isOpen, item, onClose, onRename }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setName(item.name);
      setError("");
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (
      !trimmedName ||
      trimmedName === "." ||
      trimmedName === ".." ||
      /[/\\]/.test(trimmedName)
    ) {
      setError("Enter a valid name.");
      return;
    }

    if (trimmedName === item.name) {
      onClose();
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onRename(item, trimmedName);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Could not rename item.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pencil size={18} />
            <h2 className="font-semibold">Rename</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {saving ? "Renaming..." : "Rename"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameItemModal;
