import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import Topbar from "../components/layout/Topbar";

const CATEGORIES = ["All", "Dev", "Design", "Web3", "AI/ML", "Game Dev", "Motion", "Open Source", "Other"];
const VIEW_MODES = [
  { value: "latest", label: "Latest", hint: "Newest project posts" },
  { value: "mostLiked", label: "Most Liked", hint: "Ranked by likes" },
  { value: "featured", label: "Featured", hint: "Open roles and active collaboration" },
];

const CATEGORY_STYLES = {
  Dev: "from-[#7f77dd]/30 to-[#7f77dd]/5 text-[#afa9ec]",
  Design: "from-[#1d9e75]/30 to-[#1d9e75]/5 text-[#6ee7bf]",
  Web3: "from-[#d85a30]/30 to-[#d85a30]/5 text-[#f09a7a]",
  "AI/ML": "from-[#347add]/30 to-[#347add]/5 text-[#8bbcff]",
};

const Feed = () => {
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const { isDark } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProjects();
  }, [activeFilter, page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = `/projects?page=${page}&limit=12`;
      if (activeFilter !== "All") {
        url += `&category=${encodeURIComponent(activeFilter)}`;
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

  const visibleProjects = useMemo(() => {
    const next = [...projects];

    if (viewMode === "mostLiked") {
      return next.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }

    if (viewMode === "featured") {
      return next
        .filter((project) => {
          const openRoles = project.roles?.filter((role) => role.status === "open").length || 0;
          return openRoles > 0 || project.status === "Looking for collaborators";
        })
        .sort((a, b) => (b.roles?.length || 0) - (a.roles?.length || 0));
    }

    return next;
  }, [projects, viewMode]);

  const handleLike = async (projectId) => {
    try {
      const res = await authFetch(`/projects/${projectId}/like`, { method: "PUT" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to like project");

      setProjects((prev) =>
        prev.map((project) =>
          project._id === projectId ? { ...project, likes: new Array(data.likesCount || 0).fill(0) } : project
        )
      );
      addToast(data.liked ? "Project liked" : "Project unliked", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleSave = async (projectId) => {
    try {
      const res = await authFetch(`/projects/${projectId}/save`, { method: "PUT" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.message || "Failed to save project");

      addToast(data.saved ? "Project saved" : "Project removed from saved", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  return (
    <main className={isDark ? "min-h-screen bg-[#09090e] text-white" : "min-h-screen bg-white text-gray-900"}>
      <Topbar variant="search" showNotifDot={false} />

      <div className="flex min-h-[calc(100vh-63px)]">
        <section className={`min-w-0 flex-1 ${isDark ? "border-r border-white/10" : "border-r border-gray-200"}`}>
          <div className={`sticky top-0 z-10 ${isDark ? "border-b border-white/10 bg-[#09090e]/95" : "border-b border-gray-200 bg-white/95"} px-4 py-4 backdrop-blur sm:px-6`}>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveFilter(category);
                    setPage(1);
                  }}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    activeFilter === category
                      ? "bg-[#7f77dd] text-white"
                      : isDark
                      ? "border border-white/10 bg-white/5 text-white/55 hover:bg-white/10"
                      : "border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className={`p-8 text-center ${isDark ? "text-white/40" : "text-gray-400"}`}>Loading projects...</div>
          ) : visibleProjects.length === 0 ? (
            <div className={`p-8 text-center ${isDark ? "text-white/40" : "text-gray-400"}`}>No projects found for this view.</div>
          ) : (
            <div className="grid gap-4 p-4 sm:p-6 xl:grid-cols-2">
              {visibleProjects.map((project) => (
                <ProjectPost
                  key={project._id}
                  project={project}
                  onOpen={() => navigate(`/project/${project._id}`)}
                  onAuthorOpen={(event) => {
                    event.stopPropagation();
                    navigate(`/profile/${project.owner?.username}`);
                  }}
                  onLike={(event) => {
                    event.stopPropagation();
                    handleLike(project._id);
                  }}
                  onSave={(event) => {
                    event.stopPropagation();
                    handleSave(project._id);
                  }}
                />
              ))}
            </div>
          )}

          {!loading && projects.length > 0 ? (
            <div className="border-t border-white/10 p-4">
              <div className="mx-auto flex w-fit items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/55 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-xs text-white/35">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/55 hover:bg-white/5"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="hidden w-[260px] shrink-0 border-l border-white/10 p-5 xl:block">
          <div className="sticky top-5 space-y-5">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Feed views</h4>
              <div className="mt-3 space-y-2">
                {VIEW_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      viewMode === mode.value
                        ? "border-[#7f77dd]/45 bg-[#7f77dd]/15"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-sm font-medium text-white">{mode.label}</div>
                    <div className="mt-1 text-[11px] leading-4 text-white/38">{mode.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#111118] p-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Featured logic</h4>
              <p className="mt-3 text-xs leading-5 text-white/42">
                Featured shows projects with open roles or a collaboration status, sorted by role availability.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

const ProjectPost = ({ project, onOpen, onAuthorOpen, onLike, onSave }) => {
  const categoryClass = CATEGORY_STYLES[project.category] || "from-white/12 to-white/[0.03] text-white/60";
  const initials = (project.owner?.username?.slice(0, 2) || "SL").toUpperCase();
  const tags = [...(project.techStack || []), ...(project.tools || [])].slice(0, 4);
  const openRoles = project.roles?.filter((role) => role.status === "open").length || 0;

  return (
    <article
      onClick={onOpen}
      className="cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#111118] transition hover:border-[#7f77dd]/35 hover:bg-[#14141d]"
    >
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={onAuthorOpen}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7f77dd]/25 text-xs font-semibold text-[#afa9ec]"
        >
          {initials}
        </button>
        <div className="min-w-0 flex-1">
          <button type="button" onClick={onAuthorOpen} className="block truncate text-sm font-medium text-white hover:text-[#afa9ec]">
            @{project.owner?.username || "stacker"}
          </button>
          <p className="text-[11px] text-white/30">
            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Recently"} • {project.status || "Active"}
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/45">{project.category}</span>
      </div>

      <div className="px-4 py-4">
        <h2 className="text-base font-semibold leading-6 text-white">{project.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/50">{project.description}</p>
      </div>

      <div className="px-4">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-36 w-full rounded-lg border border-white/10 object-cover sm:h-40"
          />
        ) : (
          <div className={`flex h-32 w-full items-center justify-between rounded-lg border border-white/10 bg-gradient-to-br ${categoryClass} px-4 sm:h-36`}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] opacity-70">Project</p>
              <p className="mt-2 max-w-[180px] text-lg font-semibold leading-6 text-white">{project.category}</p>
            </div>
            <div className="grid h-16 w-16 grid-cols-2 gap-1 rounded-xl bg-black/12 p-3">
              <span className="rounded bg-current opacity-90" />
              <span className="rounded bg-current opacity-45" />
              <span className="rounded bg-current opacity-45" />
              <span className="rounded bg-current opacity-90" />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {tags.length ? (
            tags.map((tag) => (
              <span key={tag} className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/42">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-white/28">No tools added yet</span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <Stat label="Likes" value={project.likes?.length || 0} />
          <Stat label="Roles" value={project.roles?.length || 0} />
          <Stat label="Open" value={openRoles} />
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-white/10">
        <ActionButton onClick={onLike}>Like</ActionButton>
        <ActionButton onClick={onSave}>Save</ActionButton>
        <ActionButton onClick={onOpen} strong>Join</ActionButton>
      </div>
    </article>
  );
};

const Stat = ({ label, value }) => (
  <div className="rounded-lg bg-white/[0.035] px-2 py-2">
    <div className="font-semibold text-white">{value}</div>
    <div className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-white/30">{label}</div>
  </div>
);

const ActionButton = ({ children, onClick, strong = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-3 text-xs font-medium transition hover:bg-white/5 ${
      strong ? "text-[#afa9ec]" : "text-white/48"
    }`}
  >
    {children}
  </button>
);

export default Feed;
