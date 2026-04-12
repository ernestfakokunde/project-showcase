import { useMemo, useState } from "react";

const categories = [
  { label: "Dev", value: "Dev" },
  { label: "Design", value: "Design" },
  { label: "Web3", value: "Web3" },
  { label: "AI / ML", value: "AI / ML" },
  { label: "Game dev", value: "Game dev" },
  { label: "Mobile", value: "Mobile" },
  { label: "Data", value: "Data" },
  { label: "Research", value: "Research" },
];

const CreatePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Dev");
  const [title, setTitle] = useState("SaaS Dashboard Builder");
  const [description, setDescription] = useState(
    "An open source drag-and-drop dashboard builder for SaaS analytics. Building a modular component system so teams can assemble analytics views without boilerplate."
  );
  const [roles, setRoles] = useState(["UI/UX designer", "Full stack developer", "Product manager"]);
  const [roleInput, setRoleInput] = useState("");
  const [techStack, setTechStack] = useState({ frontend: "React, Tailwind", backend: "Node.js, Express", database: "MongoDB" });

  const handleAddRole = () => {
    const next = roleInput.trim();
    if (next && !roles.includes(next)) {
      setRoles((prev) => [...prev, next]);
    }
    setRoleInput("");
  };

  const categoryDetails = useMemo(
    () => ({
      Dev: "Frontend and backend developers, API experts, and system architects.",
      Design: "Product designers, UX writers, and brand specialists.",
      Web3: "Blockchain engineers, smart contract developers, and token designers.",
      "AI / ML": "Data scientists, ML engineers, and AI product leads.",
      "Game dev": "Game engine developers, artists, and gameplay designers.",
      Mobile: "iOS, Android, and cross-platform app developers.",
      Data: "Data engineers, analysts, and visualization experts.",
      Research: "Research leads, prototypers, and technical writers.",
    }),
    []
  );

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <div className="px-6 py-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Post a project</p>
            <h1 className="mt-2 text-2xl font-semibold">Share what you're building with the community</h1>
          </div>
        </div>

        <section className="rounded-[32px] border border-white/10 bg-[#111118] p-6">
          <div className="mb-8 flex items-center gap-4 text-sm text-slate-400">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7f77dd]/20 text-[#afa9ec]">✓</div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#111118] text-[#afa9ec]">2</div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-500">3</div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-500">4</div>
            <div className="ml-auto text-xs uppercase tracking-[0.24em] text-slate-500">Project details</div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 text-sm text-slate-400">Project category <span className="text-[#7f77dd]">*</span></div>
              <div className="grid gap-3 sm:grid-cols-4">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setSelectedCategory(category.value)}
                    className={`rounded-3xl border px-4 py-4 text-left transition ${
                      selectedCategory === category.value
                        ? "border-[#7f77dd]/50 bg-[#7f77dd]/10 text-[#afa9ec]"
                        : "border-white/10 bg-[#0d0d14] text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <div className="mb-2 text-lg">•</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Project title <span className="text-[#7f77dd]">*</span>
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-[#111118] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7f77dd]/50"
                placeholder="e.g. SaaS Analytics Dashboard"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Description <span className="text-[#7f77dd]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-[#111118] px-4 py-3 text-sm text-white outline-none transition focus:border-[#7f77dd]/50"
                placeholder="Describe your project, what you're building and what stage you're at..."
              />
            </div>

            <div className="rounded-3xl border border-[#7f77dd]/20 bg-[#111118] p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.28em] text-[#afa9ec]">{selectedCategory} — tech stack details</div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">Frontend</div>
                  <input
                    value={techStack.frontend}
                    onChange={(event) => setTechStack((prev) => ({ ...prev, frontend: event.target.value }))}
                    className="w-full rounded-3xl border border-white/10 bg-[#0d0d14] px-4 py-3 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">Backend</div>
                  <input
                    value={techStack.backend}
                    onChange={(event) => setTechStack((prev) => ({ ...prev, backend: event.target.value }))}
                    className="w-full rounded-3xl border border-white/10 bg-[#0d0d14] px-4 py-3 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">Database</div>
                  <input
                    value={techStack.database}
                    onChange={(event) => setTechStack((prev) => ({ ...prev, database: event.target.value }))}
                    className="w-full rounded-3xl border border-white/10 bg-[#0d0d14] px-4 py-3 text-sm text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm text-slate-400">Roles needed</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role) => (
                  <div key={role} className="rounded-3xl border border-white/10 bg-[#0d0d14] px-4 py-3 text-sm text-slate-200">
                    {role}
                  </div>
                ))}
                <div className="rounded-3xl border border-dashed border-white/20 bg-[#0d0d14] p-4">
                  <input
                    value={roleInput}
                    onChange={(event) => setRoleInput(event.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    placeholder="Add a role"
                    onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), handleAddRole())}
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="mt-3 inline-flex items-center rounded-2xl bg-[#7f77dd] px-4 py-2 text-sm text-white"
                  >
                    Add role
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm text-slate-400">Cover image</div>
              <div className="rounded-3xl border border-dashed border-white/15 bg-[#0d0d14] p-8 text-center text-sm text-slate-400">
                <div className="mx-auto mb-3 h-14 w-14 rounded-3xl bg-white/5" />
                <div className="text-sm">Drag and drop or upload an image</div>
                <div className="text-xs text-slate-500">PNG, JPG or GIF up to 5MB</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => window.history.back()} className="rounded-3xl border border-white/10 px-6 py-3 text-sm text-slate-300 transition hover:border-white/20">
              Back
            </button>
            <button type="button" onClick={() => alert('Continue to next step')} className="rounded-3xl bg-[#7f77dd] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6c66c7]">
              Continue to roles & links
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CreatePage;
