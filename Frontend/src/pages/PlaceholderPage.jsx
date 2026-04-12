import { useLocation } from "react-router-dom";
import Topbar from "../components/layout/Topbar";

const pageLabels = {
  "/trending": "Trending",
  "/saved": "Saved",
  "/my-projects": "My projects",
  "/messages": "Messages",
};

const PlaceholderPage = () => {
  const location = useLocation();
  const label = pageLabels[location.pathname] || "Coming soon";

  return (
    <main className="min-h-screen bg-[#09090e] text-white">
      <Topbar variant="title" title={label} />
      <div className="px-6 py-10">
        <div className="rounded-[32px] border border-white/10 bg-[#111118] p-8">
          <h1 className="text-2xl font-semibold">{label}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            This page is being prepared with the new StackLab UI. Check back soon for the full experience.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PlaceholderPage;
