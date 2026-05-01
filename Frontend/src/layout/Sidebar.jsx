 // components/layout/Sidebar.jsx

import { NavLink } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const Sidebar = ({ collapsed, setCollapsed, user }) => {
  const { isDark, toggleTheme } = useTheme()
  return (
    <aside style={{ ...styles.sidebar, width: collapsed ? "60px" : "220px" }}>

      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/>
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
          </svg>
        </div>
        {!collapsed && (
          <span style={styles.logoText}>
            Stack<span style={styles.logoAccent}>Lab</span>
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <div style={styles.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
          {collapsed
            ? <path d="M6 3l5 5-5 5"/>
            : <path d="M10 3l-5 5 5 5"/>
          }
        </svg>
      </div>

      {/* Menu section */}
      <div style={styles.section}>
        {!collapsed && <p style={styles.sectionLabel}>Menu</p>}

        <SidebarItem to="/feed" collapsed={collapsed} label="Feed">
          <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
          </svg>
        </SidebarItem>

        <SidebarItem to="/trending" collapsed={collapsed} label="Trending">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <circle cx="8" cy="8" r="6"/>
            <line x1="8" y1="5" x2="8" y2="8"/>
            <line x1="8" y1="8" x2="10" y2="10"/>
          </svg>
        </SidebarItem>

        <SidebarItem to="/saved" collapsed={collapsed} label="Saved">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <path d="M13 11l-5-3-5 3V4a1 1 0 011-1h8a1 1 0 011 1v7z"/>
          </svg>
        </SidebarItem>

        <SidebarItem to="/my-projects" collapsed={collapsed} label="My projects">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <path d="M8 1l2 4 5 .7-3.5 3.4.8 4.9L8 12l-4.3 2 .8-4.9L1 5.7 6 5z"/>
          </svg>
        </SidebarItem>
      </div>

      <div style={styles.divider}/>

      {/* Collaborate section */}
      <div style={styles.section}>
        {!collapsed && <p style={styles.sectionLabel}>Collaborate</p>}

        <SidebarItem to="/requests" collapsed={collapsed} label="Requests" badge={user?.requestCount}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <circle cx="6" cy="5" r="3"/>
            <path d="M1 14s1-4 5-4 5 4 5 4"/>
            <path d="M11 7c1.5 0 3 .7 3 3"/>
          </svg>
        </SidebarItem>

        <SidebarItem to="/messages" collapsed={collapsed} label="Messages">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <path d="M14 10c0 1-1 2-2 2H4l-3 3V4c0-.6.6-1 1-1h9c1 0 2 1 2 2v6z"/>
          </svg>
        </SidebarItem>

        <SidebarItem to="/notifications" collapsed={collapsed} label="Activity" badge={user?.notifCount}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <path d="M8 1a5 5 0 015 5v3l1 2H2l1-2V6a5 5 0 015-5z"/>
            <path d="M6.5 13a1.5 1.5 0 003 0"/>
          </svg>
        </SidebarItem>
      </div>

      <div style={styles.divider}/>

      {/* Admin section */}
      {user?.role === 'admin' && (
        <div style={styles.section}>
          {!collapsed && <p style={styles.sectionLabel}>Admin</p>}
          <SidebarItem to="/admin" collapsed={collapsed} label="Admin Panel">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
              <circle cx="8" cy="4" r="2.5"/>
              <path d="M3 13c0-2 2-3 5-3s5 1 5 3"/>
              <rect x="2" y="1" width="12" height="14" rx="1.5"/>
            </svg>
          </SidebarItem>
        </div>
      )}

      <div style={styles.divider}/>

      {/* Categories section */}
      <div style={styles.section}>
        {!collapsed && <p style={styles.sectionLabel}>Categories</p>}

        <SidebarItem to="/feed?category=dev" collapsed={collapsed} label="Dev">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <rect x="2" y="3" width="12" height="10" rx="1.5"/>
            <path d="M5 7h6M5 10h4"/>
          </svg>
        </SidebarItem>

        <SidebarItem to="/feed?category=design" collapsed={collapsed} label="Design">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <circle cx="8" cy="8" r="3"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2"/>
          </svg>
        </SidebarItem>

        <SidebarItem to="/feed?category=web3" collapsed={collapsed} label="Web3">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <polygon points="8,2 14,12 2,12"/>
          </svg>
        </SidebarItem>

        <SidebarItem to="/feed?category=ai" collapsed={collapsed} label="AI / ML">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <rect x="2" y="2" width="5" height="5" rx="1"/>
            <rect x="9" y="2" width="5" height="5" rx="1"/>
            <rect x="2" y="9" width="5" height="5" rx="1"/>
            <rect x="9" y="9" width="5" height="5" rx="1"/>
          </svg>
        </SidebarItem>

        <SidebarItem to="/feed?category=gamedev" collapsed={collapsed} label="Game dev">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" width="15" height="15">
            <path d="M2 12l4-4 3 3 5-6"/>
          </svg>
        </SidebarItem>
      </div>

      {/* User section */}
      <div style={styles.userSection}>
        {!collapsed && (
          <button
            onClick={toggleTheme}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "12px",
              background: isDark ? "rgba(127,119,221,0.1)" : "rgba(127,119,221,0.15)",
              border: "1px solid rgba(127,119,221,0.3)",
              borderRadius: "6px",
              color: "#afa9ec",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => e.target.style.background = isDark ? "rgba(127,119,221,0.15)" : "rgba(127,119,221,0.2)"}
            onMouseOut={(e) => e.target.style.background = isDark ? "rgba(127,119,221,0.1)" : "rgba(127,119,221,0.15)"}
          >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        )}
        {collapsed && (
          <button
            onClick={toggleTheme}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "12px",
              background: "rgba(127,119,221,0.1)",
              border: "none",
              borderRadius: "6px",
              color: "#afa9ec",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        )}
        {user ? (
          <div style={styles.userRow}>
            <div style={styles.avatar}>{user.initials}</div>
            {!collapsed && (
              <div style={styles.userInfo}>
                <p style={styles.userName}>@{user.username}</p>
                <p style={styles.userRole}>{user.role}</p>
              </div>
            )}
            {!collapsed && <div style={styles.onlineDot}/>}
          </div>
        ) : null}
      </div>

    </aside>
  )
}

// Reusable sidebar item
const SidebarItem = ({ to, label, collapsed, badge, children }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...itemStyles.item,
        ...(isActive ? itemStyles.active : {}),
        justifyContent: collapsed ? "center" : "flex-start",
      })}
    >
      <span style={itemStyles.icon}>{children}</span>
      {!collapsed && <span style={itemStyles.label}>{label}</span>}
      {!collapsed && badge > 0 && (
        <span style={itemStyles.badge}>{badge}</span>
      )}
    </NavLink>
  )
}

