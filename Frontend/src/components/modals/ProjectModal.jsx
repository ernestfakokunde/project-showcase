import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useState } from "react";

const ProjectModal = () => {
  const [uploadingCover, setUploadingCover] = useState(false);

  const {
    projectForm,
    projectLoading,
    projectError,
    updateProjectField,
    addToProjectArray,
    removeFromProjectArray,
    submitProjectForm,
    closeProjectModal,
  } = useApp();

  const { token } = useAuth();
  const { addToast } = useToast();

  const CATEGORIES = ["Dev", "Design", "Web3", "AI/ML", "Game Dev", "Motion", "Open Source", "Other"];
  const EXPERIENCE_LEVELS = ["Junior", "Mid", "Senior", "Any"];
  const PROJECT_STAGES = ["Concept", "Just started", "In progress", "MVP done"];
  const PROJECT_STATUSES = ["Idea", "Building", "Looking for collaborators", "Paused", "Launched"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectId = await submitProjectForm(token);
    if (projectId) {
      closeProjectModal();
      // Could redirect to project detail or show success toast here
    }
  };

  const handleAddRole = () => {
    const newRole = {
      title: "",
      description: "",
      status: "open",
    };
    addToProjectArray("roles", newRole);
  };

  const handleAddLink = () => {
    const newLink = {
      label: "",
      url: "",
      icon: "",
    };
    addToProjectArray("links", newLink);
  };

  const handleAddTechStack = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      addToProjectArray("techStack", e.target.value.trim());
      e.target.value = "";
    }
  };

  const handleAddTools = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      addToProjectArray("tools", e.target.value.trim());
      e.target.value = "";
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Please select a valid image file", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingCover(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/uploads/project-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      updateProjectField("coverImage", data.url);
      addToast("Project image uploaded", "success");
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-10 sm:pt-14">
      <div className="max-h-[calc(100vh-5rem)] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-[#111118] border border-white/10">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#111118] px-6 py-4">
          <div>
            <h2 className="text-lg font-medium text-white">Post a Project</h2>
            <p className="text-xs text-white/40">Share what you're building with the community</p>
          </div>
          <button
            onClick={closeProjectModal}
            className="rounded-[8px] bg-white/5 p-2 text-white/50 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Alert */}
          {projectError && (
            <div className="rounded-[9px] bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {projectError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. SaaS Analytics Dashboard"
              className="w-full rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              value={projectForm.title}
              onChange={(e) => updateProjectField("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe your project, what you're building and what stage you're at..."
              className="h-24 w-full resize-none rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              value={projectForm.description}
              onChange={(e) => updateProjectField("description", e.target.value)}
            />
          </div>

          {/* Cover Image */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-xs text-white/50">Project Image</label>
              {projectForm.coverImage ? (
                <button
                  type="button"
                  onClick={() => updateProjectField("coverImage", "")}
                  className="text-xs text-red-400/80 hover:text-red-300"
                >
                  Remove
                </button>
              ) : null}
            </div>

            {projectForm.coverImage ? (
              <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[#0d0d14]">
                <img src={projectForm.coverImage} alt="Project preview" className="h-36 w-full object-cover" />
                <div className="border-t border-white/10 px-3 py-2 text-[11px] text-white/35">
                  This image will appear on the feed and project page.
                </div>
              </div>
            ) : (
              <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-white/15 bg-[#0d0d14] px-4 text-center transition hover:border-[#7f77dd]/45 hover:bg-white/[0.03]">
                <span className="text-sm font-medium text-white/65">
                  {uploadingCover ? "Uploading image..." : "Upload project image"}
                </span>
                <span className="mt-1 text-xs text-white/30">PNG, JPG, or WebP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImageUpload}
                  disabled={uploadingCover}
                />
              </label>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white outline-none focus:border-[#7f77dd]/50"
              value={projectForm.category}
              onChange={(e) => updateProjectField("category", e.target.value)}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tech Stack (Dev category) */}
          {projectForm.category === "Dev" && (
            <div>
              <label className="mb-2 block text-xs text-white/50">Tech Stack</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. React, Node.js (press Enter to add)"
                  className="flex-1 rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                  onKeyDown={handleAddTechStack}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {projectForm.techStack.map((tech, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 rounded-[6px] bg-[#7f77dd]/15 px-3 py-1.5 text-xs text-[#afa9ec]"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeFromProjectArray("techStack", i)}
                      className="text-[#afa9ec]/60 hover:text-[#afa9ec]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools (Design category) */}
          {projectForm.category === "Design" && (
            <div>
              <label className="mb-2 block text-xs text-white/50">Tools</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Figma, Adobe XD (press Enter to add)"
                  className="flex-1 rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                  onKeyDown={handleAddTools}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {projectForm.tools.map((tool, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 rounded-[6px] bg-[#5dcaa5]/15 px-3 py-1.5 text-xs text-[#5dcaa5]"
                  >
                    {tool}
                    <button
                      type="button"
                      onClick={() => removeFromProjectArray("tools", i)}
                      className="text-[#5dcaa5]/60 hover:text-[#5dcaa5]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Level */}
          <div>
            <label className="mb-2 block text-xs text-white/50">Experience Level</label>
            <select
              className="w-full rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white outline-none focus:border-[#7f77dd]/50"
              value={projectForm.experienceLevel}
              onChange={(e) => updateProjectField("experienceLevel", e.target.value)}
            >
              <option value="">Select level</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Project Stage */}
          <div>
            <label className="mb-2 block text-xs text-white/50">Project Stage</label>
            <select
              className="w-full rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white outline-none focus:border-[#7f77dd]/50"
              value={projectForm.projectStage}
              onChange={(e) => updateProjectField("projectStage", e.target.value)}
            >
              <option value="">Select stage</option>
              {PROJECT_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          {/* Project Status */}
          <div>
            <label className="mb-2 block text-xs text-white/50">Project Status</label>
            <select
              className="w-full rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white outline-none focus:border-[#7f77dd]/50"
              value={projectForm.status}
              onChange={(e) => updateProjectField("status", e.target.value)}
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Roles */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs text-white/50">
                Roles Needed <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddRole}
                className="text-xs text-[#7f77dd] hover:text-[#afa9ec]"
              >
                + Add Role
              </button>
            </div>
            <div className="space-y-2">
              {projectForm.roles.map((role, i) => (
                <div key={i} className="rounded-[9px] border border-white/10 bg-[#0d0d14] p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Role title (e.g. Frontend Developer)"
                        className="w-full rounded-[6px] border border-white/10 bg-[#09090e] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                        value={role.title}
                        onChange={(e) => {
                          const updated = [...projectForm.roles];
                          updated[i].title = e.target.value;
                          updateProjectField("roles", updated);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        className="w-full rounded-[6px] border border-white/10 bg-[#09090e] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                        value={role.description}
                        onChange={(e) => {
                          const updated = [...projectForm.roles];
                          updated[i].description = e.target.value;
                          updateProjectField("roles", updated);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromProjectArray("roles", i)}
                      className="text-white/30 hover:text-white/60"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs text-white/50">Community Links (optional)</label>
              <button
                type="button"
                onClick={handleAddLink}
                className="text-xs text-[#7f77dd] hover:text-[#afa9ec]"
              >
                + Add Link
              </button>
            </div>
            <div className="space-y-2">
              {projectForm.links.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label (e.g. GitHub)"
                    className="flex-1 rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...projectForm.links];
                      updated[i].label = e.target.value;
                      updateProjectField("links", updated);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    className="flex-1 rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...projectForm.links];
                      updated[i].url = e.target.value;
                      updateProjectField("links", updated);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFromProjectArray("links", i)}
                    className="text-white/30 hover:text-white/60"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={closeProjectModal}
              className="rounded-[8px] border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white/70 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={projectLoading}
              className="rounded-[8px] bg-[#7f77dd] px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {projectLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
