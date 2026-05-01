import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const MyProjects = () => {
  const { authFetch, user } = useAuth();
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMyProjects();
  }, [page]);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const url = `/projects/my?page=${page}&limit=10`;

      const res = await authFetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch my projects");
      }

      setProjects(data.projects || []);
    } catch (error) {
      addToast(error.message, "error");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await authFetch(`/projects/${projectId}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      addToast("Project deleted", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title="My Projects" subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""}`} />

      <div className="flex overflow-hidden">
        <div className="w-full max-w-[680px] flex-1 border-r border-white/10">
          {/* Projects List */}
          {loading ? (
            <div className="p-6 text-center text-white/40">Loading your projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-center text-white/40">
              <p className="mb-2">No projects yet</p>
              <a href="/feed" className="text-xs text-[#7f77dd] hover:text-[#afa9ec]">
                Browse and create
              </a>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {projects.map((project) => (
                <div key={project._id} className="p-6 hover:bg-white/5 transition">
                  <div className="mb-3 flex items-start justify-between">
                    <a href={`/project/${project._id}`} className="flex-1">
                      <span className="inline-block rounded-[4px] bg-[#7f77dd]/15 px-2 py-1 text-[10px] text-[#afa9ec] mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-base font-medium text-white hover:text-[#afa9ec]">{project.title}</h3>
                      <p className="mt-1 text-xs text-white/40">
                        Created on {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </a>
                    <span className="text-[11px] px-2 py-1 rounded-[3px] bg-green-500/20 text-green-400">
                      {project.status || "Active"}
                    </span>
                  </div>

                  <p className="mb-3 text-sm text-white/55 line-clamp-2">{project.description}</p>

                  {/* Stats */}
                  <div className="mb-3 grid grid-cols-4 gap-2 text-xs text-white/40">
                    <div className="rounded-[6px] bg-white/5 p-2 text-center">
                      <div className="font-medium text-white">{project.likes?.length || 0}</div>
                      <div className="text-[10px]">Likes</div>
                    </div>
                    <div className="rounded-[6px] bg-white/5 p-2 text-center">
                      <div className="font-medium text-white">{project.collaborators?.length || 0}</div>
                      <div className="text-[10px]">Collaborators</div>
                    </div>
                    <div className="rounded-[6px] bg-white/5 p-2 text-center">
                      <div className="font-medium text-white">{project.roles?.length || 0}</div>
                      <div className="text-[10px]">Roles</div>
                    </div>
                    <div className="rounded-[6px] bg-white/5 p-2 text-center">
                      <div className="font-medium text-white">{project.spotsLeft || 0}</div>
                      <div className="text-[10px]">Spots</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`/project/${project._id}`}
                      className="flex-1 rounded-[6px] bg-[#7f77dd] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#7f77dd]/90 text-center"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="rounded-[6px] bg-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && projects.length > 0 && (
            <div className="border-t border-white/10 flex justify-center gap-2 p-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-[6px] border border-white/10 px-3 py-1.5 text-xs text-white/50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-xs text-white/40">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="rounded-[6px] border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:bg-white/5"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden w-[240px] border-l border-white/10 p-6 lg:block">
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Management</h4>
            <div className="space-y-2 text-xs text-white/40">
              <div className="rounded-[8px] bg-white/5 p-3">
                <div className="font-medium text-white mb-1">👤 Manage Requests</div>
                <p className="text-[11px]">Go to Collaboration Requests to approve or deny join requests.</p>
              </div>
              <div className="rounded-[8px] bg-white/5 p-3">
                <div className="font-medium text-white mb-1">📝 Edit Project</div>
                <p className="text-[11px]">Click "View" to edit project details and manage collaborators.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyProjects;
