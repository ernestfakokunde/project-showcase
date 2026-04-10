import { useMemo, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProjectGrid from "../components/profile/ProjectGrid";
import ProfileSidebar from "../components/profile/ProfileSidebar";

const Profile = ({
  user,
  projects = [],
  collaborations = [],
  likedProjects = [],
  isOwnProfile = false,
  onFollow,
  activeTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState("Projects");
  const currentTab = activeTab || internalTab;

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
    if (onTabChange) onTabChange(key);
    if (!activeTab) setInternalTab(key);
  };

  const currentProjects = currentTab === "Collaborations" ? collaborations : currentTab === "Liked" ? likedProjects : projects;

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <ProfileHeader user={user} stats={stats} isOwnProfile={isOwnProfile} onFollow={onFollow} />

      <div className="flex gap-5 px-8 py-5">
        <div className="flex-1">
          <div className="mb-5 flex border-b border-white/10">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`-mb-px px-4 py-2 text-[13px] ${
                  currentTab === tab.key ? "border-b-2 border-[#7f77dd] text-[#afa9ec]" : "text-white/35"
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
    </main>
  );
};

export default Profile;
