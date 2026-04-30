import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user, logout } = useAuth();
  const {
    notifCount,
    requestCount,
    sidebarCollapsed,
    toggleSidebar,
  } = useApp();

  // Handle responsive sidebar collapse
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-[#09090e]">
      {/* Sidebar - Hidden on mobile when collapsed */}
      <div className={`${isMobile ? "hidden" : ""} shrink-0`}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={toggleSidebar} 
          user={user} 
          logout={logout} 
          notifCount={notifCount} 
          requestCount={requestCount}
          isMobile={isMobile}
        />
      </div>
      
      {/* Mobile sidebar overlay */}
      {isMobile && !sidebarCollapsed && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => toggleSidebar()}
          />
          <Sidebar 
            collapsed={sidebarCollapsed} 
            setCollapsed={toggleSidebar} 
            user={user} 
            logout={logout} 
            notifCount={notifCount} 
            requestCount={requestCount}
            isMobile={isMobile}
          />
        </>
      )}
      
      {/* Main Content */}
      <div className="flex h-dvh min-h-0 flex-1 flex-col w-full">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
