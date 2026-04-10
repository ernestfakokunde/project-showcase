import FeedCard from "../components/feed/FeedCard";
import FeedFilters from "../components/feed/FeedFilters";
import RightPanel from "../components/feed/RightPanel";

const Feed = ({ projects = [], loading = false, trending = [], suggestedUsers = [], popularTags = [], activeFilter = "All", onFilterChange }) => {
  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <div className="flex">
        <div className="flex w-full max-w-[680px] flex-1 flex-col px-6 py-6">
          <div className="mb-5">
            <FeedFilters activeFilter={activeFilter} onFilterChange={onFilterChange} />
          </div>

          {loading ? (
            <div className="rounded-[14px] border border-white/10 bg-[#111118] p-6 text-sm text-white/50">
              Loading projects...
            </div>
          ) : projects.length ? (
            projects.map((project) => <FeedCard key={project._id || project.title} {...project} />)
          ) : (
            <div className="rounded-[14px] border border-white/10 bg-[#111118] p-6 text-sm text-white/40">
              No projects yet
            </div>
          )}
        </div>
        <div className="hidden lg:block">
          <RightPanel trending={trending} suggestedUsers={suggestedUsers} popularTags={popularTags} />
        </div>
      </div>
    </main>
  );
};

export default Feed;
