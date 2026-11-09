import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { useProjectStore } from "../../store/projectStore";

function EditProjectModal({ isOpen, onClose, project }) {
  const editProject = useProjectStore((state) => state.editProject);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
      });
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await editProject(project.id, formData);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl">

        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">Edit Project</h2>
            <p className="text-sm text-muted mt-1">
              Update your project details.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg text-muted hover:bg-surface-secondary"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Enter project name"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              rows={4}
              placeholder="Describe your project..."
              className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground outline-none focus:border-primary resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-border text-muted hover:bg-surface-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50"
            >
              <Save size={17} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;