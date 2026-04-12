import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const Feed = () => {
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  const CATEGORIES = ["All", "Dev", "Design", "Web3", "AI/ML", "Game Dev", "Motion", "Open Source", "Other"];

  useEffect(() => {
    fetchProjects();
  }, [activeFilter, page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = "/api/projects?page=" + page + "&limit=10";
      if (activeFilter !== "All") {
        url += "&category=" + activeFilter;
      }

      const res = await authFetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch projects");
      }

      setProjects(data.projects || []);
    } catch (error) {
      addToast(error.message, "error");
      setProjects([]);
    } finally {
      setLoading(false);
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
        prev.map((p) =>
          p._id === projectId ? { ...p, likes: [...(p.likes || []), { _id: "me" }] } : p
        )
      );
      addToast("Project liked!", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleSave = async (projectId) => {
    try {
      const res = await authFetch(`/api/projects/${projectId}/save`, { method: "PUT" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      addToast("Project saved!", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="search" showNotifDot={false} />

      <div className="flex overflow-hidden">
        <div className="w-full max-w-[680px] flex-1 border-r border-white/10">
          {/* Category Filter */}
          <div className="border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveFilter(cat);
                    setPage(1);
                  }}
                  className={`whitespace-nowrap rounded-[6px] px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium transition flex-shrink-0 ${
                    activeFilter === cat
                      ? "bg-[#7f77dd] text-white"
                      : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects List */}
          {loading ? (
            <div className="p-6 text-center text-white/40">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-center text-white/40">No projects found</div>
          ) : (
            <div className="divide-y divide-white/10">
              {projects.map((project) => (
                <a
                  key={project._id}
                  href={`/project/${project._id}`}
                  className="block p-4 sm:p-6 hover:bg-white/5 transition border-b border-white/10"
                >
                  <div className="mb-2 sm:mb-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded-[4px] bg-[#7f77dd]/15 px-2 py-0.5 text-[9px] sm:text-[10px] text-[#afa9ec] mb-1.5 sm:mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-medium text-white line-clamp-2">{project.title}</h3>
                      <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-white/40 truncate">
                        by @{project.owner?.username || "unknown"}
                      </p>
                    </div>
                  </div>

                  <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-white/55 line-clamp-2">{project.description}</p>

                  {/* Tech Stack */}
                  {project.techStack?.length > 0 && (
                    <div className="mb-2 sm:mb-3 flex flex-wrap gap-1 sm:gap-2">
                      {project.techStack.slice(0, 2).map((tech) => (
                        <span key={tech} className="rounded-[4px] bg-white/5 px-2 py-0.5 text-[10px] sm:text-[11px] text-white/40">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 2 && (
                        <span className="text-[10px] sm:text-[11px] text-white/30">+{project.techStack.length - 2}</span>
                      )}
                    </div>
                  )}

                  {/* Roles */}
                  <div className="mb-2 sm:mb-3 flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-white/40">
                    <span>👥 {project.roles?.length || 0}</span>
                    <span>💬 {project.spotsLeft || 0}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLike(project._id);
                      }}
                      className="flex items-center gap-1 rounded-[6px] bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-white/50 hover:bg-white/10"
                    >
                      ❤️ {project.likes?.length || 0}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSave(project._id);
                      }}
                      className="flex items-center gap-1 rounded-[6px] bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-white/50 hover:bg-white/10"
                    >
                      📌
                    </button>
                    <a
                      href={`/project/${project._id}`}
                      className="ml-auto rounded-[6px] bg-[#7f77dd] px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-white hover:bg-[#7f77dd]/90 whitespace-nowrap"
                    >
                      Join
                    </a>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && projects.length > 0 && (
            <div className="border-t border-white/10 flex justify-center gap-1.5 sm:gap-2 p-3 sm:p-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-[6px] border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-white/50 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-white/40">{page}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="rounded-[6px] border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-white/50 hover:bg-white/5"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Hidden on Mobile/Tablet */}
        <div className="hidden w-[200px] lg:w-[240px] border-l border-white/10 p-4 lg:p-6 xl:block">
          <div className="space-y-3 lg:space-y-4">
            <h4 className="text-[11px] lg:text-xs font-medium text-white/60 uppercase tracking-wider">Trending</h4>
            <div className="space-y-1.5 lg:space-y-2">
              <div className="rounded-[8px] bg-white/5 p-2 lg:p-3 text-xs lg:text-xs text-white/50 hover:bg-white/10 cursor-pointer">
                🔥 Most Liked
              </div>
              <div className="rounded-[8px] bg-white/5 p-2 lg:p-3 text-xs lg:text-xs text-white/50 hover:bg-white/10 cursor-pointer">
                ⭐ Featured
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Feed;
