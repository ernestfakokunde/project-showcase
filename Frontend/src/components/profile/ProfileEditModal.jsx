import { useState } from "react";

const ProfileEditModal = ({ user, onClose, onSave, isOpen }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    experienceLevel: user?.experienceLevel || "",
    skills: user?.skills || [],
    roles: user?.roles || [],
    links: {
      github: user?.links?.github || "",
      linkedin: user?.links?.linkedin || "",
      portfolio: user?.links?.portfolio || "",
    },
  });

  const [newSkill, setNewSkill] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [platform]: value },
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleToggleRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  const ROLE_OPTIONS = ["Developer", "Designer", "Web3", "AI/ML", "Game Dev", "Motion", "Other"];
  const EXP_LEVELS = ["Junior", "Mid", "Senior"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-[12px] bg-[#111118] border border-white/10 p-6 my-6">
        <h2 className="text-lg font-medium text-white mb-1">Edit Profile</h2>
        <p className="text-xs text-white/40 mb-6">Update your public profile information</p>

        {/* Full Name */}
        <div className="mb-4">
          <label className="text-xs font-medium text-white/60 mb-2 block">Full Name</label>
          <input
            type="text"
            placeholder="Your full name"
            className="w-full rounded-[8px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="text-xs font-medium text-white/60 mb-2 block">Bio (max 300 chars)</label>
          <textarea
            placeholder="Tell others about yourself..."
            className="w-full h-20 rounded-[8px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50 resize-none"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value.slice(0, 300))}
            maxLength={300}
          />
          <p className="text-[10px] text-white/30 mt-1">{formData.bio.length}/300</p>
        </div>

        {/* Experience Level */}
        <div className="mb-4">
          <label className="text-xs font-medium text-white/60 mb-2 block">Experience Level</label>
          <div className="flex gap-2">
            {EXP_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => handleChange("experienceLevel", level)}
                className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition ${
                  formData.experienceLevel === level
                    ? "bg-[#7f77dd] text-white"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="mb-4">
          <label className="text-xs font-medium text-white/60 mb-2 block">Roles (select all that apply)</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_OPTIONS.map((role) => (
              <button
                key={role}
                onClick={() => handleToggleRole(role)}
                className={`px-3 py-2 text-xs font-medium rounded-[6px] transition ${
                  formData.roles.includes(role)
                    ? "bg-[#7f77dd] text-white"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="text-xs font-medium text-white/60 mb-2 block">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add a skill..."
              className="flex-1 rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
            />
            <button
              onClick={handleAddSkill}
              className="px-3 py-2 text-xs font-medium rounded-[6px] bg-[#7f77dd] text-white hover:bg-[#7f77dd]/90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-[4px] bg-[#7f77dd]/20 px-2 py-1 text-xs text-[#afa9ec]"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-[#7f77dd] hover:text-white"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-6">
          <label className="text-xs font-medium text-white/60 mb-2 block">Social Links</label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="GitHub URL"
              className="w-full rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              value={formData.links.github}
              onChange={(e) => handleLinkChange("github", e.target.value)}
            />
            <input
              type="text"
              placeholder="LinkedIn URL"
              className="w-full rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              value={formData.links.linkedin}
              onChange={(e) => handleLinkChange("linkedin", e.target.value)}
            />
            <input
              type="text"
              placeholder="Portfolio URL"
              className="w-full rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
              value={formData.links.portfolio}
              onChange={(e) => handleLinkChange("portfolio", e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-[8px] bg-[#7f77dd] px-4 py-2 text-sm font-medium text-white hover:bg-[#7f77dd]/90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
