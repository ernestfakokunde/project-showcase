const ProfileHeader = ({ user, stats = {}, isOwnProfile = false, onFollow }) => {
  const initials = (user?.username?.slice(0, 2) || user?.fullName?.slice(0, 2) || "SL").toUpperCase();
  const roles = user?.roles || [];
  const links = user?.links || {};

  return (
    <section className="bg-[#09090e]">
      <div className="relative h-[140px] border-b border-white/10 bg-[rgba(127,119,221,0.08)]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(127,119,221,0.08)_0px,rgba(127,119,221,0.08)_1px,transparent_1px,transparent_20px)] opacity-40" />
      </div>

      <div className="px-8">
        <div className="flex items-end justify-between gap-6 pt-[10px]">
          <div>
            <div className="relative inline-block -mt-9">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-[3px] border-[#09090e] bg-[rgba(127,119,221,0.3)] text-[22px] font-medium text-[#afa9ec]">
                {initials}
              </div>
              <div className="absolute bottom-[2px] right-[2px] flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#09090e] bg-[#7f77dd]">
                <CheckIcon className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div className="mt-[10px]">
              <div className="text-[20px] font-medium tracking-[-0.3px] text-white">{user?.fullName || "Unnamed"}</div>
              <div className="text-[13px] text-white/35">
                @{user?.username || "stacker"}
                {user?.createdAt ? ` - Joined ${user.createdAt}` : ""}
              </div>
              <div className="mt-[6px] flex flex-wrap gap-[6px]">
                {roles.length ? (
                  roles.map((role) => (
                    <span
                      key={role}
                      className={`rounded-full px-[9px] py-[3px] text-[11px] ${roleBadgeClass(role)}`}
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-white/30">No roles listed</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-[8px] border border-white/10 bg-white/5 px-4 py-[7px] text-[12px] text-white/50">
              Edit profile
            </button>
            <button
              type="button"
              onClick={onFollow}
              className="rounded-[8px] bg-[#7f77dd] px-[18px] py-[7px] text-[12px] font-medium text-white"
            >
              {isOwnProfile ? "Share" : "Follow"}
            </button>
          </div>
        </div>

        <div className="mt-3 text-[13px] leading-[1.6] text-white/45">
          {user?.bio || "No bio yet"}
        </div>

        <div className="mt-4 flex gap-5 border-b border-white/10 pb-4">
          <StatBlock label="Projects" value={stats.projects} />
          <StatBlock label="Followers" value={stats.followers} />
          <StatBlock label="Following" value={stats.following} />
          <StatBlock label="Collabs" value={stats.collabs} />
        </div>

        <div className="mt-4 flex flex-wrap gap-[10px]">
          {links.github ? <LinkPill label={links.github} icon={<UserIcon />} /> : null}
          {links.website ? <LinkPill label={links.website} icon={<MailIcon />} /> : null}
          {links.linkedin ? <LinkPill label={links.linkedin} icon={<LinkedinIcon />} /> : null}
          {!links.github && !links.website && !links.linkedin ? (
            <span className="text-[12px] text-white/30">No links added</span>
          ) : null}
        </div>
      </div>
    </section>
  );
};

const StatBlock = ({ label, value }) => (
  <div className="text-center">
    <div className="text-[16px] font-medium text-white">{typeof value === "number" ? value : 0}</div>
    <div className="text-[11px] text-white/30">{label}</div>
  </div>
);

const LinkPill = ({ label, icon }) => (
  <div className="flex items-center gap-[5px] rounded-[7px] border border-white/10 bg-white/5 px-[10px] py-[4px] text-[12px] text-white/35">
    <span className="text-white/60">{icon}</span>
    {label}
  </div>
);

const roleBadgeClass = (role) => {
  if (role?.toLowerCase().includes("design")) return "bg-[rgba(29,158,117,0.15)] text-[#5dcaa5]";
  return "bg-[rgba(127,119,221,0.15)] text-[#afa9ec]";
};

const CheckIcon = ({ className }) => (
  <svg viewBox="0 0 10 10" fill="none" className={className}>
    <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
    <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 11s1-3 5-3 5 3 5 3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
    <rect x="1" y="3" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 5l5 3 5-3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
    <path d="M9 1H3a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V3a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4 8V5M6 8V4M8 8V6" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export default ProfileHeader;
