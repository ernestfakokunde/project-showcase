import { Link } from "react-router-dom";

const Topbar = ({
  variant = "search",
  title,
  subtitle,
  onMarkAllRead,
  showNotifDot = false,
  onBack,
  breadcrumb,
}) => {
  if (variant === "title") {
    return (
      <div className="flex items-center justify-between border-b border-white/10 px-7 py-[14px]">
        <div>
          <div className="text-[15px] font-medium text-white">{title || ""}</div>
          {subtitle ? <div className="text-xs text-white/30">{subtitle}</div> : null}
        </div>
        {onMarkAllRead ? (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[12px] text-[#7f77dd]/80"
          >
            Mark all as read
          </button>
        ) : null}
      </div>
    );
  }

  if (variant === "breadcrumb") {
    return (
      <div className="flex items-center gap-3 border-b border-white/10 px-7 py-[14px]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-[5px] text-[13px] text-white/40"
        >
          <BackIcon className="h-3.5 w-3.5" /> Back
        </button>
        <div className="text-[13px] text-white/25">
          {breadcrumb?.base || ""}
          <span className="text-white/60">{breadcrumb?.detail ? ` / ${breadcrumb.detail}` : ""}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[14px] border-b border-white/10 px-6 py-[14px]">
      <div className="flex h-[34px] w-full max-w-[380px] items-center gap-2 rounded-[9px] border border-white/10 bg-white/5 px-3">
        <SearchIcon className="h-[14px] w-[14px] text-white/30" />
        <input
          type="search"
          placeholder="Search projects, people, stacks..."
          className="h-full w-full bg-transparent text-[13px] text-white/60 placeholder:text-white/25 focus:outline-none"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button type="button" className="rounded-[8px] border border-white/10 bg-white/5 px-[14px] py-[6px] text-[12px] text-white/55">
          Filters
        </button>
        <div className="relative flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/10 bg-white/5">
          <BellIcon className="h-[15px] w-[15px] text-white/50" />
          {showNotifDot ? <span className="absolute right-[5px] top-[5px] h-1.5 w-1.5 rounded-full bg-[#d85a30]" /> : null}
        </div>
        <Link
          to="/post-project"
          className="rounded-[8px] bg-[#7f77dd] px-4 py-[6px] text-[12px] font-medium text-white"
        >
          + Post project
        </Link>
      </div>
    </div>
  );
};

const SearchIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 1a5 5 0 015 5v3l1 2H2l1-2V6a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" />
    <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const BackIcon = ({ className }) => (
  <svg viewBox="0 0 14 14" fill="none" className={className}>
    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default Topbar;
