import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const Trending = () => {
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("likes");
  const [page, setPage] = useState(1);

  const SORT_OPTIONS = [
    { value: "likes", label: "🔥 Most Liked" },
  ];

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      const url = `/api/projects/trending?limit=30`;

      const res = await authFetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch trending projects");
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
      <Topbar variant="title" title="Trending Projects" subtitle="Discover what's popular right now" />

      <div className="flex overflow-hidden">
        <div className="w-full max-w-[680px] flex-1 border-r border-white/10">
          {/* Sort Filter */}
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setPage(1);
                  }}
                  className={`whitespace-nowrap rounded-[8px] px-4 py-2 text-xs font-medium transition ${
                    sortBy === opt.value
                      ? "bg-[#7f77dd] text-white"
                      : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects List */}
          {loading ? (
            <div className="p-6 text-center text-white/40">Loading trending projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-center text-white/40">No trending projects yet</div>
          ) : (
            <div className="divide-y divide-white/10">
              {projects.map((project) => (
                <a
                  key={project._id}
                  href={`/project/${project._id}`}
                  className="block p-6 hover:bg-white/5 transition"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <span className="inline-block rounded-[4px] bg-[#7f77dd]/15 px-2 py-1 text-[10px] text-[#afa9ec] mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-base font-medium text-white">{project.title}</h3>
                      <p className="mt-1 text-xs text-white/40">
                        by @{project.owner?.username || "unknown"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-[#7f77dd]">
                        🔥 {project.likes?.length || 0} likes
                      </div>
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-white/55 line-clamp-2">{project.description}</p>

                  {/* Tech Stack */}
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

                  {/* Roles */}
                  <div className="mb-3 flex items-center gap-2 text-xs text-white/40">
                    <span>👥 {project.roles?.length || 0} roles</span>
                    <span>💬 {project.spotsLeft || 0} spots left</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLike(project._id);
                      }}
                      className="flex items-center gap-1 rounded-[6px] bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:bg-white/10"
                    >
                      ❤️ {project.likes?.length || 0}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSave(project._id);
                      }}
                      className="flex items-center gap-1 rounded-[6px] bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:bg-white/10"
                    >
                      📌 Save
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

          {/* No pagination needed for trending endpoint */}
        </div>

        {/* Right Panel */}
        <div className="hidden w-[240px] border-l border-white/10 p-6 lg:block">
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Info</h4>
            <div className="space-y-3 text-xs text-white/40">
              <div className="rounded-[8px] bg-white/5 p-3">
                <div className="font-medium text-white mb-1">📊 What makes something trending?</div>
                <p className="text-[11px]">Projects are ranked by engagement including likes, comments, and recent activity.</p>
              </div>
              <div className="rounded-[8px] bg-white/5 p-3">
                <div className="font-medium text-white mb-1">💡 Pro Tip</div>
                <p className="text-[11px]">Follow projects you love to get notified when others join.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Trending;
