import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const Saved = () => {
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [page, setPage] = useState(1);

  const CATEGORIES = ["All", "Dev", "Design", "Web3", "AI/ML", "Game Dev", "Motion", "Open Source", "Other"];

  useEffect(() => {
    fetchSavedProjects();
  }, [filterCategory, page]);

  const fetchSavedProjects = async () => {
    try {
      setLoading(true);
      let url = `/api/projects/saved?page=${page}&limit=10`;
      if (filterCategory !== "All") {
        url += `&category=${filterCategory}`;
      }

      const res = await authFetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch saved projects");
      }

      setProjects(data.projects || []);
    } catch (error) {
      addToast(error.message, "error");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSave = async (projectId) => {
    try {
      const res = await authFetch(`/api/projects/${projectId}/save`, { method: "PUT" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update saved state");
      }

      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      addToast("Removed from saved", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleLike = async (projectId) => {
    try {
      const res = await authFetch(`/api/projects/${projectId}/like`, { method: "PUT" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? { ...p, likes: new Array(data.likesCount || 0).fill(0) } : p))
      );
      addToast(data.liked ? "Project liked!" : "Project unliked!", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title="Saved Projects" subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""} saved`} />

      <div className="flex overflow-hidden">
        <div className="w-full max-w-[680px] flex-1 border-r border-white/10">
          <div className="border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    setPage(1);
                  }}
                  className={`whitespace-nowrap rounded-[8px] px-4 py-2 text-xs font-medium transition ${
                    filterCategory === cat
                      ? "bg-[#7f77dd] text-white"
                      : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-white/40">Loading saved projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-center text-white/40">
              <p className="mb-2">No saved projects yet</p>
              <a href="/feed" className="text-xs text-[#7f77dd] hover:text-[#afa9ec]">
                Browse projects
              </a>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {projects.map((project) => (
                <a key={project._id} href={`/project/${project._id}`} className="block p-4 sm:p-6 hover:bg-white/5 transition">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded-[4px] bg-[#7f77dd]/15 px-2 py-1 text-[10px] text-[#afa9ec] mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-base font-medium text-white">{project.title}</h3>
                      <p className="mt-1 text-xs text-white/40">by @{project.owner?.username || "unknown"}</p>
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-white/55 line-clamp-2">{project.description}</p>

                  {project.techStack?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span key={tech} className="rounded-[4px] bg-white/5 px-2 py-1 text-[11px] text-white/40">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-[11px] text-white/30">+{project.techStack.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <div className="mb-3 flex items-center gap-2 text-xs text-white/40">
                    <span>{project.roles?.length || 0} roles</span>
                    <span>{project.spotsLeft || 0} spots left</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLike(project._id);
                      }}
                      className="flex items-center gap-1 rounded-[6px] bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:bg-white/10"
                    >
                      Like {project.likes?.length || 0}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveSave(project._id);
                      }}
                      className="flex items-center gap-1 rounded-[6px] bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:bg-white/10"
                    >
                      Remove
                    </button>
                    <a
                      href={`/project/${project._id}`}
                      className="ml-auto rounded-[6px] bg-[#7f77dd] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#7f77dd]/90"
                    >
                      Request to join
                    </a>
                  </div>
                </a>
              ))}
            </div>
          )}

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

        <div className="hidden w-[240px] border-l border-white/10 p-6 lg:block">
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Your Library</h4>
            <div className="space-y-2 text-xs text-white/40">
              <div className="rounded-[8px] bg-white/5 p-3">
                <div className="font-medium text-white mb-1">Tip</div>
                <p className="text-[11px]">Save projects to keep track of opportunities you're interested in.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Saved;
