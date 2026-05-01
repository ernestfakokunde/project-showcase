import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import Topbar from "../components/layout/Topbar";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const { addToast } = useToast();
  const { toggleSidebar } = useApp();
  const { isDark } = useTheme();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [pitchText, setPitchText] = useState("");
  const [whatYouOffer, setWhatYouOffer] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [socials, setSocials] = useState({ github: "", linkedin: "", portfolio: "", twitter: "" });
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    fetchProject();
    fetchComments();

    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Project fetch timeout - loading took too long");
        setLoading(false);
        addToast("Couldn't load project", "error");
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [id]);

  const fetchProject = async () => {
    try {
      console.log(`Fetching project with ID: ${id}`);
      setError(null);
      const res = await authFetch(`/projects/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch project");
      }

      console.log("Project fetched successfully:", data.project);
      setProject(data.project);
      setRequestStatus(data.requestStatus || null);
      if (user && data.project?.likes) {
        setLiked(data.project.likes.some((id) => (id?._id || id).toString() === user._id.toString()));
      }
      
      // Check if current user is following the project owner
      if (user && data.project.owner?.followers) {
        setIsFollowing(data.project.owner.followers.some(id => id.toString() === user._id.toString()));
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setError(error.message || "Failed to load project");
      addToast(error.message || "Failed to load project", "error");
      setTimeout(() => navigate("/feed"), 1500);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await authFetch(`/comments/${id}`);
      const data = await res.json();

      if (res.ok) {
        setComments(data.comments || []);
      }
    } catch (error) {
      // Silently fail for comments
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await authFetch("/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, text: commentText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setComments([data.comment, ...comments]);
      setCommentText("");
      addToast("Comment added!", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  const handleSendPitch = async () => {
    if (requestStatus) {
      const statusLabel = requestStatus === "pending" ? "already sent" : requestStatus;
      addToast(`You have ${statusLabel} a request for this project`, "error");
      return;
    }

    if (!pitchText.trim()) {
      addToast("Please write a pitch message", "error");
      return;
    }

    try {
      const res = await authFetch("/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          pitch: pitchText,
          whatYouOffer: whatYouOffer || "",
          email: email || user?.email || "",
          phone: phone || "",
          socials: socials,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to send pitch");
      }

      setShowPitchModal(false);
      setPitchText("");
      setWhatYouOffer("");
      setEmail("");
      setPhone("");
      setSocials({ github: "", linkedin: "", portfolio: "", twitter: "" });
      setRequestStatus("pending");
      addToast("Request sent", "success");
    } catch (error) {
      addToast(error.message || "Failed to send pitch", "error");
    }
  };

  const handleOpenPitchModal = () => {
    if (requestStatus === "pending") {
      addToast("You already sent a pitch for this project", "error");
      return;
    }

    if (requestStatus === "accepted") {
      addToast("Your request was already accepted for this project", "success");
      return;
    }

    if (requestStatus === "declined") {
      addToast("Your earlier request for this project was declined", "error");
      return;
    }

    setShowPitchModal(true);
  };

  const handleFollowOwner = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      console.log(`[Follow Project] Starting follow request for user ${project.owner._id}`);
      const res = await authFetch(`/users/${project.owner._id}/follow`, {
        method: "PUT",
      });
      
      console.log(`[Follow Project] Response status:`, res.status, res.ok);
      const data = await res.json();
      console.log(`[Follow Project] Response data:`, data);

      if (res.ok) {
        console.log(`[Follow Project] Success! IsFollowing =`, data.isFollowing);
        setIsFollowing(data.isFollowing);
        addToast(data.isFollowing ? "Following creator!" : "Unfollowed creator", "success");
      } else {
        console.error(`[Follow Project] Error response:`, data);
        addToast(data.message || "Error following creator", "error");
      }
    } catch (error) {
      console.error(`[Follow Project] Catch error:`, error);
      addToast(error.message || "Error following creator", "error");
    }
  };

  const handleLikeProject = async () => {
    try {
      const res = await authFetch(`/projects/${id}/like`, { method: "PUT" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update like");
      }

      setLiked(data.liked);
      setProject((prev) => (prev ? { ...prev, likes: new Array(data.likesCount || 0).fill(0) } : prev));
      addToast(data.liked ? "Project liked!" : "Project unliked!", "success");
    } catch (error) {
      addToast(error.message, "error");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090e] flex items-center justify-center text-white/40">
        <div className="text-center">
          <p className="text-lg">Loading project...</p>
          <p className="text-xs mt-2">If this takes too long, check your connection</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-[#09090e] flex items-center justify-center text-white/40">
        <div className="text-center">
          <p className="text-lg text-red-400">{error || "Project not found"}</p>
          <button
            onClick={() => navigate("/feed")}
            className="mt-4 px-4 py-2 rounded-lg bg-[#7f77dd] text-white hover:bg-[#7f77dd]/90"
          >
            Back to Feed
          </button>
        </div>
      </main>
    );
  }

  // Check if current user is the owner
  const isOwner = user && project.owner && user._id === project.owner._id;
  const pitchButtonLabel =
    requestStatus === "pending"
      ? "Pitch Sent"
      : requestStatus === "accepted"
        ? "Accepted"
        : requestStatus === "declined"
          ? "Declined"
          : "Send Pitch";
  console.log("ProjectDetail: isOwner =", isOwner, { userID: user?._id, ownerID: project.owner?._id });

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar
        variant="breadcrumb"
        breadcrumb={{ base: "Feed", detail: project.title }}
        onBack={() => navigate("/feed")}
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 sm:px-6 lg:px-7 py-4 sm:py-6 lg:py-7">
        <div className="flex-1 min-w-0">
          {/* Cover */}
          <div className="mb-6 h-[200px] sm:h-[250px] lg:h-[300px] rounded-[12px] border border-white/10 bg-[#111118]">
            {project.coverImage ? (
              <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover rounded-[12px]" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">No cover image</div>
            )}
          </div>

          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <span className="inline-block rounded-[6px] bg-[#7f77dd]/15 px-3 py-1 text-[11px] text-[#afa9ec] mb-3">
                {project.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-medium text-white">{project.title}</h1>
              <p 
                className="mt-2 text-sm text-white/40 hover:text-[#7f77dd] transition cursor-pointer"
                onClick={() => navigate(`/profile/${project.owner?.username}`)}
              >
                Posted by <span className="font-medium">@{project.owner?.username || "owner"}</span>
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0 flex-col sm:flex-row w-full sm:w-auto">
              <button
                onClick={handleLikeProject}
                className={`rounded-[8px] border px-4 py-2 text-sm transition ${
                  liked
                    ? "border-[#7f77dd]/40 bg-[#7f77dd]/15 text-[#afa9ec]"
                    : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                Like {project.likes?.length || 0}
              </button>
              {user && project.owner && user._id === project.owner._id ? (
                <div className="rounded-[8px] bg-white/5 px-6 py-2 text-sm font-medium text-white/50">
                  You're the owner
                </div>
              ) : (
                <>
                  <button
                    onClick={handleFollowOwner}
                    className={`rounded-[8px] px-4 py-2 text-sm font-medium transition ${
                      isFollowing
                        ? "border border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <button
                    className={`rounded-[8px] px-6 py-2 text-sm font-medium text-white ${
                      requestStatus
                        ? "bg-white/10 text-white/50 hover:bg-white/10"
                        : "bg-[#7f77dd] hover:bg-[#7f77dd]/90"
                    }`}
                    onClick={handleOpenPitchModal}
                  >
                    {pitchButtonLabel}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-white/60 mb-2">About</h2>
            <p className="text-sm text-white/55 leading-relaxed">{project.description}</p>
          </div>

          {/* Tech Stack */}
          {project.techStack?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-white/60 mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="rounded-[6px] bg-white/5 px-3 py-1.5 text-xs text-white/40">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Roles */}
          {project.roles?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-white/60 mb-3">Roles Needed</h2>
              <div className="space-y-2">
                {project.roles.map((role, i) => (
                  <div key={i} className="rounded-[8px] border border-white/10 bg-white/5 p-3">
                    <div className="font-medium text-sm text-white">{role.title}</div>
                    <div className="text-xs text-white/40 mt-1">{role.description}</div>
                    <div className="text-xs text-white/30 mt-2">Status: {role.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-white/60 mb-3">Comments ({comments.length})</h2>

            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                placeholder="Share your thoughts..."
                className="w-full h-20 rounded-[9px] border border-white/10 bg-[#0d0d14] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50 resize-none"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="mt-2 rounded-[6px] bg-[#7f77dd] px-4 py-2 text-xs font-medium text-white hover:bg-[#7f77dd]/90"
              >
                Post Comment
              </button>
            </form>

            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-xs text-white/30">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="rounded-[8px] border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">
                        @{comment.author?.username || "anonymous"}
                      </span>
                      <span className="text-[10px] text-white/30">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-white/55">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-full lg:w-[240px] flex-shrink-0">
          <div className="rounded-[12px] border border-white/10 bg-[#111118] p-4 sticky top-20">
            <h3 className="text-xs font-medium text-white/60 mb-3 uppercase">Collaborators</h3>
            <div className="space-y-2">
              {project.collaborators?.length === 0 ? (
                <p className="text-xs text-white/30">No collaborators yet</p>
              ) : (
                project.collaborators?.map((collab) => (
                  <div key={collab} className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#7f77dd]/25 flex items-center justify-center">
                      <span className="text-[10px] text-[#afa9ec]">{collab?.username?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-xs text-white/60">@{collab?.username || "user"}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pitch Modal - Enhanced Form */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto">
          <div className="w-full max-w-lg rounded-[12px] bg-[#111118] border border-white/10 p-6 my-6">
            <h2 className="text-lg font-medium text-white mb-1">Send Your Pitch</h2>
            <p className="text-xs text-white/40 mb-4">Tell the project owner why you're a great fit</p>

            {/* Pitch Message */}
            <div className="mb-4">
              <label className="text-xs font-medium text-white/60 mb-2 block">Why you want to join *</label>
              <textarea
                placeholder="Share your interest and what draws you to this project..."
                className="w-full h-20 rounded-[8px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50 resize-none"
                value={pitchText}
                onChange={(e) => setPitchText(e.target.value)}
              />
            </div>

            {/* What You Offer */}
            <div className="mb-4">
              <label className="text-xs font-medium text-white/60 mb-2 block">What you can offer</label>
              <textarea
                placeholder="Describe your skills, experience, or unique contributions..."
                className="w-full h-16 rounded-[8px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50 resize-none"
                value={whatYouOffer}
                onChange={(e) => setWhatYouOffer(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="text-xs font-medium text-white/60 mb-2 block">Email</label>
              <input
                type="email"
                placeholder={user?.email || "your@email.com"}
                className="w-full rounded-[8px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="text-xs font-medium text-white/60 mb-2 block">Phone (optional)</label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="w-full rounded-[8px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Socials */}
            <div className="mb-4">
              <label className="text-xs font-medium text-white/60 mb-2 block">Social Links (optional)</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="GitHub URL"
                  className="w-full rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                  value={socials.github}
                  onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  className="w-full rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                  value={socials.linkedin}
                  onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Portfolio URL"
                  className="w-full rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                  value={socials.portfolio}
                  onChange={(e) => setSocials({ ...socials, portfolio: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Twitter/X URL"
                  className="w-full rounded-[6px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#7f77dd]/50"
                  value={socials.twitter}
                  onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowPitchModal(false)}
                className="flex-1 rounded-[8px] border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSendPitch}
                className="flex-1 rounded-[8px] bg-[#7f77dd] px-4 py-2 text-sm font-medium text-white hover:bg-[#7f77dd]/90"
              >
                Send Pitch
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectDetail;



