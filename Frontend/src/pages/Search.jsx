import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const tabs = [
  { key: "all", label: "All" },
  { key: "projects", label: "Projects" },
  { key: "people", label: "People" },
  { key: "roles", label: "Roles" },
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState({ projects: [], users: [], roles: [] });
  const [loading, setLoading] = useState(false);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults({ projects: [], users: [], roles: [] });
        return;
      }

      try {
        setLoading(true);
        const res = await authFetch(`/api/projects/search/global?q=${encodeURIComponent(query)}&limit=12`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Search failed");
        setResults({ projects: data.projects || [], users: data.users || [], roles: data.roles || [] });
      } catch (error) {
        addToast(error.message, "error");
        setResults({ projects: [], users: [], roles: [] });
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, authFetch, addToast]);

  const total = results.projects.length + results.users.length + results.roles.length;

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title={`Search "${query}"`} subtitle={`${total} result${total === 1 ? "" : "s"} across StackLab`} />

      <div className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                activeTab === tab.key ? "bg-[#7f77dd] text-white" : "border border-white/10 bg-white/5 text-white/55 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {!query.trim() ? (
        <div className="p-8 text-center text-white/40">Search for projects, people, open roles, tools, or skills.</div>
      ) : loading ? (
        <div className="p-8 text-center text-white/40">Searching...</div>
      ) : total === 0 ? (
        <div className="p-8 text-center text-white/40">No results found.</div>
      ) : (
        <div className="space-y-8 p-4 sm:p-6">
          {(activeTab === "all" || activeTab === "projects") && <ProjectResults projects={results.projects} />}
          {(activeTab === "all" || activeTab === "people") && <UserResults users={results.users} />}
          {(activeTab === "all" || activeTab === "roles") && <RoleResults roles={results.roles} />}
        </div>
      )}
    </main>
  );
};

const Section = ({ title, count, children }) => {
  if (!count) return null;

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/35">{title}</h2>
      {children}
    </section>
  );
};

const ProjectResults = ({ projects }) => (
  <Section title="Projects" count={projects.length}>
    <div className="grid gap-3 lg:grid-cols-2">
      {projects.map((project) => (
        <Link key={project._id} to={`/project/${project._id}`} className="rounded-lg border border-white/10 bg-[#111118] p-4 hover:border-[#7f77dd]/35">
          <span className="rounded-md bg-[#7f77dd]/15 px-2 py-1 text-[11px] text-[#afa9ec]">{project.category}</span>
          <h3 className="mt-3 font-semibold text-white">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/45">{project.description}</p>
          <p className="mt-3 text-xs text-white/30">by @{project.owner?.username || "stacker"} • {project.status}</p>
        </Link>
      ))}
    </div>
  </Section>
);

const UserResults = ({ users }) => (
  <Section title="People" count={users.length}>
    <div className="grid gap-3 lg:grid-cols-2">
      {users.map((user) => (
        <Link key={user._id} to={`/profile/${user.username}`} className="flex gap-3 rounded-lg border border-white/10 bg-[#111118] p-4 hover:border-[#7f77dd]/35">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7f77dd]/25 text-sm font-semibold text-[#afa9ec]">
            {(user.username?.slice(0, 2) || "SL").toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white">@{user.username}</h3>
            <p className="mt-1 text-sm text-white/40">{user.fullName || user.roles?.[0] || "StackLab member"}</p>
            {user.bio ? <p className="mt-2 line-clamp-2 text-xs text-white/35">{user.bio}</p> : null}
          </div>
        </Link>
      ))}
    </div>
  </Section>
);

const RoleResults = ({ roles }) => (
  <Section title="Open Roles" count={roles.length}>
    <div className="grid gap-3 lg:grid-cols-2">
      {roles.map((role) => (
        <Link key={`${role.project._id}-${role._id}`} to={`/project/${role.project._id}`} className="rounded-lg border border-white/10 bg-[#111118] p-4 hover:border-[#7f77dd]/35">
          <span className="rounded-full bg-[#1d9e75]/12 px-2.5 py-1 text-[11px] text-[#6ee7bf]">Open role</span>
          <h3 className="mt-3 font-semibold text-white">{role.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/45">{role.description}</p>
          <p className="mt-3 text-xs text-white/30">{role.project.title} • @{role.project.owner?.username || "stacker"}</p>
        </Link>
      ))}
    </div>
  </Section>
);

export default Search;
