import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useApp } from "../context/AppContext";
import Topbar from "../components/layout/Topbar";

const DesignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const { addToast } = useToast();
  const { toggleSidebar } = useApp();

  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchDesign();
  }, [id]);

  const fetchDesign = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/designs/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch design");
      }

      setDesign(data.design);
      setComments(data.design.comments || []);

      if (user) {
        setLiked(data.design.likes?.some(id => id.toString() === user._id.toString()) || false);
        setSaved(data.design.saves?.some(id => id.toString() === user._id.toString()) || false);
        setIsFollowing(data.design.owner?.followers?.some(id => id.toString() === user._id.toString()) || false);
      }
    } catch (error) {
      console.error("Error fetching design:", error);
      setError(error.message || "Failed to load design");
      addToast(error.message || "Failed to load design", "error");
      setTimeout(() => navigate("/designs"), 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      console.log(`[Like Detail] Starting like request for design ${id}`);
      const res = await authFetch(`/designs/${id}/like`, {
        method: "POST",
      });
      
      console.log(`[Like Detail] Response status:`, res.status, res.ok);
      const data = await res.json();
      console.log(`[Like Detail] Response data:`, data);

      if (res.ok) {
        console.log(`[Like Detail] Success! Liked =`, data.liked);
        setLiked(data.liked);
        setDesign(data.design);
      } else {
        console.error(`[Like Detail] Error response:`, data);
        addToast(data.message || "Error liking design", "error");
      }
    } catch (error) {
      console.error(`[Like Detail] Catch error:`, error);
      addToast(error.message || "Error liking design", "error");
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      console.log(`[Save Detail] Starting save request for design ${id}`);
      const res = await authFetch(`/designs/${id}/save`, {
        method: "POST",
      });
      
      console.log(`[Save Detail] Response status:`, res.status, res.ok);
      const data = await res.json();
      console.log(`[Save Detail] Response data:`, data);

      if (res.ok) {
        console.log(`[Save Detail] Success! Saved =`, data.saved);
        setSaved(data.saved);
        addToast(data.saved ? "Design saved!" : "Design removed from saves", "success");
      } else {
        console.error(`[Save Detail] Error response:`, data);
        addToast(data.message || "Error saving design", "error");
      }
    } catch (error) {
      console.error(`[Save Detail] Catch error:`, error);
      addToast(error.message || "Error saving design", "error");
    }
  };

  const handleFollow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      console.log(`[Follow Detail] Starting follow request for user ${design.owner._id}`);
      const res = await authFetch(`/users/${design.owner._id}/follow`, {
        method: "PUT",
      });
      
      console.log(`[Follow Detail] Response status:`, res.status, res.ok);
      const data = await res.json();
      console.log(`[Follow Detail] Response data:`, data);

      if (res.ok) {
        console.log(`[Follow Detail] Success! IsFollowing =`, data.isFollowing);
        setIsFollowing(data.isFollowing);
        addToast(data.isFollowing ? "Following designer!" : "Unfollowed designer", "success");
      } else {
        console.error(`[Follow Detail] Error response:`, data);
        addToast(data.message || "Error following designer", "error");
      }
    } catch (error) {
      console.error(`[Follow Detail] Catch error:`, error);
      addToast(error.message || "Error following designer", "error");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await authFetch(`/designs/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ text: commentText }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments([data.comment, ...comments]);
        setCommentText("");
        addToast("Comment added!", "success");
      }
    } catch (error) {
      addToast("Error adding comment", "error");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090e] flex items-center justify-center text-white/40">
        <div className="text-center">
          <p className="text-lg">Loading design...</p>
        </div>
      </main>
    );
  }

  if (error || !design) {
    return (
      <main className="min-h-screen bg-[#09090e] flex items-center justify-center text-white/40">
        <div className="text-center">
          <p className="text-lg text-red-400">{error || "Design not found"}</p>
          <button
            onClick={() => navigate("/designs")}
            className="mt-4 px-4 py-2 rounded-lg bg-[#7f77dd] text-white hover:bg-[#7f77dd]/90"
          >
            Back to Designs
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar
        variant="breadcrumb"
        breadcrumb={{ base: "Designs", detail: design.title }}
        onBack={() => navigate("/designs")}
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 sm:px-6 lg:px-7 py-4 sm:py-6 lg:py-7">
        <div className="flex-1 min-w-0">
          {/* Design Images */}
          {design.images?.length > 0 && (
            <div className="mb-6">
              <div className="rounded-[12px] border border-white/10 bg-[#111118] overflow-hidden">
                <img
                  src={design.images[0].url}
                  alt={design.title}
                  className="w-full h-auto object-cover max-h-[600px]"
                />
              </div>
              {design.images[0].caption && (
                <p className="text-xs text-white/40 mt-2">{design.images[0].caption}</p>
              )}
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <span className="inline-block rounded-[6px] bg-[#7f77dd]/15 px-3 py-1 text-[11px] text-[#afa9ec] mb-3">
              {design.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-medium text-white mb-2">{design.title}</h1>
            
            {/* Designer Info */}
            <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-[8px] border border-white/10 bg-white/5">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition flex-1"
                onClick={() => navigate(`/profile/${design.owner?.username}`)}
              >
                <div className="h-10 w-10 rounded-full bg-[#7f77dd]/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-[#afa9ec]">
                    {design.owner?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white hover:text-[#7f77dd] transition truncate">@{design.owner?.username}</div>
                  {design.owner?.roles?.[0] && (
                    <div className="text-xs text-white/40 truncate">{design.owner.roles[0]}</div>
                  )}
                </div>
              </div>
              {user && user._id !== design.owner._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex-shrink-0 ${
                    isFollowing
                      ? "bg-white/10 text-white/60 hover:bg-white/20"
                      : "bg-[#7f77dd] text-white hover:bg-[#7f77dd]/90"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-white/60 mb-2">About</h2>
            <p className="text-sm text-white/55 leading-relaxed">{design.description}</p>
          </div>

          {/* Tools */}
          {design.tools?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-white/60 mb-3">Tools Used</h2>
              <div className="flex flex-wrap gap-2">
                {design.tools.map((tool) => (
                  <span key={tool} className="rounded-[6px] bg-white/5 px-3 py-1.5 text-xs text-white/40">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {design.tags?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-white/60 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {design.tags.map((tag) => (
                  <span key={tag} className="text-xs text-white/40 px-2 py-1 rounded border border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-white/60 mb-3">Comments ({comments.length})</h2>

            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                placeholder="Share your feedback..."
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
          <div className="rounded-[12px] border border-white/10 bg-[#111118] p-4 sticky top-20 space-y-4">
            {/* Stats */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-white/40 mb-1">Views</div>
                <div className="text-lg font-medium text-white">{design.views || 0}</div>
              </div>
              <button
                onClick={handleLike}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  liked
                    ? "bg-[#d85a30]/10 text-[#d85a30]"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <HeartIcon filled={liked} />
                {design.likes?.length || 0} Likes
              </button>
              <button
                onClick={handleSave}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  saved
                    ? "bg-[#7f77dd]/10 text-[#7f77dd]"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <BookmarkIcon filled={saved} />
                {design.saves?.length || 0} Saves
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const HeartIcon = ({ filled = false }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BookmarkIcon = ({ filled = false }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2z" />
    <polyline points="17 1 12 5 7 1" />
  </svg>
);

export default DesignDetail;
