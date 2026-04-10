const RolesGrid = ({ roles = [] }) => {
  if (!roles.length) {
    return <div className="text-[12px] text-white/30">No roles listed yet</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
      {roles.map((role) => (
        <div key={role.title} className="rounded-[10px] border border-white/10 bg-[#111118] p-3">
          <div className="text-[13px] font-medium text-white">{role.title}</div>
          <div className="text-[11px] text-white/35">{role.description}</div>
          <span className={`mt-[6px] inline-block rounded-full px-2 py-[2px] text-[10px] ${role.status === "Filled" ? "bg-white/5 text-white/30" : "bg-[rgba(29,158,117,0.15)] text-[#5dcaa5]"}`}>
            {role.status || "Open"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RolesGrid;
