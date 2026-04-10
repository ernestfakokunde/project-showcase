const ProjectGrid = ({ projects = [] }) => {
  if (!projects.length) {
    return (
      <div className="rounded-[12px] border border-white/10 bg-[#111118] p-6 text-center text-[12px] text-white/40">
        No projects yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {projects.map((project) => {
        const tags = project.tags || project.techStack || [];
        return (
          <div key={project._id || project.title} className="cursor-pointer overflow-hidden rounded-[12px] border border-white/10 bg-[#111118] transition hover:border-[#7f77dd]/30">
            <div className={`flex h-[80px] items-center justify-center ${bannerClass(project.category)}`}>
              <ProjectIcon category={project.category} className="h-10 w-10" />
            </div>
            <div className="px-3 py-[10px]">
              <div className="mb-[3px] text-[13px] font-medium text-white">{project.title || "Untitled"}</div>
              <div className="mb-2 text-[11px] leading-[1.5] text-white/35">{project.description || "No description"}</div>
              <div className="flex flex-wrap gap-[5px]">
                {tags.length ? (
                  tags.map((tag) => (
                    <span key={tag} className="rounded-[5px] bg-white/5 px-[7px] py-[2px] text-[10px] text-white/35">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-white/30">No tags</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 px-3 py-[7px]">
              <span className="flex items-center gap-1 text-[11px] text-white/25">
                <HeartIcon className="h-3 w-3" /> {project.likes || 0}
              </span>
              <span className={`rounded-[5px] px-[7px] py-[2px] text-[10px] ${badgeClass(project.role)}`}>
                {project.role || "Owner"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const HeartIcon = ({ className }) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
    <path d="M6 10s-5-3-5-6a3 3 0 016 0 3 3 0 016 0c0 3-5 6-5 6z" />
  </svg>
);

const bannerClass = (category = "") => {
  const key = category.toLowerCase();
  if (key.includes("design")) return "bg-[rgba(29,158,117,0.1)]";
  if (key.includes("web3")) return "bg-[rgba(216,90,48,0.1)]";
  if (key.includes("ai")) return "bg-[rgba(52,122,221,0.1)]";
  return "bg-[rgba(127,119,221,0.1)]";
};

const badgeClass = (role) => {
  if (role?.toLowerCase().includes("collab")) return "bg-[rgba(29,158,117,0.12)] text-[#5dcaa5]";
  return "bg-[rgba(127,119,221,0.12)] text-[#afa9ec]";
};

const ProjectIcon = ({ category, className }) => {
  const key = (category || "").toLowerCase();
  if (key.includes("design")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className={className}>
        <circle cx="20" cy="20" r="12" stroke="#5dcaa5" strokeWidth="1.2" fill="none" opacity="0.5" />
        <circle cx="20" cy="20" r="5" fill="#5dcaa5" opacity="0.4" />
      </svg>
    );
  }
  if (key.includes("web3")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className={className}>
        <polygon points="20,8 34,30 6,30" stroke="#f0997b" strokeWidth="1.2" fill="none" opacity="0.5" />
        <polygon points="20,14 28,28 12,28" fill="#f0997b" opacity="0.3" />
      </svg>
    );
  }
  if (key.includes("ai")) {
    return (
      <svg viewBox="0 0 40 40" fill="none" className={className}>
        <rect x="10" y="10" width="20" height="20" rx="3" stroke="#85b7eb" strokeWidth="1.2" fill="none" opacity="0.5" />
        <circle cx="20" cy="20" r="6" fill="#85b7eb" opacity="0.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="5" y="5" width="13" height="13" rx="3" fill="#7f77dd" opacity="0.5" />
      <rect x="22" y="5" width="13" height="13" rx="3" fill="#7f77dd" opacity="0.3" />
      <rect x="5" y="22" width="13" height="13" rx="3" fill="#7f77dd" opacity="0.3" />
      <rect x="22" y="22" width="13" height="13" rx="3" fill="#7f77dd" opacity="0.5" />
    </svg>
  );
};

export default ProjectGrid;
