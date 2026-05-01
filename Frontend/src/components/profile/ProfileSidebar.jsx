const ProfileSidebar = ({ skills = [], experienceLevel = "", availability = "", links = {}, activity = [] }) => {
  return (
    <aside className="w-[220px] flex-shrink-0">
      <div className="mb-3 rounded-[11px] border border-white/10 bg-[#111118] p-4">
        <div className="mb-[10px] text-[11px] uppercase tracking-[0.8px] text-white/30">Skills</div>
        <div className="flex flex-wrap gap-[6px]">
          {skills.length ? (
            skills.map((skill) => (
              <span key={skill} className="rounded-full border border-white/10 px-[9px] py-[3px] text-[11px] text-white/45">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-white/30">No skills listed</span>
          )}
        </div>
      </div>

      <div className="mb-3 rounded-[11px] border border-white/10 bg-[#111118] p-4">
        <div className="mb-[10px] text-[11px] uppercase tracking-[0.8px] text-white/30">Profile</div>
        <div className="space-y-2 text-[12px] text-white/45">
          <div>Experience: <span className="text-white/70">{experienceLevel || "Not set"}</span></div>
          <div>Availability: <span className="text-white/70">{availability || "Not set"}</span></div>
        </div>
      </div>

      <div className="mb-3 rounded-[11px] border border-white/10 bg-[#111118] p-4">
        <div className="mb-[10px] text-[11px] uppercase tracking-[0.8px] text-white/30">Links</div>
        <div className="space-y-2 text-[12px]">
          {links.github ? <a href={links.github} className="block text-[#afa9ec] hover:text-white">GitHub</a> : null}
          {links.linkedin ? <a href={links.linkedin} className="block text-[#afa9ec] hover:text-white">LinkedIn</a> : null}
          {links.portfolio ? <a href={links.portfolio} className="block text-[#afa9ec] hover:text-white">Portfolio</a> : null}
          {!links.github && !links.linkedin && !links.portfolio ? <span className="text-[11px] text-white/30">No links added</span> : null}
        </div>
      </div>

      <div className="rounded-[11px] border border-white/10 bg-[#111118] p-4">
        <div className="mb-[10px] text-[11px] uppercase tracking-[0.8px] text-white/30">Activity</div>
        {activity.length ? (
          <div className="space-y-2 text-[12px] text-white/30">
            {activity.map((item, index) => (
              <div key={item.label || index}>{item.label || item}</div>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-white/30">No activity yet</span>
        )}
      </div>
    </aside>
  );
};

export default ProfileSidebar;
