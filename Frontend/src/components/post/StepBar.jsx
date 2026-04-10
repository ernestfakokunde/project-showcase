const steps = ["Category", "Project details", "Roles & links", "Review"];

const StepBar = ({ currentStep = 1 }) => {
  return (
    <div className="mb-7 flex items-center">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const state = stepNumber < currentStep ? "done" : stepNumber === currentStep ? "active" : "idle";
        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <div className={`flex h-[26px] w-[26px] items-center justify-center rounded-full text-[11px] font-medium ${stepClass(state)}`}>
                {state === "done" ? <CheckIcon className="h-3 w-3 text-white" /> : stepNumber}
              </div>
              <span className={`text-[12px] ${labelClass(state)}`}>{label}</span>
            </div>
            {index < steps.length - 1 ? <div className="mx-[10px] h-px flex-1 bg-white/10" /> : null}
          </div>
        );
      })}
    </div>
  );
};

const stepClass = (state) => {
  if (state === "done") return "bg-[#7f77dd] text-white";
  if (state === "active") return "border border-[#7f77dd]/40 bg-[#7f77dd]/20 text-[#afa9ec]";
  return "bg-white/5 text-white/20";
};

const labelClass = (state) => {
  if (state === "done") return "text-white/50";
  if (state === "active") return "text-[#afa9ec]";
  return "text-white/25";
};

const CheckIcon = ({ className }) => (
  <svg viewBox="0 0 12 12" fill="none" className={className}>
    <path d="M2.5 6.5l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default StepBar;
