const ProfileSidebar = ({ skills = [], experience = [], activity = [] }) => {
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
        <div className="mb-[10px] text-[11px] uppercase tracking-[0.8px] text-white/30">Experience</div>
        {experience.length ? (
          experience.map((item, index) => (
            <div key={item.title || index} className="mb-[10px] flex items-start gap-2">
              <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-[#7f77dd]" />
              <div>
                <div className="text-[12px] font-medium text-white/70">{item.title}</div>
                <div className="text-[11px] text-white/30">{item.subtitle}</div>
              </div>
            </div>
          ))
        ) : (
          <span className="text-[11px] text-white/30">No experience added</span>
        )}
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
