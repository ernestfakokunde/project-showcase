const CATEGORY_MAP = {
  dev: {
    badge: "bg-[rgba(127,119,221,0.15)] text-[#afa9ec]",
    avatar: "bg-[rgba(127,119,221,0.2)] text-[#afa9ec]",
    banner: "bg-[rgba(127,119,221,0.12)]",
    icon: "text-[#7f77dd]",
  },
  design: {
    badge: "bg-[rgba(29,158,117,0.15)] text-[#5dcaa5]",
    avatar: "bg-[rgba(29,158,117,0.2)] text-[#5dcaa5]",
    banner: "bg-[rgba(29,158,117,0.12)]",
    icon: "text-[#5dcaa5]",
  },
  web3: {
    badge: "bg-[rgba(216,90,48,0.15)] text-[#f0997b]",
    avatar: "bg-[rgba(216,90,48,0.2)] text-[#f0997b]",
    banner: "bg-[rgba(216,90,48,0.12)]",
    icon: "text-[#f0997b]",
  },
  "ai/ml": {
    badge: "bg-[rgba(52,122,221,0.15)] text-[#85b7eb]",
    avatar: "bg-[rgba(52,122,221,0.2)] text-[#85b7eb]",
    banner: "bg-[rgba(52,122,221,0.12)]",
    icon: "text-[#85b7eb]",
  },
};

import ReportButton from '../ReportButton';

const FeedCard = ({
  _id,
  title,
  description,
  category,
  techStack = [],
  author,
  likes,
  commentsCount,
  spotsLeft,
  createdAt,
}) => {
  if (!title) return null;

  const key = normalizeCategory(category);
  const styles = CATEGORY_MAP[key] || CATEGORY_MAP.dev;
  const initials = (author?.initials || author?.username?.slice(0, 2) || "SL").toUpperCase();
  const timeAgo = createdAt || "";

  return (
    <article className="mb-[14px] overflow-hidden rounded-[14px] border border-white/10 bg-[#111118] transition hover:border-[#7f77dd]/30">
      <div className="flex items-center gap-[10px] px-4 pt-[14px]">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-medium ${styles.avatar}`}>
          {initials}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-medium text-white">
            @{author?.username || "stacker"}
            {author?.role ? <span className="text-[12px] font-normal text-white/30"> � {author.role}</span> : null}
          </div>
          <div className="text-[11px] text-white/30">{timeAgo}</div>
        </div>
        <span className={`rounded-[6px] px-[9px] py-[3px] text-[11px] ${styles.badge}`}>
          {category || "Dev"}
        </span>
      </div>

      <div className={`mx-4 mt-3 flex h-[110px] items-center justify-center rounded-[10px] ${styles.banner}`}>
        <CategoryIcon category={key} className="h-[56px] w-[56px]" />
      </div>

      <div className="px-4 py-3">
        <div className="mb-[5px] text-[15px] font-medium text-white">{title}</div>
        <div className="mb-[10px] text-[12px] leading-[1.55] text-white/40">
          {description || "No description provided."}
        </div>
        <div className="flex flex-wrap gap-[6px]">
          {techStack?.length ? (
            techStack.map((tag) => (
              <span key={tag} className="rounded-[5px] bg-white/5 px-2 py-[2px] text-[11px] text-white/40">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-white/30">No tags yet</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-4 py-[10px]">
        <div className="flex gap-[14px]">
          <Stat icon={<HeartIcon />} value={formatCount(likes)} />
          <Stat icon={<CommentIcon />} value={formatCount(commentsCount)} />
          <Stat icon={<ClockIcon />} value={spotsLeftLabel(spotsLeft)} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-[7px] border border-[#7f77dd]/30 bg-[#7f77dd]/15 px-[14px] py-[5px] text-[11px] font-medium text-[#afa9ec]"
          >
            Request to join
          </button>
          <ReportButton itemId={_id} itemType="project" />
        </div>
      </div>
    </article>
  );
};

const Stat = ({ icon, value }) => (
  <span className="flex items-center gap-1 text-[11px] text-white/30">
    <span className="text-white/30">{icon}</span>
    {value}
  </span>
);

const CategoryIcon = ({ category, className }) => {
  if (category === "design") {
    return (
      <svg viewBox="0 0 56 56" fill="none" className={className}>
        <circle cx="28" cy="28" r="18" stroke="#5dcaa5" strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="28" cy="28" r="9" fill="#5dcaa5" opacity="0.4" />
      </svg>
    );
  }
  if (category === "web3") {
    return (
      <svg viewBox="0 0 56 56" fill="none" className={className}>
        <polygon points="28,10 46,38 10,38" stroke="#f0997b" strokeWidth="1.5" fill="none" opacity="0.6" />
        <polygon points="28,18 39,36 17,36" fill="#f0997b" opacity="0.3" />
      </svg>
    );
  }
  if (category === "ai/ml") {
    return (
      <svg viewBox="0 0 56 56" fill="none" className={className}>
        <rect x="16" y="16" width="24" height="24" rx="4" stroke="#85b7eb" strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="28" cy="28" r="6" fill="#85b7eb" opacity="0.4" />
        <line x1="28" y1="10" x2="28" y2="16" stroke="#85b7eb" strokeWidth="1" opacity="0.4" />
        <line x1="28" y1="40" x2="28" y2="46" stroke="#85b7eb" strokeWidth="1" opacity="0.4" />
        <line x1="10" y1="28" x2="16" y2="28" stroke="#85b7eb" strokeWidth="1" opacity="0.4" />
        <line x1="40" y1="28" x2="46" y2="28" stroke="#85b7eb" strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 56" fill="none" className={className}>
      <rect x="8" y="8" width="18" height="18" rx="4" fill="#7f77dd" opacity="0.5" />
      <rect x="30" y="8" width="18" height="18" rx="4" fill="#7f77dd" opacity="0.3" />
      <rect x="8" y="30" width="18" height="18" rx="4" fill="#7f77dd" opacity="0.3" />
      <rect x="30" y="30" width="18" height="18" rx="4" fill="#7f77dd" opacity="0.5" />
    </svg>
  );
};

const HeartIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-3 w-3">
    <path d="M6 10s-5-3-5-6a3 3 0 016 0 3 3 0 016 0c0 3-5 6-5 6z" />
  </svg>
);

const CommentIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-3 w-3">
    <path d="M10 7c0 .6-.6 1-1 1H3l-2 2V3c0-.6.6-1 1-1h7c.6 0 1 .6 1 1v4z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-3 w-3">
    <circle cx="6" cy="6" r="5" />
    <line x1="6" y1="4" x2="6" y2="6" />
    <line x1="6" y1="6" x2="8" y2="7.5" />
  </svg>
);

const formatCount = (value) => (typeof value === "number" ? value : 0);

const normalizeCategory = (category) => (category || "dev").toLowerCase().replace("ai / ml", "ai/ml").replace("ai/ml", "ai/ml");

const spotsLeftLabel = (spotsLeft) => {
  if (typeof spotsLeft === "number") return `${spotsLeft} spots left`;
  return "Spots left";
};

export default FeedCard;
