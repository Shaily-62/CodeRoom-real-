import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  ArrowUpRight,
  Clock3,
  Code2,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderOpen,
  RefreshCw,
} from "lucide-react";

import { useAuthStore } from "../store/authStore";
import { useProjectStore } from "../store/projectStore";

import CreateProjectModal from "../features/projects/CreateProjectModal";
import EditProjectModal from "../features/projects/EditProjectModal";
import DeleteProjectModal from "../features/projects/DeleteProjectModal";

function DashboardPage() {
  const navigate = useNavigate();

  // Authentication
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);

  // Project store
  const projects = useProjectStore((state) => state.projects);
  const loading = useProjectStore((state) => state.loading);
  const error = useProjectStore((state) => state.error);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // Fetch projects
  useEffect(() => {
    fetchProjects().catch(() => {});
  }, [fetchProjects]);

  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "Developer";

  const firstName = displayName.split(" ")[0];

  // Open workspace
  const handleOpenProject = (project) => {
    setCurrentProject(project);
    navigate(`/workspace/${project.id}`);
  };

  // Open edit modal
  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsEditOpen(true);
    setActiveMenu(null);
  };

  // Open delete modal
  const handleDelete = (project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
    setActiveMenu(null);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="max-w-7xl mx-auto space-y-8"
      onClick={() => activeMenu && setActiveMenu(null)}
    >
      {/* Welcome section */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-muted mb-2">Workspace Overview</p>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {firstName}!
          </h1>

          <p className="text-muted mt-2">
            Here's what's happening with your projects.
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition"
        >
          <Plus size={18} />
          New Project
        </button>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Total Projects</p>
            <FolderKanban size={20} className="text-primary" />
          </div>

          <h2 className="text-3xl font-bold mt-4">{projects.length}</h2>

          <p className="text-xs text-muted mt-2">Projects you own</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Workspace</p>
            <Code2 size={20} className="text-primary" />
          </div>

          <h2 className="text-xl font-semibold mt-4">CodeRoom</h2>

          <p className="text-xs text-muted mt-2">
            Your collaborative development space
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Latest Project</p>
            <Clock3 size={20} className="text-primary" />
          </div>

          <h2 className="text-xl font-semibold mt-4 truncate">
            {projects.length > 0 ? projects[0].name : "No projects yet"}
          </h2>

          <p className="text-xs text-muted mt-2">
            {projects.length > 0
              ? formatDate(projects[0].created_at)
              : "Create your first project"}
          </p>
        </div>
      </section>

      {/* Projects section */}
      <section id="projects">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-semibold">Recent Projects</h2>

            <p className="text-sm text-muted mt-1">
              Manage and continue your development work.
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchProjects().catch(() => {});
            }}
            disabled={loading}
            title="Refresh projects"
            className="p-2.5 rounded-lg border border-border text-muted hover:bg-surface-secondary transition disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Loading */}
        {loading && projects.length === 0 && (
          <div className="py-16 text-center text-muted">
            Loading projects...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 mb-5 rounded-xl border border-danger/30 bg-danger/5">
            <p className="text-sm text-danger">{error}</p>

            <button
              onClick={() => fetchProjects().catch(() => {})}
              className="text-sm text-primary mt-2 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <FolderOpen size={30} />
            </div>

            <h3 className="text-lg font-semibold mt-5">No projects yet</h3>

            <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
              Create your first project and start building with your team.
            </p>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover"
            >
              <Plus size={17} />
              Create Project
            </button>
          </div>
        )}

        {/* Project cards */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((project) => (
              <div
                key={project.id}
                className="group relative bg-surface border border-border rounded-2xl p-5 hover:border-primary/50 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FolderKanban size={21} />
                  </div>

                  {/* Action menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(
                          activeMenu === project.id ? null : project.id,
                        );
                      }}
                      className="p-2 rounded-lg text-muted hover:bg-surface-secondary"
                      title="Project options"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenu === project.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-10 z-20 w-40 bg-surface border border-border rounded-xl shadow-xl p-1"
                      >
                        <button
                          onClick={() => handleEdit(project)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-secondary"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(project)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger rounded-lg hover:bg-danger/10"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenProject(project)}
                  className="block w-full text-left mt-5"
                >
                  <h3 className="text-lg font-semibold truncate group-hover:text-primary transition">
                    {project.name}
                  </h3>

                  <p className="text-sm text-muted mt-2 min-h-10 line-clamp-2">
                    {project.description || "No description added yet."}
                  </p>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    <span className="text-xs text-muted">
                      Created {formatDate(project.created_at)}
                    </span>

                    <ArrowUpRight
                      size={18}
                      className="text-muted group-hover:text-primary transition"
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        {projects.length > 6 && (
          <p className="text-center text-sm text-muted mt-5">
            Showing 6 of {projects.length} projects.
          </p>
        )}
      </section>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditProjectModal
        isOpen={isEditOpen}
        project={selectedProject}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedProject(null);
        }}
      />

      <DeleteProjectModal
        isOpen={isDeleteOpen}
        project={selectedProject}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
}

export default DashboardPage;
