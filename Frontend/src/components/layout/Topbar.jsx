import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const Topbar = ({
  variant = "search",
  title,
  subtitle,
  onMarkAllRead,
  showNotifDot = false,
  onBack,
  breadcrumb,
  onToggleSidebar,
}) => {
  const { openProjectModal, openDesignModal, toggleSidebar, notifCount } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const shouldShowNotifDot = showNotifDot || notifCount > 0;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleToggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      toggleSidebar();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };
  if (variant === "title") {
    return (
      <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-3 sm:py-[14px]">
        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              type="button"
              onClick={handleToggleSidebar}
              className="flex items-center justify-center p-2 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 flex-shrink-0"
              aria-label="Open menu"
            >
              <MenuIcon className="h-4 w-4" />
            </button>
          )}
          <div>
            <div className="text-[14px] sm:text-[15px] font-medium text-white">{title || ""}</div>
            {subtitle ? <div className="text-[11px] sm:text-xs text-white/30">{subtitle}</div> : null}
          </div>
        </div>
        {onMarkAllRead ? (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[11px] sm:text-[12px] text-[#7f77dd]/80 whitespace-nowrap ml-2"
          >
            Mark read
          </button>
        ) : null}
      </div>
    );
  }

  if (variant === "breadcrumb") {
    return (
      <div className="flex items-center gap-2 sm:gap-3 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-[14px]">
        {isMobile && (
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="flex items-center justify-center p-2 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 flex-shrink-0"
            aria-label="Open menu"
          >
            <MenuIcon className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 sm:px-3 py-[5px] text-[12px] sm:text-[13px] text-white/40 hover:bg-white/10 flex-shrink-0"
        >
          <BackIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> Back
        </button>
        <div className="text-[12px] sm:text-[13px] text-white/25 truncate">
          {breadcrumb?.base || ""}
          <span className="text-white/60">{breadcrumb?.detail ? ` / ${breadcrumb.detail}` : ""}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-[14px] border-b border-white/10 px-4 sm:px-6 py-2 sm:py-[14px]">
      {isMobile && (
        <button
          type="button"
          onClick={handleToggleSidebar}
          className="flex items-center justify-center p-2 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 flex-shrink-0"
          aria-label="Open menu"
        >
          <MenuIcon className="h-4 w-4" />
        </button>
      )}
      <form onSubmit={handleSearch} className="flex h-[32px] sm:h-[34px] w-full max-w-[280px] sm:max-w-[380px] items-center gap-2 rounded-[8px] sm:rounded-[9px] border border-white/10 bg-white/5 px-2 sm:px-3">
        <SearchIcon className="h-[13px] sm:h-[14px] w-[13px] sm:w-[14px] text-white/30 flex-shrink-0" />
        <input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-full w-full bg-transparent text-[12px] sm:text-[13px] text-white/60 placeholder:text-white/25 focus:outline-none"
        />
      </form>
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button type="button" className="hidden sm:block rounded-[8px] border border-white/10 bg-white/5 px-[12px] py-[6px] text-[11px] sm:text-[12px] text-white/55 hover:bg-white/10">
          Filters
        </button>
        <a href="/notifications" className="relative flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/10 bg-white/5 hover:bg-white/10">
          <BellIcon className="h-[14px] sm:h-[15px] w-[14px] sm:w-[15px] text-white/50" />
          {shouldShowNotifDot ? <span className="absolute right-[5px] top-[5px] h-1.5 w-1.5 rounded-full bg-[#d85a30]" /> : null}
        </a>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPostMenu(!showPostMenu)}
            className="rounded-[8px] bg-[#7f77dd] px-3 sm:px-4 py-[6px] text-[11px] sm:text-[12px] font-medium text-white hover:bg-[#7f77dd]/90 whitespace-nowrap flex items-center gap-1"
          >
            + Post
            <svg className={`w-3 h-3 transition ${showPostMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          
          {showPostMenu && (
            <div className="absolute top-full right-0 mt-2 w-40 rounded-lg border border-white/10 bg-[#111118] shadow-lg z-50">
              <button
                onClick={() => {
                  openProjectModal();
                  setShowPostMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 rounded-t-lg transition first:rounded-t-lg"
              >
                Post a Project
              </button>
              <div className="border-t border-white/10" />
              <button
                onClick={() => {
                  openDesignModal();
                  setShowPostMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 rounded-b-lg transition last:rounded-b-lg"
              >
                Post a Design
              </button>
            </div>
          )}
        </div>
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

const MenuIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default Topbar;
