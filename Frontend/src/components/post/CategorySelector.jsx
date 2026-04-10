const CategorySelector = ({ categories = [], selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-4">
      {categories.length ? (
        categories.map((category) => {
          const isSelected = category.key === selected;
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => onSelect?.(category.key)}
              className={`rounded-[10px] border px-[10px] py-3 text-center text-[11px] transition ${
                isSelected
                  ? "border-[#7f77dd]/50 bg-[#7f77dd]/10 text-[#afa9ec]"
                  : "border-white/10 bg-[#111118] text-white/50 hover:border-white/20"
              }`}
            >
              <div className="mb-1 flex items-center justify-center text-[18px] text-white/50">
                {category.icon || ""}
              </div>
              {category.label}
            </button>
          );
        })
      ) : (
        <div className="col-span-full text-[12px] text-white/30">No categories available</div>
      )}
    </div>
  );
};

export default CategorySelector;
