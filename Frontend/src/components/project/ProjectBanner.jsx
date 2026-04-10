const ProjectBanner = ({ category }) => {
  const styles = bannerStyle(category);
  return (
    <div className={`flex h-[200px] items-center justify-center rounded-[14px] border border-[#7f77dd]/20 ${styles.bg}`}>
      <BannerIcon category={category} className="h-20 w-20" />
    </div>
  );
};

const bannerStyle = (category = "") => {
  const key = category.toLowerCase();
  if (key.includes("design")) return { bg: "bg-[rgba(29,158,117,0.1)]" };
  if (key.includes("web3")) return { bg: "bg-[rgba(216,90,48,0.1)]" };
  if (key.includes("ai")) return { bg: "bg-[rgba(52,122,221,0.1)]" };
  return { bg: "bg-[rgba(127,119,221,0.1)]" };
};

const BannerIcon = ({ category, className }) => {
  const key = (category || "").toLowerCase();
  if (key.includes("design")) {
    return (
      <svg viewBox="0 0 80 80" fill="none" className={className}>
        <circle cx="40" cy="40" r="24" stroke="#5dcaa5" strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="40" cy="40" r="12" fill="#5dcaa5" opacity="0.4" />
      </svg>
    );
  }
  if (key.includes("web3")) {
    return (
      <svg viewBox="0 0 80 80" fill="none" className={className}>
        <polygon points="40,14 64,52 16,52" stroke="#f0997b" strokeWidth="1.5" fill="none" opacity="0.6" />
        <polygon points="40,22 54,50 26,50" fill="#f0997b" opacity="0.3" />
      </svg>
    );
  }
  if (key.includes("ai")) {
    return (
      <svg viewBox="0 0 80 80" fill="none" className={className}>
        <rect x="22" y="22" width="36" height="36" rx="5" stroke="#85b7eb" strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="40" cy="40" r="10" fill="#85b7eb" opacity="0.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className}>
      <rect x="10" y="10" width="26" height="26" rx="5" fill="#7f77dd" opacity="0.4" />
      <rect x="44" y="10" width="26" height="26" rx="5" fill="#7f77dd" opacity="0.25" />
      <rect x="10" y="44" width="26" height="26" rx="5" fill="#7f77dd" opacity="0.25" />
      <rect x="44" y="44" width="26" height="26" rx="5" fill="#7f77dd" opacity="0.4" />
    </svg>
  );
};

export default ProjectBanner;
