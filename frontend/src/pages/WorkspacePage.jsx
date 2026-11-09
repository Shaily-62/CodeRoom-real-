
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FolderKanban, LoaderCircle } from "lucide-react";

import { getProjectById } from "../features/projects/projectService";
import { useProjectStore } from "../store/projectStore";

function WorkspacePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const currentProject = useProjectStore(
    (state) => state.currentProject
  );

  const setCurrentProject = useProjectStore(
    (state) => state.setCurrentProject
  );

  const [project, setProject] = useState(
    currentProject?.id === projectId ? currentProject : null
  );

  const [loading, setLoading] = useState(!project);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProjectById(projectId);
        const fetchedProject = response.data;

        if (isMounted) {
          setProject(fetchedProject);
          setCurrentProject(fetchedProject);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load this project."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [projectId, setCurrentProject]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-muted">
        <LoaderCircle size={28} className="animate-spin" />
        <p>Loading workspace...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-danger mb-4">
          {error || "Project not found."}
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 rounded-lg bg-primary text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </button>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FolderKanban size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              {project.name}
            </h1>

            <p className="text-sm text-muted mt-1">
              {project.description || "No description added yet."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-12 text-center">
        <h2 className="text-xl font-semibold">
          Your development workspace
        </h2>

        <p className="text-muted mt-2">
          The file explorer, code editor, terminal and team collaboration
          features will be built here.
        </p>

        <p className="text-xs text-muted mt-5">
          Workspace ID: {project.id}
        </p>
      </div>
    </div>
  );
}

export default WorkspacePage;
