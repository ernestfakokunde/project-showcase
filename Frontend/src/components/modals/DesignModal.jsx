import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useState } from "react";

const DesignModal = () => {
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);

  const {
    designForm,
    designLoading,
    designError,
    updateDesignField,
    addToDesignArray,
    removeFromDesignArray,
    updateDesignArrayItem,
    submitDesignForm,
    closeDesignModal,
  } = useApp();

  const { token } = useAuth();
  const { addToast } = useToast();

  const CATEGORIES = ["UI Design", "Web Design", "App Design", "Branding", "Illustration", "Motion", "3D", "Other"];
  const POPULAR_TOOLS = ["Figma", "Adobe XD", "Sketch", "Framer", "Webflow", "Adobe Photoshop", "Illustrator", "Blender"];

  const LINK_SUGGESTIONS = {
    "UI Design": ["Figma", "Prototype Link", "Live Demo"],
    "Web Design": ["Figma", "Live Demo", "GitHub"],
    "App Design": ["Figma", "App Store Link", "Live Demo"],
    "Branding": ["Brand Guidelines", "Portfolio", "Case Study"],
    "Illustration": ["Portfolio", "Behance Link", "Case Study"],
    "Motion": ["Vimeo Link", "YouTube Link", "Live Demo"],
    "3D": ["Sketchfab Link", "Portfolio", "Live Demo"],
    "Other": ["Portfolio", "Case Study", "GitHub", "Live Demo"],
  };

  const getLinkSuggestions = () => {
    return LINK_SUGGESTIONS[designForm.category] || LINK_SUGGESTIONS["Other"];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const designId = await submitDesignForm(token);
    if (designId) {
      closeDesignModal();
      addToast("Design posted successfully!", "success");
    }
  };

  const handleAddImage = () => {
    addToDesignArray("images", { url: "", caption: "" });
  };

  const handleImageFileUpload = (e, imageIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      addToast("Please select a valid image file", "error");
      return;
    }

    setUploadingImageIndex(imageIndex);

    // Read file as data URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      updateDesignArrayItem("images", imageIndex, {
        ...designForm.images[imageIndex],
        url: dataUrl,
      });
      setUploadingImageIndex(null);
      addToast("Image uploaded successfully", "success");
    };
    reader.onerror = () => {
      addToast("Failed to read image file", "error");
      setUploadingImageIndex(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      addToDesignArray("tags", e.target.value.trim());
      e.target.value = "";
    }
  };

  const handleAddLink = () => {
    addToDesignArray("links", { url: "", label: "" });
  };

  const handleToggleTool = (tool) => {
    if (designForm.tools.includes(tool)) {
      removeFromDesignArray("tools", designForm.tools.indexOf(tool));
    } else {
      addToDesignArray("tools", tool);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-[#111118] border border-white/10">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#111118] px-6 py-4">
          <div>
            <h2 className="text-lg font-medium text-white">Post a Design</h2>
            <p className="text-xs text-white/40">Share your design work with the community</p>
          </div>
          <button
            onClick={closeDesignModal}
            className="rounded-[8px] bg-white/5 p-2 text-white/50 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Alert */}
          {designError && (
            <div className="rounded-[9px] bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {designError}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Design Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mobile App UI Kit, Dashboard redesign"
              className="w-full rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              value={designForm.title}
              onChange={(e) => updateDesignField("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe your design, the process, inspiration, or what you're open to feedback on..."
              className="h-24 w-full resize-none rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              value={designForm.description}
              onChange={(e) => updateDesignField("description", e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-xs text-white/50">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white outline-none focus:border-[#7f77dd]/50"
              value={designForm.category}
              onChange={(e) => updateDesignField("category", e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs text-white/50">
                Design Images <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddImage}
                className="text-xs text-[#7f77dd] hover:text-[#afa9ec]"
              >
                + Add Image
              </button>
            </div>
            <div className="space-y-2">
              {designForm.images.map((image, i) => (
                <div key={i} className="rounded-[9px] border border-white/10 bg-[#0d0d14] p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Paste image URL or upload from computer below"
                          className="flex-1 rounded-[6px] border border-white/10 bg-[#09090e] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                          value={image.url}
                          onChange={(e) =>
                            updateDesignArrayItem("images", i, {
                              ...image,
                              url: e.target.value,
                            })
                          }
                        />
                        <label className="flex items-center gap-2 rounded-[6px] border border-white/10 bg-[#09090e] px-3 py-2 text-xs text-white/40 hover:text-white/60 cursor-pointer hover:bg-white/5 transition flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>{uploadingImageIndex === i ? "Uploading..." : "Upload"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageFileUpload(e, i)}
                            disabled={uploadingImageIndex === i}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Image caption (optional)"
                        className="w-full rounded-[6px] border border-white/10 bg-[#09090e] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                        value={image.caption}
                        onChange={(e) =>
                          updateDesignArrayItem("images", i, {
                            ...image,
                            caption: e.target.value,
                          })
                        }
                      />
                      {image.url && (
                        <img
                          src={image.url}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-[6px]"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromDesignArray("images", i)}
                      className="text-white/30 hover:text-white/60 mt-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <label className="mb-2 block text-xs text-white/50">Tools Used</label>
            <div className="mb-3 flex flex-wrap gap-2">
              {POPULAR_TOOLS.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => handleToggleTool(tool)}
                  className={`rounded-[6px] px-3 py-1.5 text-xs transition ${
                    designForm.tools.includes(tool)
                      ? "bg-[#7f77dd] text-white"
                      : "border border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Other tools (press Enter to add)"
              className="w-full rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  handleToggleTool(e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
          </div>

          {/* Links */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs text-white/50">
                Links 
                <span className="text-white/30 text-xs ml-1">
                  ({designForm.category === "Web Design" ? "Figma, GitHub, etc." : designForm.category === "UI Design" ? "Figma, Demo, etc." : "based on design type"})
                </span>
              </label>
              <button
                type="button"
                onClick={handleAddLink}
                className="text-xs text-[#7f77dd] hover:text-[#afa9ec]"
              >
                + Add Link
              </button>
            </div>
            <div className="space-y-2">
              {designForm.links.map((link, i) => (
                <div key={i} className="rounded-[9px] border border-white/10 bg-[#0d0d14] p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <select
                        value={link.label}
                        onChange={(e) =>
                          updateDesignArrayItem("links", i, {
                            ...link,
                            label: e.target.value,
                          })
                        }
                        className="w-full rounded-[6px] border border-white/10 bg-[#09090e] px-3 py-2 text-xs text-white outline-none focus:border-[#7f77dd]/50"
                      >
                        <option value="">Select link type</option>
                        {getLinkSuggestions().map((suggestion) => (
                          <option key={suggestion} value={suggestion}>
                            {suggestion}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                      {link.label === "other" && (
                        <input
                          type="text"
                          placeholder="Custom link type"
                          className="w-full rounded-[6px] border border-white/10 bg-[#09090e] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              updateDesignArrayItem("links", i, {
                                ...link,
                                label: e.target.value.trim(),
                              });
                            }
                          }}
                        />
                      )}
                      <input
                        type="url"
                        placeholder={
                          link.label === "Figma" ? "https://figma.com/..." :
                          link.label === "GitHub" ? "https://github.com/..." :
                          link.label === "Live Demo" ? "https://example.com" :
                          "Link URL"
                        }
                        className="w-full rounded-[6px] border border-white/10 bg-[#09090e] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                        value={link.url}
                        onChange={(e) =>
                          updateDesignArrayItem("links", i, {
                            ...link,
                            url: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromDesignArray("links", i)}
                      className="text-white/30 hover:text-white/60 mt-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-xs text-white/50">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. mobile (press Enter to add)"
                className="flex-1 rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                onKeyDown={handleAddTag}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {designForm.tags.map((tag, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 rounded-[6px] bg-[#7f77dd]/15 px-3 py-1.5 text-xs text-[#afa9ec]"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeFromDesignArray("tags", i)}
                    className="text-[#afa9ec]/60 hover:text-[#afa9ec]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={closeDesignModal}
              className="flex-1 rounded-[8px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={designLoading}
              className="flex-1 rounded-[8px] bg-[#7f77dd] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#7f77dd]/90 disabled:opacity-50 transition"
            >
              {designLoading ? "Posting..." : "Post Design"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DesignModal;
