const filters = ["All", "For you", "Dev", "Design", "Web3", "AI / ML", "Game dev"];

const FeedFilters = ({ activeFilter = "All", onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange?.(filter)}
            className={`rounded-full border px-[14px] py-[5px] text-[12px] ${
              isActive
                ? "border-[#7f77dd]/35 bg-[#7f77dd]/15 text-[#afa9ec]"
                : "border-white/10 text-white/40"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};

export default FeedFilters;
