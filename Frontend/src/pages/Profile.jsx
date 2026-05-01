import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import Topbar from "../components/layout/Topbar";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProjectGrid from "../components/profile/ProjectGrid";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileEditModal from "../components/profile/ProfileEditModal";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, authFetch } = useAuth();
  const { addToast } = useToast();
  const { isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [likedProjects, setLikedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalTab, setInternalTab] = useState("Projects");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [inviteForm, setInviteForm] = useState({ projectId: "", pitch: "" });

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authFetch(`/users/${username}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setUser(data.user);
        setProjects(data.projects || []);
        setCollaborations(data.collaborations || []);
        setLikedProjects(data.likedProjects || []);

        // Fetch designs for this user
        const designRes = await authFetch(`/designs/user/${data.user._id}`);
        const designData = await designRes.json();
        if (designRes.ok) {
          setDesigns(designData.designs || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, authFetch]);

  const stats = useMemo(
    () => ({
      projects: projects.length,
      designs: designs.length,
      followers: user?.followers?.length || 0,
      following: user?.following?.length || 0,
      collabs: collaborations.length,
    }),
    [projects, designs, collaborations, user]
  );

  const tabItems = [
    { label: `Projects (${projects.length})`, key: "Projects" },
    { label: `Designs (${designs.length})`, key: "Designs" },
    { label: `Collaborations (${collaborations.length})`, key: "Collaborations" },
    { label: `Liked (${likedProjects.length})`, key: "Liked" },
  ];

  const handleTabChange = (key) => {
    setInternalTab(key);
  };

  const handleFollow = async () => {
    try {
      const res = await authFetch(`/users/${user._id}/follow`, { method: "PUT" });
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({
          ...prev,
          followers:
            data.isFollowing
              ? [...(prev.followers || []), currentUser._id]
              : (prev.followers || []).filter((f) => (f?._id || f).toString() !== currentUser._id.toString()),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (formData) => {
    if (!isOwnProfile) {
      addToast("You can only edit your own profile", "error");
      return;
    }

    try {
      const res = await authFetch(`/users/profile`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data.user);
      setShowEditModal(false);
      addToast("Profile updated successfully!", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const openInviteModal = async () => {
    try {
      const res = await authFetch("/projects/my?limit=50");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load your projects");
      setMyProjects(data.projects || []);
      setInviteForm({ projectId: data.projects?.[0]?._id || "", pitch: `I think you would be a great fit for one of my projects.` });
      setShowInviteModal(true);
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleInvite = async () => {
    if (!inviteForm.projectId) {
      addToast("Choose a project to invite them to", "error");
      return;
    }

    try {
      const res = await authFetch("/requests/invite", {
        method: "POST",
        body: JSON.stringify({
          projectId: inviteForm.projectId,
          userId: user._id,
          pitch: inviteForm.pitch,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send invite");
      setShowInviteModal(false);
      addToast("Invite sent", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#09090e] flex items-center justify-center text-white/50">Loading profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#09090e] flex items-center justify-center text-red-400">{error}</div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-[#09090e] flex items-center justify-center text-white/50">User not found</div>;
  }

  const currentProjects = internalTab === "Designs" ? designs : internalTab === "Collaborations" ? collaborations : internalTab === "Liked" ? likedProjects : projects;

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title={`@${user?.username}`} subtitle={user?.bio} />
      
      <ProfileHeader 
        user={user} 
        stats={stats} 
        isOwnProfile={isOwnProfile} 
        onFollow={handleFollow}
        onEdit={() => setShowEditModal(true)}
        onInvite={openInviteModal}
      />

      <div className="flex flex-col lg:flex-row gap-5 px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex-1">
          <div className="mb-5 flex overflow-x-auto border-b border-white/10">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`-mb-px shrink-0 px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] ${
                  internalTab === tab.key ? "border-b-2 border-[#7f77dd] text-[#afa9ec]" : "text-white/35"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ProjectGrid projects={currentProjects} />
        </div>

        <div className="lg:w-[260px] lg:shrink-0">
          <ProfileSidebar
            skills={user?.skills || []}
            experienceLevel={user?.experienceLevel}
            availability={user?.availability}
            links={user?.links || {}}
            activity={user?.activity || []}
          />
        </div>
      </div>

      <ProfileEditModal 
        user={user} 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
      />

      {showInviteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111118] p-5">
            <h2 className="text-lg font-semibold text-white">Invite @{user.username}</h2>
            <p className="mt-1 text-sm text-white/40">Choose one of your projects and send a short note.</p>

            <label className="mt-5 block text-xs text-white/50">Project</label>
            <select
              value={inviteForm.projectId}
              onChange={(event) => setInviteForm((prev) => ({ ...prev, projectId: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0d0d14] px-3 py-2 text-sm text-white outline-none focus:border-[#7f77dd]/50"
            >
              {myProjects.map((project) => (
                <option key={project._id} value={project._id}>{project.title}</option>
              ))}
            </select>

            <label className="mt-4 block text-xs text-white/50">Message</label>
            <textarea
              value={inviteForm.pitch}
              onChange={(event) => setInviteForm((prev) => ({ ...prev, pitch: event.target.value }))}
              className="mt-2 h-24 w-full resize-none rounded-lg border border-white/10 bg-[#0d0d14] px-3 py-2 text-sm text-white outline-none focus:border-[#7f77dd]/50"
            />

            <div className="mt-5 flex gap-2">
              <button onClick={() => setShowInviteModal(false)} className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65 hover:bg-white/10">
                Cancel
              </button>
              <button onClick={handleInvite} className="flex-1 rounded-lg bg-[#7f77dd] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6f67ce]">
                Send invite
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default Profile;