const styles = {
  sidebar: {
    minHeight: "100vh",
    background: "#0d0d14",
    borderRight: "0.5px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    transition: "width 0.25s ease",
    overflow: "hidden",
  },
  logo: {
    padding: "20px 18px 16px",
    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },
  logoIcon: {
    width: "28px",
    height: "28px",
    background: "#7f77dd",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#fff",
    letterSpacing: "-0.3px",
    whiteSpace: "nowrap",
  },
  logoAccent: { color: "#7f77dd" },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    cursor: "pointer",
    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
  },
  section: { padding: "16px 12px 8px" },
  sectionLabel: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.25)",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    padding: "0 6px",
    marginBottom: "6px",
  },
  divider: {
    height: "0.5px",
    background: "rgba(255,255,255,0.06)",
    margin: "8px 12px",
  },
  userSection: {
    padding: "14px 12px",
    marginTop: "auto",
    borderTop: "0.5px solid rgba(255,255,255,0.06)",
  },
  userRow: { display: "flex", alignItems: "center", gap: "9px" },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "rgba(127,119,221,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 500,
    color: "#afa9ec",
    flexShrink: 0,
  },
  userInfo: { flex: 1, overflow: "hidden" },
  userName: { fontSize: "12px", fontWeight: 500, color: "#fff", whiteSpace: "nowrap" },
  userRole: { fontSize: "11px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" },
  onlineDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#1d9e75", flexShrink: 0 },
}

const itemStyles = {
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "2px",
    textDecoration: "none",
    color: "rgba(255,255,255,0.45)",
    fontSize: "13px",
    transition: "background 0.15s ease",
  },
  active: {
    background: "rgba(127,119,221,0.15)",
    color: "#afa9ec",
  },
  icon: { flexShrink: 0, display: "flex", alignItems: "center" },
  label: { whiteSpace: "nowrap" },
  badge: {
    marginLeft: "auto",
    background: "rgba(127,119,221,0.2)",
    color: "#afa9ec",
    fontSize: "10px",
    padding: "2px 7px",
    borderRadius: "100px",
  },
}

export default Sidebar