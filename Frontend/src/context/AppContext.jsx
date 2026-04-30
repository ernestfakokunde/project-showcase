import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, authFetch } = useAuth();
  const { socket, connected } = useSocket();
  const [notifCount, setNotifCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const refreshCounts = useCallback(async () => {
    if (!user?._id) {
      setNotifCount(0);
      setRequestCount(0);
      return;
    }

    try {
      const res = await authFetch("/api/users/me");
      const data = await res.json();

      if (!res.ok) {
        return;
      }

      setNotifCount(data?.counts?.unreadNotifications || 0);
      setRequestCount(data?.counts?.pendingRequests || 0);
    } catch {
      // Keep existing UI state if count refresh fails.
    }
  }, [authFetch, user?._id]);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  useEffect(() => {
    if (!user?._id) {
      return undefined;
    }

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === "visible") {
        refreshCounts();
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshCounts();
      }
    }, 15000);

    window.addEventListener("focus", refreshCounts);
    document.addEventListener("visibilitychange", handleVisibilityRefresh);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshCounts);
      document.removeEventListener("visibilitychange", handleVisibilityRefresh);
    };
  }, [refreshCounts, user?._id]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleRealtimeUpdate = () => {
      refreshCounts();
    };

    socket.on("notifications:updated", handleRealtimeUpdate);
    socket.on("requests:updated", handleRealtimeUpdate);

    return () => {
      socket.off("notifications:updated", handleRealtimeUpdate);
      socket.off("requests:updated", handleRealtimeUpdate);
    };
  }, [refreshCounts, socket]);

  useEffect(() => {
    if (connected) {
      refreshCounts();
    }
  }, [connected, refreshCounts]);

  // Project Creation Form
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "",
    coverImage: "",
    techStack: [],
    tools: [],
    experienceLevel: "",
    projectStage: "",
    chain: "",
    roles: [],
    links: [],
  });

  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Design Creation Form
  const [designForm, setDesignForm] = useState({
    title: "",
    description: "",
    category: "UI Design",
    images: [],
    tools: [],
    tags: [],
    links: [],
  });

  const [designLoading, setDesignLoading] = useState(false);
  const [designError, setDesignError] = useState("");
  const [showDesignModal, setShowDesignModal] = useState(false);

  const openDesignModal = () => setShowDesignModal(true);

  const closeDesignModal = () => {
    setShowDesignModal(false);
    resetDesignForm();
  };

  // Update design field
  const updateDesignField = (field, value) => {
    setDesignForm((prev) => ({ ...prev, [field]: value }));
    setDesignError("");
  };

  // Add item to design array field
  const addToDesignArray = (field, item) => {
    setDesignForm((prev) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  // Remove item from design array field
  const removeFromDesignArray = (field, index) => {
    setDesignForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Update design array item
  const updateDesignArrayItem = (field, index, updatedItem) => {
    setDesignForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? updatedItem : item)),
    }));
  };

  // Reset design form
  const resetDesignForm = () => {
    setDesignForm({
      title: "",
      description: "",
      category: "UI Design",
      images: [],
      tools: [],
      tags: [],
      links: [],
    });
    setDesignError("");
  };

  // Submit design form
  const submitDesignForm = async (token) => {
    if (!designForm.title.trim()) {
      setDesignError("Title is required");
      return null;
    }
    if (!designForm.description.trim()) {
      setDesignError("Description is required");
      return null;
    }
    if (designForm.images.length === 0) {
      setDesignError("Add at least one image");
      return null;
    }

    setDesignLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(designForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setDesignError(data.message || "Error creating design");
        setDesignLoading(false);
        return null;
      }

      resetDesignForm();
      setDesignLoading(false);
      return data.design._id;
    } catch (error) {
      setDesignError(error.message);
      setDesignLoading(false);
      return null;
    }
  };

  const openProjectModal = () => setShowProjectModal(true);
  
  const closeProjectModal = () => {
    setShowProjectModal(false);
    resetProjectForm();
  };

  // Update form field
  const updateProjectField = (field, value) => {
    setProjectForm((prev) => ({ ...prev, [field]: value }));
    setProjectError(""); // Clear error on change
  };

  // Add item to array field
  const addToProjectArray = (field, item) => {
    setProjectForm((prev) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  // Remove item from array field
  const removeFromProjectArray = (field, index) => {
    setProjectForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Reset form
  const resetProjectForm = () => {
    setProjectForm({
      title: "",
      description: "",
      category: "",
      coverImage: "",
      techStack: [],
      tools: [],
      experienceLevel: "",
      projectStage: "",
      chain: "",
      roles: [],
      links: [],
    });
    setProjectError("");
  };

  // Submit form
  const submitProjectForm = async (token) => {
    // Basic validation
    if (!projectForm.title.trim()) {
      setProjectError("Title is required");
      return null;
    }
    if (!projectForm.description.trim()) {
      setProjectError("Description is required");
      return null;
    }
    if (!projectForm.category) {
      setProjectError("Category is required");
      return null;
    }
    if (projectForm.roles.length === 0) {
      setProjectError("Add at least one role");
      return null;
    }

    const invalidRole = projectForm.roles.find(
      (role) => !role?.title?.trim() || !role?.description?.trim()
    );
    if (invalidRole) {
      setProjectError("Each role needs a title and description");
      return null;
    }

    const invalidLink = projectForm.links.find(
      (link) => (link?.label?.trim() && !link?.url?.trim()) || (!link?.label?.trim() && link?.url?.trim())
    );
    if (invalidLink) {
      setProjectError("Each link must have both a label and a URL");
      return null;
    }

    setProjectLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setProjectError(data.error || data.message || "Error creating project");
        setProjectLoading(false);
        return null;
      }

      resetProjectForm();
      setProjectLoading(false);
      return data.project._id; // Return project ID
    } catch (error) {
      setProjectError(error.message || "Error creating project");
      setProjectLoading(false);
      return null;
    }
  };

  const value = useMemo(
    () => ({
      notifCount,
      setNotifCount,
      requestCount,
      setRequestCount,
      refreshCounts,
      sidebarCollapsed,
      toggleSidebar,
      projectForm,
      projectLoading,
      projectError,
      showProjectModal,
      updateProjectField,
      addToProjectArray,
      removeFromProjectArray,
      resetProjectForm,
      submitProjectForm,
      openProjectModal,
      closeProjectModal,
      designForm,
      designLoading,
      designError,
      showDesignModal,
      updateDesignField,
      addToDesignArray,
      removeFromDesignArray,
      updateDesignArrayItem,
      resetDesignForm,
      submitDesignForm,
      openDesignModal,
      closeDesignModal,
    }),
    [
      notifCount,
      requestCount,
      refreshCounts,
      sidebarCollapsed,
      projectForm,
      projectLoading,
      projectError,
      showProjectModal,
      designForm,
      designLoading,
      designError,
      showDesignModal,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

export default AppContext;
