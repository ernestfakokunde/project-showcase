const PitchModal = ({ ownerUsername, onSubmit }) => {
  return (
    <div className="rounded-[12px] border border-[#7f77dd]/30 bg-[#111118] p-4">
      <div className="mb-1 text-[13px] font-medium text-white">Request to join</div>
      <div className="mb-3 text-[11px] text-white/35">
        Tell @{ownerUsername || "owner"} why you'd be a great fit and what you bring to the project.
      </div>
      <textarea
        className="h-[80px] w-full resize-none rounded-[8px] border border-white/10 bg-[#0d0d14] px-3 py-2 text-[12px] text-white/60 outline-none"
        placeholder="Hi! I'm a React dev with 3 years experience in data viz. I've built similar dashboard components and would love to contribute..."
      />
      <button
        type="button"
        onClick={onSubmit}
        className="mt-2 w-full rounded-[8px] bg-[#7f77dd] py-[9px] text-[12px] font-medium text-white"
      >
        Send pitch
      </button>
    </div>
  );
};

export default PitchModal;
