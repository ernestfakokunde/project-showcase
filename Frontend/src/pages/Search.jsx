import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";

const Search = () => {
  const [searchParams] = useSearchParams();
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState("projects");

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, searchType]);

  const performSearch = async () => {
    try {
      setLoading(true);
      let url = "";

      if (searchType === "projects") {
        url = `/api/projects?search=${encodeURIComponent(query)}&limit=50`;
      } else if (searchType === "people") {
        url = `/api/users/search?q=${encodeURIComponent(query)}`;
      }

      const res = await authFetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Search failed");
      }

      setResults(data.projects || data.users || []);
    } catch (error) {
      addToast(error.message, "error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (projectId) => {
    try {
      const res = await authFetch(`/api/projects/${projectId}/like`, { method: "PUT" });

      if (!res.ok) {
        throw new Error("Failed to like");
      }

      addToast("Project liked!", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title={`Search Results for "${query}"`} subtitle="Find projects and people" />

      <div className="flex overflow-hidden">
        <div className="w-full max-w-[680px] flex-1 border-r border-white/10">
          {/* Search Type Filter */}
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex gap-2">
              {[
                { value: "projects", label: "🔍 Projects" },
                { value: "people", label: "👤 People" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSearchType(opt.value)}
                  className={`whitespace-nowrap rounded-[8px] px-4 py-2 text-xs font-medium transition ${
                    searchType === opt.value
                      ? "bg-[#7f77dd] text-white"
                      : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {!query.trim() ? (
            <div className="p-6 text-center text-white/40">Enter a search term to find projects and people</div>
          ) : loading ? (
            <div className="p-6 text-center text-white/40">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-white/40">
              <p className="mb-2">No {searchType} found for "{query}"</p>
              <p className="text-xs">Try different keywords or browse featured projects</p>
            </div>
          ) : searchType === "projects" ? (
            <div className="divide-y divide-white/10">
              {results.map((project) => (
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
                    </div>
                  )}

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
                    <a
                      href={`/project/${project._id}`}
                      className="ml-auto rounded-[6px] bg-[#7f77dd] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#7f77dd]/90"
                    >
                      View
                    </a>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {results.map((user) => (
                <a
                  key={user._id}
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-4 p-6 hover:bg-white/5 transition"
                >
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#7f77dd]/25 text-[16px] font-medium text-[#afa9ec]">
                    {(user.initials || user.username?.slice(0, 2) || "SL").toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">@{user.username}</div>
                    <div className="text-xs text-white/40">{user.role || "Member"}</div>
                    {user.bio && <p className="mt-1 text-xs text-white/50">{user.bio}</p>}
                  </div>
                  <button className="rounded-[6px] border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:bg-white/10">
                    View Profile
                  </button>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden w-[240px] border-l border-white/10 p-6 lg:block">
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Search Tips</h4>
            <div className="space-y-2 text-xs text-white/40">
              <div className="rounded-[8px] bg-white/5 p-3">
                <div className="font-medium text-white mb-1">💡 Try Keywords</div>
                <p className="text-[11px]">Search by technologies, roles, or project names.</p>
              </div>
              <div className="rounded-[8px] bg-white/5 p-3">
                <div className="font-medium text-white mb-1">👥 Find People</div>
                <p className="text-[11px]">Switch to the People tab to find collaborators.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Search;
