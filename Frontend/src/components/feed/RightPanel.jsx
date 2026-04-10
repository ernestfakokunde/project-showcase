const RightPanel = ({ trending = [], suggestedUsers = [], popularTags = [] }) => {
  return (
    <aside className="w-[256px] border-l border-white/10 px-4 py-5">
      <div className="mb-6">
        <div className="mb-3 text-[11px] uppercase tracking-[0.8px] text-white/30">Trending this week</div>
        <div>
          {trending.length ? (
            trending.map((item, index) => (
              <div
                key={item?._id || item?.title || index}
                className="flex items-center gap-[10px] border-b border-white/5 py-2 last:border-b-0"
              >
                <span className="w-[14px] text-[12px] text-white/20">{index + 1}</span>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-white/70">{item?.title || "Untitled"}</div>
                  <div className="text-[11px] text-white/30">{item?.category || ""}</div>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-[#7f77dd]/80">
                  <HeartIcon className="h-3 w-3" /> {formatCount(item?.likes)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-[12px] text-white/30">No trending projects yet.</div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-3 text-[11px] uppercase tracking-[0.8px] text-white/30">Suggested builders</div>
        <div>
          {suggestedUsers.length ? (
            suggestedUsers.map((user, index) => (
              <div key={user?._id || user?.username || index} className="flex items-center gap-[9px] py-[7px]">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#7f77dd]/20 text-[11px] font-medium text-[#afa9ec]">
                  {(user?.initials || user?.username?.slice(0, 2) || "SL").toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-white/70">@{user?.username || "stacker"}</div>
                  <div className="text-[11px] text-white/30">{user?.role || "Member"}</div>
                </div>
                <span className="text-[11px] text-[#7f77dd]">Follow</span>
              </div>
            ))
          ) : (
            <div className="text-[12px] text-white/30">No suggestions yet.</div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-3 text-[11px] uppercase tracking-[0.8px] text-white/30">Popular tags</div>
        <div className="flex flex-wrap gap-[6px]">
          {popularTags.length ? (
            popularTags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-[10px] py-[4px] text-[11px] text-white/40">
                {tag}
              </span>
            ))
          ) : (
            <div className="text-[12px] text-white/30">No tags yet.</div>
          )}
        </div>
      </div>
    </aside>
  );
};

const HeartIcon = ({ className }) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
    <path d="M6 10s-5-3-5-6a3 3 0 016 0 3 3 0 016 0c0 3-5 6-5 6z" />
  </svg>
);

const formatCount = (value) => (typeof value === "number" ? value : 0);

export default RightPanel;
