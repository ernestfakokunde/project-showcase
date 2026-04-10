import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { notifCount, requestCount } = useApp();
  const location = useLocation();

  const hideSearchTopbar = ["/notifications", "/post-project", "/project", "/profile"].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex min-h-screen bg-[#09090e]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} user={user} notifCount={notifCount} requestCount={requestCount} />
      <div className="flex min-h-screen flex-1 flex-col">
        {!hideSearchTopbar ? <Topbar showNotifDot={notifCount > 0} /> : null}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
