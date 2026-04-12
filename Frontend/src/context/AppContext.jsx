import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notifCount, setNotifCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

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
        setProjectError(data.message || "Error creating project");
        setProjectLoading(false);
        return null;
      }

      resetProjectForm();
      setProjectLoading(false);
      return data.project._id; // Return project ID
    } catch (error) {
      setProjectError(error.message);
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
    }),
    [notifCount, requestCount, sidebarCollapsed, projectForm, projectLoading, projectError, showProjectModal]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

export default AppContext;
