import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
            <span className="text-xl font-bold">⊞</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">Stack<span className="text-indigo-400">Lab</span></div>
        </div>
        <nav className="flex items-center gap-8 text-sm">
          <div className="hidden lg:flex items-center gap-8">
            <Link to="#discover" className="text-gray-300 transition hover:text-white">Discover</Link>
            <Link to="#projects" className="text-gray-300 transition hover:text-white">Projects</Link>
            <Link to="#community" className="text-gray-300 transition hover:text-white">Community</Link>
            <Link to="#about" className="text-gray-300 transition hover:text-white">About</Link>
          </div>
          <Link to="/login" className="rounded-full border border-gray-600 px-6 py-2 transition hover:border-white hover:bg-white/5">
            Sign in
          </Link>
          <Link to="/signup" className="rounded-full bg-indigo-600 px-6 py-2 font-semibold transition hover:bg-indigo-700">
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex max-w-[1200px] flex-col items-center justify-center px-6 py-20 text-center">
        <section className="space-y-10">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-indigo-600/50 bg-indigo-600/10 px-4 py-1.5 text-sm font-semibold text-indigo-300">
              • Tech & Creative Hub
            </span>

            <h1 className="space-y-3">
              <div className="text-5xl font-bold leading-tight md:text-6xl">
                Where ideas meet
              </div>
              <div className="relative inline-block text-5xl font-bold md:text-6xl">
                <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  the right people
                </span>
              </div>
            </h1>

            <p className="mx-auto max-w-3xl text-base text-gray-300 md:text-lg">
              Post your project, find your collaborators, and build something remarkable — together. StackLab is the hub for creators who want to ship faster with trusted team members, get feedback from peers, and turn early ideas into real products with a visual portfolio and community tools.
            </p>

            <div className="mx-auto flex flex-wrap justify-center gap-4 mt-1">
              <Link to="/signup" className="rounded-full bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Get started
              </Link>
              <Link to="/login" className="rounded-full border border-gray-600 px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">
                Sign in
              </Link>
              <Link to="#projects" className="rounded-full border border-gray-600 px-7 py-3 text-sm font-semibold text-gray-300 transition hover:border-white hover:text-white hover:bg-white/10">
                Explore projects
              </Link>
              <Link to="#discover" className="rounded-full border border-gray-600 px-7 py-3 text-sm font-semibold text-gray-300 transition hover:border-white hover:text-white hover:bg-white/10">
                Post a project
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-bold text-white">2.4k</p>
              <p className="text-xs uppercase tracking-widest text-gray-400">Projects posted</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-bold text-white">8.1k</p>
              <p className="text-xs uppercase tracking-widest text-gray-400">Builders joined</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-bold text-white">340+</p>
              <p className="text-xs uppercase tracking-widest text-gray-400">Collaborations formed</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-xs uppercase tracking-widest text-gray-400">Categories</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="rounded-full border border-gray-600 bg-black/50 p-3 transition hover:border-gray-400 hover:bg-gray-900/50">
              <FaChevronDown className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;