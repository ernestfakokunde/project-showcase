import Topbar from "../components/layout/Topbar";
import ProjectBanner from "../components/project/ProjectBanner";
import RolesGrid from "../components/project/RolesGrid";
import CommunityLinks from "../components/project/CommunityLinks";
import CommentSection from "../components/project/CommentSection";
import PitchModal from "../components/project/PitchModal";

const ProjectDetail = ({
  project,
  comments = [],
  currentUser,
  isCollaborator = false,
  onLike,
  onSave,
  onPitchSubmit,
  onCommentSubmit,
}) => {
  if (!project) {
    return <div className="min-h-screen bg-[#09090e] p-6 text-sm text-white/40">Project not found</div>;
  }

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="breadcrumb" breadcrumb={{ base: "Feed", detail: project.title }} />

      <div className="flex gap-6 px-7 py-7">
        <div className="flex-1">
          <ProjectBanner category={project.category} />

          <div className="mt-5 flex items-start justify-between">
            <div>
              <span className="inline-block rounded-[6px] bg-[#7f77dd]/15 px-[9px] py-[3px] text-[11px] text-[#afa9ec]">
                {project.category || "Dev"}
              </span>
              <div className="mt-2 text-[22px] font-medium tracking-[-0.4px] text-white">{project.title}</div>
              <div className="text-[13px] text-white/35">
                Posted by @{project.owner?.username || "owner"} - {project.createdAt || ""}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onLike}
                className="flex items-center gap-1 rounded-[8px] border border-white/10 bg-white/5 px-[14px] py-[7px] text-[12px] text-white/50"
              >
                <HeartIcon className="h-3 w-3" /> {project.likes || 0}
              </button>
              <button
                type="button"
                onClick={onSave}
                className="rounded-[8px] border border-white/10 bg-white/5 px-[14px] py-[7px] text-[12px] text-white/50"
              >
                Save
              </button>
              <button
                type="button"
                className="rounded-[8px] bg-[#7f77dd] px-[18px] py-[7px] text-[12px] font-medium text-white"
              >
                Request to join
              </button>
            </div>
          </div>

          <Section title="About this project">
            <div className="text-[13px] leading-[1.7] text-white/55">{project.description || "No description yet."}</div>
          </Section>

          <Section title="Tech stack">
            <div className="flex flex-wrap gap-[7px]">
              {project.techStack?.length ? (
                project.techStack.map((tag) => (
                  <span key={tag} className="rounded-[6px] bg-white/5 px-[10px] py-[4px] text-[12px] text-white/45">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-[12px] text-white/30">No stack listed</span>
              )}
            </div>
          </Section>

          <Section title="Roles needed">
            <RolesGrid roles={project.roles || []} />
          </Section>

          <Section title="Community links">
            <CommunityLinks links={project.links || []} isCollaborator={isCollaborator} />
          </Section>

          <CommentSection comments={comments} currentUser={currentUser} onSubmit={onCommentSubmit} />
        </div>

        <aside className="w-[240px] flex-shrink-0">
          <div className="mb-[14px] rounded-[12px] border border-white/10 bg-[#111118] p-4">
            <div className="mb-3 text-[11px] uppercase tracking-[0.8px] text-white/30">Project owner</div>
            <div className="mb-3 flex items-center gap-[10px]">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#7f77dd]/25 text-[13px] font-medium text-[#afa9ec]">
                {(project.owner?.initials || project.owner?.username?.slice(0, 2) || "SL").toUpperCase()}
              </div>
              <div>
                <div className="text-[13px] font-medium text-white">@{project.owner?.username || "owner"}</div>
                <div className="text-[11px] text-white/35">{project.owner?.role || "Member"}</div>
              </div>
            </div>
            <button className="w-full rounded-[8px] border border-white/10 bg-white/5 py-[7px] text-[12px] text-white/50">Follow</button>
          </div>

          <div className="mb-[14px] rounded-[12px] border border-white/10 bg-[#111118] p-4">
            <div className="mb-3 text-[11px] uppercase tracking-[0.8px] text-white/30">Stats</div>
            <div className="grid grid-cols-2 gap-2">
              <StatBox label="Likes" value={project.likes} />
              <StatBox label="Comments" value={project.commentsCount} />
              <StatBox label="Spots left" value={project.spotsLeft} />
              <StatBox label="Timeline" value={project.timeline} />
            </div>
          </div>

          <div className="mb-[14px] rounded-[12px] border border-white/10 bg-[#111118] p-4">
            <div className="mb-3 text-[11px] uppercase tracking-[0.8px] text-white/30">Collaborators</div>
            <div className="space-y-2">
              {project.collaborators?.length ? (
                project.collaborators.map((collab) => (
                  <div key={collab.username} className="flex items-center gap-2">
                    <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#7f77dd]/20 text-[10px] font-medium text-[#afa9ec]">
                      {(collab.initials || collab.username?.slice(0, 2) || "SL").toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[12px] text-white/50">@{collab.username}</div>
                      <div className="text-[10px] text-white/25">{collab.role}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[12px] text-white/30">No collaborators yet</div>
              )}
            </div>
          </div>

          <PitchModal ownerUsername={project.owner?.username} onSubmit={onPitchSubmit} />
        </aside>
      </div>
    </main>
  );
};

const HeartIcon = ({ className }) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
    <path d="M6 10s-5-3-5-6a3 3 0 016 0 3 3 0 016 0c0 3-5 6-5 6z" />
  </svg>
);

const Section = ({ title, children }) => (
  <div className="mt-5">
    <div className="mb-2 text-[13px] font-medium uppercase tracking-[0.5px] text-white/50">{title}</div>
    {children}
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="rounded-[8px] bg-[#0d0d14] p-2 text-center">
    <div className="text-[18px] font-medium text-white">{value ?? 0}</div>
    <div className="text-[10px] text-white/30">{label}</div>
  </div>
);

export default ProjectDetail;
