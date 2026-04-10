const CommunityLinks = ({ links = [], isCollaborator = false }) => {
  if (!links.length) {
    return <div className="text-[12px] text-white/30">No links added yet</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <div key={link.label} className="flex items-center gap-[10px] rounded-[9px] border border-white/10 bg-[#111118] px-[14px] py-[10px]">
          <div className={`flex h-5 w-5 items-center justify-center rounded-[5px] ${link.icon === "discord" ? "bg-[rgba(88,101,242,0.2)]" : "bg-white/10"}`}>
            <LinkIcon className="h-3 w-3 text-white/60" />
          </div>
          <span className="text-[12px] text-white/50">{link.label}</span>
          {isCollaborator ? (
            <a href={link.url} className="ml-auto text-[11px] text-[#7f77dd]">Open</a>
          ) : (
            <span className="ml-auto flex items-center gap-1 text-[10px] text-white/20">
              <LockIcon className="h-3 w-3" /> Unlocks on acceptance
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const LinkIcon = ({ className }) => (
  <svg viewBox="0 0 12 12" fill="none" className={className}>
    <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 11s1-3 5-3 5 3 5 3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg viewBox="0 0 12 12" fill="none" className={className}>
    <rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4 5V4a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export default CommunityLinks;
