import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import Topbar from "../components/layout/Topbar";

const DesignsFeed = () => {
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const { addToast } = useToast();
  const { isDark } = useTheme();

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = ["UI Design", "Web Design", "App Design", "Branding", "Illustration", "Motion", "3D", "Other"];

  useEffect(() => {
    fetchDesigns();
  }, [category, page]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page,
        limit: 12,
        ...(category && { category }),
      }).toString();

      const res = await authFetch(`/designs?${query}`);
      const data = await res.json();

      if (res.ok) {
        if (page === 1) {
          setDesigns(data.designs);
        } else {
          setDesigns((prev) => [...prev, ...data.designs]);
        }
        setHasMore(data.pagination.page < data.pagination.pages);
      }
    } catch (error) {
      addToast("Error loading designs", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  return (
    <div className={isDark ? "min-h-screen bg-[#09090e]" : "min-h-screen bg-gray-50"}>
      <Topbar variant="search" showNotifDot={false} />

      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <div className={`mb-6 rounded-[20px] ${isDark ? "border-white/10 bg-[#111118]" : "border-gray-300 bg-white"} p-4 sm:p-5`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={`text-[11px] uppercase tracking-[0.24em] ${isDark ? "text-white/35" : "text-gray-500"}`}>Design categories</p>
              <h1 className={`mt-2 text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"} sm:text-2xl`}>Explore Design Categories</h1>
              <p className={`mt-2 max-w-2xl text-sm ${isDark ? "text-white/45" : "text-gray-600"}`}>
                Switch between product, branding, illustration, motion, and more without losing the visual flow of the page.
              </p>
            </div>
            <div className={`rounded-full ${isDark ? "border-white/10 bg-white/[0.03]" : "border-gray-300 bg-gray-100"} px-4 py-2 text-sm ${isDark ? "text-white/55" : "text-gray-600"}`}>
              Showing <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{category || "All Designs"}</span>
            </div>
          </div>

          <div className="-mx-1 mt-5 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2 px-1">
              <button
                onClick={() => handleCategoryChange("")}
                className={`rounded-full px-4 py-2.5 text-sm transition whitespace-nowrap ${
                  category === ""
                    ? "bg-[#7f77dd] text-white shadow-[0_10px_30px_rgba(127,119,221,0.28)]"
                    : isDark
                    ? "border border-white/10 bg-[#0d0d14] text-white/60 hover:border-white/20 hover:text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                All Designs
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full px-4 py-2.5 text-sm transition whitespace-nowrap ${
                    category === cat
                      ? "bg-[#7f77dd] text-white shadow-[0_10px_30px_rgba(127,119,221,0.28)]"
                      : isDark
                      ? "border border-white/10 bg-[#0d0d14] text-white/60 hover:border-white/20 hover:text-white"
                      : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          {loading && designs.length === 0 ? (
            <div className={`flex items-center justify-center h-96 ${isDark ? "text-white/40" : "text-gray-400"}`}>
              <p>Loading designs...</p>
            </div>
          ) : designs.length === 0 ? (
            <div className={`flex items-center justify-center h-96 ${isDark ? "text-white/40" : "text-gray-400"}`}>
              <p>No designs found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {designs.map((design) => (
                  <DesignCard key={design._id} design={design} onUpdate={fetchDesigns} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-[#7f77dd] text-white hover:bg-[#7f77dd]/90 disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DesignCard = ({ design, onUpdate }) => {
  const { user, authFetch } = useAuth();
  const { addToast } = useToast();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(design.likes?.length || 0);

  useEffect(() => {
    if (user && design.owner) {
      setLiked(design.likes?.some(id => id.toString() === user._id.toString()) || false);
      setSaved(design.saves?.some(id => id.toString() === user._id.toString()) || false);
      setIsFollowing(design.owner?.followers?.some(id => id.toString() === user._id.toString()) || false);
    }
  }, [user, design]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      console.log(`[Like] Starting like request for design ${design._id}`);
      const res = await authFetch(`/designs/${design._id}/like`, {
        method: "POST",
      });
      
      console.log(`[Like] Response status:`, res.status, res.ok);
      const data = await res.json();
      console.log(`[Like] Response data:`, data);

      if (res.ok) {
        console.log(`[Like] Success! Liked =`, data.liked);
        setLiked(data.liked);
        setLikeCount(data.design.likes.length);
        addToast(data.liked ? "Design liked!" : "Design unliked!", "success");
      } else {
        console.error(`[Like] Error response:`, data);
        addToast(data.message || "Error liking design", "error");
      }
    } catch (error) {
      console.error(`[Like] Catch error:`, error);
      addToast(error.message || "Error liking design", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      console.log(`[Save] Starting save request for design ${design._id}`);
      const res = await authFetch(`/designs/${design._id}/save`, {
        method: "POST",
      });
      
      console.log(`[Save] Response status:`, res.status, res.ok);
      const data = await res.json();
      console.log(`[Save] Response data:`, data);

      if (res.ok) {
        console.log(`[Save] Success! Saved =`, data.saved);
        setSaved(data.saved);
        addToast(data.saved ? "Design saved!" : "Design removed from saves", "success");
      } else {
        console.error(`[Save] Error response:`, data);
        addToast(data.message || "Error saving design", "error");
      }
    } catch (error) {
      console.error(`[Save] Catch error:`, error);
      addToast(error.message || "Error saving design", "error");
    }
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      console.log(`[Follow] Starting follow request for user ${design.owner._id}`);
      const res = await authFetch(`/users/${design.owner._id}/follow`, {
        method: "PUT",
      });
      
      console.log(`[Follow] Response status:`, res.status, res.ok);
      const data = await res.json();
      console.log(`[Follow] Response data:`, data);

      if (res.ok) {
        console.log(`[Follow] Success! IsFollowing =`, data.isFollowing);
        setIsFollowing(data.isFollowing);
        addToast(data.isFollowing ? "Following designer!" : "Unfollowed designer", "success");
      } else {
        console.error(`[Follow] Error response:`, data);
        addToast(data.message || "Error following designer", "error");
      }
    } catch (error) {
      console.error(`[Follow] Catch error:`, error);
      addToast(error.message || "Error following designer", "error");
    }
  };

  return (
    <div className={`group rounded-[12px] ${isDark ? "border-white/10 bg-[#111118] hover:border-white/20" : "border-gray-300 bg-white hover:border-gray-400"} border overflow-hidden transition cursor-pointer`}
      onClick={() => navigate(`/design/${design._id}`)}
    >
      {/* Image */}
      <div className={`relative h-[200px] sm:h-[240px] ${isDark ? "bg-[#0d0d14]" : "bg-gray-100"} overflow-hidden`}>
        {design.images?.[0]?.url ? (
          <img
            src={design.images[0].url}
            alt={design.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${isDark ? "text-white/20" : "text-gray-300"}`}>
            No image
          </div>
        )}

        {/* Category badge */}
        <span className={`absolute top-2 left-2 rounded-[6px] ${isDark ? "bg-[#7f77dd]/90" : "bg-[#7f77dd]"} px-2 py-1 text-[10px] font-medium text-white`}>
          {design.category}
        </span>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
          <button
            onClick={handleLike}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
            title="Like"
          >
            <HeartIcon filled={liked} />
          </button>
          <button
            onClick={handleSave}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
            title="Save"
          >
            <BookmarkIcon filled={saved} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`p-4 ${isDark ? "bg-[#111118]" : "bg-white"}`}>
        {/* Designer Info */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div 
            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${design.owner?.username}`);
            }}
          >
            <div className={`h-8 w-8 rounded-full ${isDark ? "bg-[#7f77dd]/25" : "bg-[#7f77dd]/15"} flex items-center justify-center flex-shrink-0`}>
              <span className={`text-[10px] font-medium ${isDark ? "text-[#afa9ec]" : "text-[#7f77dd]"}`}>
                {design.owner?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className={`text-xs font-medium ${isDark ? "text-white hover:text-[#7f77dd]" : "text-gray-900 hover:text-[#7f77dd]"} truncate transition`}>
                @{design.owner?.username}
              </div>
              {design.owner?.roles?.[0] && (
                <div className={`text-[10px] ${isDark ? "text-white/40" : "text-gray-500"} truncate`}>
                  {design.owner.roles[0]}
                </div>
              )}
            </div>
          </div>
          {user && user._id !== design.owner._id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollow(e);
              }}
              className={`px-2 py-1 rounded text-xs font-medium transition flex-shrink-0 ${
                isFollowing
                  ? isDark
                    ? "bg-white/10 text-white/60 hover:bg-white/20"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  : "bg-[#7f77dd] text-white hover:bg-[#7f77dd]/90"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"} mb-1 line-clamp-2`}>{design.title}</h3>

        {/* Description */}
        <p className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"} mb-3 line-clamp-2`}>{design.description}</p>

        {/* Tags */}
        {design.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {design.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className={`text-[10px] ${isDark ? "text-white/40 bg-white/5" : "text-gray-600 bg-gray-100"} px-1.5 py-0.5 rounded`}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className={`flex gap-3 pt-3 ${isDark ? "border-t border-white/10 text-white/50" : "border-t border-gray-200 text-gray-500"} text-xs`}>
          <button onClick={handleLike} className={`flex items-center gap-1 hover:${isDark ? "text-white" : "text-gray-900"} transition ${liked ? "text-[#d85a30]" : ""}`}>
            <HeartIcon filled={liked} size="sm" />
            {likeCount}
          </button>
          <button className={`flex items-center gap-1 hover:${isDark ? "text-white" : "text-gray-900"} transition`}>
            <CommentIcon size="sm" />
            {design.comments?.length || 0}
          </button>
          <button onClick={handleSave} className={`flex items-center gap-1 hover:${isDark ? "text-white" : "text-gray-900"} transition ${saved ? "text-[#7f77dd]" : ""}`}>
            <BookmarkIcon filled={saved} size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

const HeartIcon = ({ filled = false, size = "md" }) => {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={sizeClass}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};

const BookmarkIcon = ({ filled = false, size = "md" }) => {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={sizeClass}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2z" />
      <polyline points="17 1 12 5 7 1" />
    </svg>
  );
};

const CommentIcon = ({ size = "md" }) => {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={sizeClass}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
};

export default DesignsFeed;
