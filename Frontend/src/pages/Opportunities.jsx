import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const categories = ["", "Dev", "Design", "Web3", "AI/ML", "Game Dev", "Motion", "Open Source", "Other"];

const Opportunities = () => {
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const params = useMemo(() => {
    const search = new URLSearchParams();
    if (query.trim()) search.set("q", query.trim());
    if (category) search.set("category", category);
    search.set("limit", "60");
    return search.toString();
  }, [query, category]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const res = await authFetch(`/projects/roles/open?${params}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load opportunities");
        setRoles(data.roles || []);
      } catch (error) {
        addToast(error.message, "error");
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [authFetch, addToast, params]);

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title="Opportunities" subtitle="Open roles across active projects" />

      <div className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles, tools, or project names..."
            className="h-10 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/70 outline-none placeholder:text-white/25 focus:border-[#7f77dd]/50"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-[#111118] px-3 text-sm text-white/70 outline-none focus:border-[#7f77dd]/50"
          >
            {categories.map((item) => (
              <option key={item || "all"} value={item}>
                {item || "All categories"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-white/40">Loading open roles...</div>
      ) : roles.length === 0 ? (
        <div className="p-8 text-center text-white/40">No open roles found.</div>
      ) : (
        <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <article key={`${role.project._id}-${role._id}`} className="rounded-lg border border-white/10 bg-[#111118] p-5 transition hover:border-[#7f77dd]/35">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-md bg-[#7f77dd]/15 px-2 py-1 text-[11px] text-[#afa9ec]">
                    {role.project.category}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold text-white">{role.title}</h2>
                </div>
                <span className="rounded-full bg-[#1d9e75]/12 px-2.5 py-1 text-[11px] text-[#6ee7bf]">Open</span>
              </div>

              <p className="mt-3 text-sm leading-6 text-white/50">{role.description}</p>
              <Link to={`/project/${role.project._id}`} className="mt-4 block text-sm font-medium text-white hover:text-[#afa9ec]">
                {role.project.title}
              </Link>
              <p className="mt-1 text-xs text-white/35">by @{role.project.owner?.username || "stacker"} • {role.project.status}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[...(role.project.techStack || []), ...(role.project.tools || [])].slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/40">
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                to={`/project/${role.project._id}`}
                className="mt-5 inline-flex w-full justify-center rounded-lg bg-[#7f77dd] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6f67ce]"
              >
                View and request
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Opportunities;
