import Topbar from "../components/layout/Topbar";
import StepBar from "../components/post/StepBar";
import CategorySelector from "../components/post/CategorySelector";
import DynamicFields from "../components/post/DynamicFields";

const PostProject = ({
  currentStep = 2,
  categories = [],
  form = {},
  dynamicFields = [],
  roles = [],
  onCategorySelect,
  onChange,
  onBack,
  onNext,
}) => {
  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title="Post a project" subtitle="Share what you're building with the community" />

      <div className="mx-auto max-w-[680px] px-7 py-7">
        <StepBar currentStep={currentStep} />

        <div className="mb-[22px]">
          <label className="mb-2 block text-[12px] text-white/50">
            Project category <span className="text-[#7f77dd]/80">*</span>
          </label>
          <CategorySelector categories={categories} selected={form.category} onSelect={onCategorySelect} />
        </div>

        <div className="mb-[22px]">
          <label className="mb-2 block text-[12px] text-white/50">
            Project title <span className="text-[#7f77dd]/80">*</span>
          </label>
          <input
            className="w-full rounded-[9px] border border-white/10 bg-[#111118] px-[14px] py-[10px] text-[13px] text-white/70 outline-none"
            placeholder="e.g. SaaS Analytics Dashboard"
            value={form.title || ""}
            onChange={(event) => onChange?.("title", event.target.value)}
          />
        </div>

        <div className="mb-[22px]">
          <label className="mb-2 block text-[12px] text-white/50">
            Description <span className="text-[#7f77dd]/80">*</span>
          </label>
          <textarea
            className="h-[90px] w-full resize-none rounded-[9px] border border-white/10 bg-[#111118] px-[14px] py-[10px] text-[13px] text-white/70 outline-none"
            placeholder="Describe your project, what you're building and what stage you're at..."
            value={form.description || ""}
            onChange={(event) => onChange?.("description", event.target.value)}
          />
        </div>

        <DynamicFields category={form.category || ""} fields={dynamicFields} onChange={onChange} />

        <div className="mb-[22px]">
          <label className="mb-2 block text-[12px] text-white/50">Roles needed</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {roles.map((role) => (
              <div key={role} className="flex items-center gap-2 rounded-[9px] border border-white/10 bg-[#0d0d14] px-[12px] py-[10px]">
                <span className="h-[7px] w-[7px] rounded-full bg-[rgba(29,158,117,0.6)]" />
                <span className="text-[12px] text-white/45">{role}</span>
              </div>
            ))}
            <div className="rounded-[9px] border border-dashed border-white/10 px-[12px] py-[10px] text-[12px] text-white/30">
              + Add role
            </div>
          </div>
        </div>

        <div className="mb-[22px]">
          <label className="mb-2 block text-[12px] text-white/50">Cover image</label>
          <div className="cursor-pointer rounded-[10px] border border-dashed border-white/10 px-6 py-6 text-center transition hover:border-[#7f77dd]/30 hover:bg-[#7f77dd]/5">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-[8px] bg-white/5">
              <UploadIcon className="h-4 w-4 text-white/40" />
            </div>
            <div className="text-[12px] text-white/35">Drop an image or click to upload</div>
            <div className="mt-1 text-[11px] text-white/20">PNG, JPG up to 5MB</div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-[9px] border border-white/10 px-5 py-[9px] text-[13px] text-white/45"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-[9px] bg-[#7f77dd] px-6 py-[9px] text-[13px] font-medium text-white"
          >
            Continue to roles & links
          </button>
        </div>
      </div>
    </main>
  );
};

const UploadIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 10V3M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.3" />
    <path d="M3 12h10" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export default PostProject;
