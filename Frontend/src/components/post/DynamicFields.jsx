const DynamicFields = ({ category, fields = [], onChange }) => {
  if (!category) return null;

  return (
    <div className="mb-[22px] rounded-[12px] border border-[#7f77dd]/20 bg-[#111118] p-4">
      <div className="mb-[14px] text-[11px] uppercase tracking-[0.5px] text-[#afa9ec]">
        {category} - details
      </div>
      {fields.length ? (
        fields.map((field) => {
          if (field.type === "row") {
            return (
              <div key={field.name} className="grid gap-3 sm:grid-cols-2">
                {field.fields?.map((inner) => (
                  <Field key={inner.name} field={inner} onChange={onChange} />
                ))}
              </div>
            );
          }

          return <Field key={field.name} field={field} onChange={onChange} />;
        })
      ) : (
        <div className="text-[12px] text-white/30">No dynamic fields available</div>
      )}
    </div>
  );
};

const Field = ({ field, onChange }) => {
  if (field.type === "tags") {
    return (
      <div className="mb-[14px]">
        <label className="mb-2 block text-[12px] text-white/50">{field.label}</label>
        <div className="flex min-h-[42px] flex-wrap items-center gap-[6px] rounded-[9px] border border-white/10 bg-[#0d0d14] px-[10px] py-2">
          {field.value?.length ? (
            field.value.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-[#7f77dd]/15 px-[10px] py-[3px] text-[11px] text-[#afa9ec]">
                {tag}
                <span className="text-[10px] opacity-50">x</span>
              </span>
            ))
          ) : (
            <span className="text-[12px] text-white/20">Add more...</span>
          )}
        </div>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="mb-[14px]">
        <label className="mb-2 block text-[12px] text-white/50">{field.label}</label>
        <select
          value={field.value || ""}
          onChange={(event) => onChange?.(field.name, event.target.value)}
          className="w-full rounded-[9px] border border-white/10 bg-[#111118] px-[14px] py-[10px] text-[13px] text-white/60 outline-none"
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return null;
};

export default DynamicFields;
