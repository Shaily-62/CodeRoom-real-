
import { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { useProjectStore } from "../../store/projectStore";

function DeleteProjectModal({ isOpen, onClose, project }) {
  const removeProject = useProjectStore((state) => state.removeProject);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !project) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await removeProject(project.id);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl">

        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Delete Project</h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg text-muted hover:bg-surface-secondary"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>

            <div>
              <p className="font-medium">Are you sure?</p>
              <p className="text-sm text-muted">
                You are about to delete this project.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary">
            <p className="font-medium text-sm">{project.name}</p>
            <p className="text-xs text-muted mt-1">
              {project.description || "No description"}
            </p>
          </div>

          <p className="text-sm text-muted">
            This action cannot be undone.
          </p>

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-border text-muted hover:bg-surface-secondary"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-danger text-white hover:opacity-90 disabled:opacity-50"
          >
            <Trash2 size={17} />
            {loading ? "Deleting..." : "Delete Project"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeleteProjectModal;
