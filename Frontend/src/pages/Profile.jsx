import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Topbar from "../components/layout/Topbar";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProjectGrid from "../components/profile/ProjectGrid";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileEditModal from "../components/profile/ProfileEditModal";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, authFetch } = useAuth();
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [likedProjects, setLikedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internalTab, setInternalTab] = useState("Projects");
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authFetch(`/api/users/${username}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setUser(data.user);
        setProjects(data.projects || []);
        setCollaborations(data.collaborations || []);
        setLikedProjects(data.likedProjects || []);
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
      followers: user?.followers?.length || 0,
      following: user?.following?.length || 0,
      collabs: collaborations.length,
    }),
    [projects, collaborations, user]
  );

  const tabItems = [
    { label: `Projects (${projects.length})`, key: "Projects" },
    { label: `Collaborations (${collaborations.length})`, key: "Collaborations" },
    { label: `Liked (${likedProjects.length})`, key: "Liked" },
  ];

  const handleTabChange = (key) => {
    setInternalTab(key);
  };

  const handleFollow = async () => {
    try {
      const res = await authFetch(`/api/users/${user._id}/follow`, { method: "PUT" });
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.some((f) => f._id === currentUser._id)
            ? prev.followers.filter((f) => f._id !== currentUser._id)
            : [...prev.followers, currentUser],
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
      const res = await authFetch(`/api/users/profile`, {
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

  if (loading) {
    return <div className="min-h-screen bg-[#09090e] flex items-center justify-center text-white/50">Loading profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#09090e] flex items-center justify-center text-red-400">{error}</div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-[#09090e] flex items-center justify-center text-white/50">User not found</div>;
  }

  const currentProjects = internalTab === "Collaborations" ? collaborations : internalTab === "Liked" ? likedProjects : projects;

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title={`@${user?.username}`} subtitle={user?.bio} />
      
      <ProfileHeader 
        user={user} 
        stats={stats} 
        isOwnProfile={isOwnProfile} 
        onFollow={handleFollow}
        onEdit={() => setShowEditModal(true)}
      />

      <div className="flex gap-5 px-8 py-5">
        <div className="flex-1">
          <div className="mb-5 flex border-b border-white/10">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`-mb-px px-4 py-2 text-[13px] ${
                  internalTab === tab.key ? "border-b-2 border-[#7f77dd] text-[#afa9ec]" : "text-white/35"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ProjectGrid projects={currentProjects} />
        </div>

        <ProfileSidebar skills={user?.skills || []} experience={user?.experience || []} activity={user?.activity || []} />
      </div>

      <ProfileEditModal 
        user={user} 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
      />
    </main>
  );
};

export default Profile;
