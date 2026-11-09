import { useState } from "react";
import { X, FolderPlus } from "lucide-react";

import { useProjectStore } from "../../store/projectStore";

function CreateProjectModal({ isOpen, onClose }) {
  const addProject = useProjectStore((state) => state.addProject);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addProject(formData);

      setFormData({
        name: "",
        description: "",
      });

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FolderPlus size={21} className="text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Create New Project
              </h2>

              <p className="text-xs text-muted mt-1">
                Start something great with your team.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-muted hover:text-foreground transition disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. E-commerce Platform"
              minLength={1}
              maxLength={100}
              required
              autoFocus
              className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
            />

            <p className="text-xs text-muted mt-2">
              Maximum 100 characters.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
              <span className="text-muted font-normal"> (Optional)</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What are you building?"
              maxLength={1000}
              rows={4}
              className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary resize-none"
            />

            <p className="text-xs text-muted mt-2">
              Maximum 1000 characters.
            </p>
          </div>

          {error && (
            <p className="text-sm text-danger">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-surface-secondary transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-5 py-2.5 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary-hover transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;