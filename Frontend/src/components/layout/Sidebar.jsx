import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/feed", label: "Feed", icon: FeedIcon },
  { to: "/trending", label: "Trending", icon: TrendingIcon },
  { to: "/saved", label: "Saved", icon: SavedIcon },
  { to: "/my-projects", label: "My projects", icon: ProjectsIcon },
];

const collaborateItems = [
  { to: "/requests", label: "Requests", icon: RequestsIcon, badgeKey: "requestCount" },
  { to: "/messages", label: "Messages", icon: MessagesIcon },
  { to: "/notifications", label: "Notifications", icon: ActivityIcon, badgeKey: "notifCount" },
];

const categoryItems = [
  { to: "/feed?category=Dev", label: "Dev", icon: DevIcon },
  { to: "/feed?category=Design", label: "Design", icon: DesignIcon },
  { to: "/feed?category=Web3", label: "Web3", icon: Web3Icon },
  { to: "/feed?category=AI/ML", label: "AI / ML", icon: AiIcon },
  { to: "/feed?category=Game%20dev", label: "Game dev", icon: GameIcon },
];

const Sidebar = ({ collapsed = false, setCollapsed, user, notifCount = 0, requestCount = 0 }) => {
  const initials = (user?.initials || user?.username?.slice(0, 2) || "SL").toUpperCase();

  return (
    <aside
      className={`flex min-h-screen flex-col border-r border-white/10 bg-[#0d0d14] transition-all duration-200 ${
        collapsed ? "w-[60px]" : "w-[220px]"
      }`}
    >
      <div className="flex items-center gap-[9px] border-b border-white/10 px-[18px] py-[20px]">
        <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] bg-[#7f77dd]">
          <GridIcon className="h-4 w-4 text-white" />
        </div>
        {!collapsed ? (
          <span className="text-[15px] font-medium tracking-[-0.3px] text-white">
            Stack<span className="text-[#7f77dd]">Lab</span>
          </span>
        ) : null}
      </div>

      {setCollapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="mx-3 mt-3 flex h-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/50 hover:border-white/20"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronIcon className={`h-3.5 w-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      ) : null}

      <SidebarSection title="Menu" collapsed={collapsed} items={menuItems} />
      <Divider />
      <SidebarSection
        title="Collaborate"
        collapsed={collapsed}
        items={collaborateItems.map((item) => ({
          ...item,
          badge: item.badgeKey === "notifCount" ? notifCount : item.badgeKey === "requestCount" ? requestCount : 0,
        }))}
      />
      <Divider />
      <SidebarSection title="Categories" collapsed={collapsed} items={categoryItems} />

      <div className="mt-auto border-t border-white/10 px-3 py-[14px]">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}>
          <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#7f77dd]/25 text-[11px] font-medium text-[#afa9ec]">
            {initials}
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#1d9e75]" />
          </div>
          {!collapsed ? (
            <div className="flex-1">
              <div className="text-[12px] font-medium text-white">@{user?.username || "yourhandle"}</div>
              <div className="text-[11px] text-white/30">{user?.role || user?.roles?.[0] || "Developer"}</div>
            </div>
          ) : null}
          {!collapsed ? <div className="h-1.5 w-1.5 rounded-full bg-[#1d9e75]" /> : null}
        </div>
      </div>
    </aside>
  );
};

const SidebarSection = ({ title, collapsed, items = [] }) => {
  if (!items.length) return null;

  return (
    <div className="px-3 pb-2 pt-4">
      {!collapsed ? (
        <p className="px-[6px] text-[10px] uppercase tracking-[1.2px] text-white/25">{title}</p>
      ) : null}
      <div className="mt-[6px]">
        {items.map((item) => (
          <SidebarItem key={item.to} collapsed={collapsed} {...item} />
        ))}
      </div>
    </div>
  );
};

const SidebarItem = ({ to, label, icon: Icon, collapsed, badge = 0 }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `mb-[2px] flex items-center rounded-[8px] px-[10px] py-[8px] text-[13px] transition ${
          collapsed ? "justify-center" : "gap-[10px]"
        } ${
          isActive
            ? "bg-[#7f77dd]/15 text-[#afa9ec]"
            : "text-white/45 hover:bg-white/5"
        }`
      }
    >
      <Icon className={`h-[15px] w-[15px] shrink-0 ${collapsed ? "opacity-80" : "opacity-50"}`} />
      {!collapsed ? <span className="text-[13px]">{label}</span> : null}
      {!collapsed && badge > 0 ? (
        <span className="ml-auto rounded-full bg-[#7f77dd]/20 px-[7px] py-[2px] text-[10px] text-[#afa9ec]">
          {badge}
        </span>
      ) : null}
    </NavLink>
  );
};

const Divider = () => <div className="mx-3 h-px bg-white/10" />;

const GridIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
  </svg>
);

const iconClass = "h-[15px] w-[15px]";

function FeedIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

function TrendingIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <line x1="8" y1="5" x2="8" y2="8" stroke="currentColor" strokeWidth="1.3" />
      <line x1="8" y1="8" x2="10" y2="10" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function SavedIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M13 11l-5-3-5 3V4a1 1 0 011-1h8a1 1 0 011 1v7z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ProjectsIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1l2 4 5 .7-3.5 3.4.8 4.9L8 12l-4.3 2 .8-4.9L1 5.7 6 5z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function RequestsIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 14s1-4 5-4 5 4 5 4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11 7c1.5 0 3 .7 3 3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function MessagesIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M14 10c0 1-1 2-2 2H4l-3 3V4c0-.6.6-1 1-1h9c1 0 2 1 2 2v6z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ActivityIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1a5 5 0 015 5v3l1 2H2l1-2V6a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function DevIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function DesignIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function Web3Icon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <polygon points="8,2 14,12 2,12" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function AiIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function GameIcon({ className = iconClass }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 12l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

const ChevronIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Sidebar;
