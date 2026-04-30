import { Link } from "react-router-dom";
import { FaArrowDownLong, FaEllipsis } from "react-icons/fa6";

const navLinks = [
  { label: "Discover", href: "#discover" },
  { label: "Projects", href: "#projects" },
  { label: "Community", href: "#community" },
  { label: "About", href: "#about" },
];

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_28%),radial-gradient(circle_at_50%_38%,_rgba(92,84,255,0.12),_transparent_26%),linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent_18%)]" />

      <header className="relative z-10 border-b border-white/8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d80ff] via-[#78a5e9] to-[#6de0b9] shadow-[0_10px_30px_rgba(80,120,255,0.18)]">
              <div className="grid grid-cols-2 gap-1">
                <span className="h-2.5 w-2.5 rounded-[4px] bg-white/90" />
                <span className="h-2.5 w-2.5 rounded-[4px] bg-white/65" />
                <span className="h-2.5 w-2.5 rounded-[4px] bg-white/65" />
                <span className="h-2.5 w-2.5 rounded-[4px] bg-white/90" />
              </div>
            </div>

            <div className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
              Stack<span className="bg-gradient-to-r from-[#90a0ff] to-[#7f67ff] bg-clip-text text-transparent">Lab</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 lg:gap-4">
            <nav className="hidden items-center gap-8 text-[1.1rem] text-white/60 lg:flex">
              {navLinks.map((item) => (
                <a key={item.label} href={item.href} className="transition hover:text-white">
                  {item.label}
                </a>
              ))}
            </nav>

            <Link
              to="/login"
              className="hidden rounded-2xl border border-white/14 bg-[#0c0c12] px-7 py-3 text-lg font-medium text-white transition hover:border-white/25 hover:bg-white/[0.04] sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="rounded-2xl border border-white/14 bg-[#09090f] px-6 py-3 text-base font-semibold text-white transition hover:border-white/25 hover:bg-white/[0.04] sm:px-7 sm:text-lg"
            >
              Get started
            </Link>

            <button
              type="button"
              aria-label="More options"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/80 transition hover:bg-white/[0.1]"
            >
              <FaEllipsis className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex min-h-[calc(100vh-92px)] max-w-[1180px] flex-col items-center px-6 pb-12 pt-20 text-center sm:pt-24 lg:pt-28">
          <span className="inline-flex items-center gap-3 rounded-full border border-[#5a54d1]/60 bg-[#19162b] px-5 py-2 text-sm font-semibold text-[#aea6ff] shadow-[0_0_0_1px_rgba(115,102,255,0.12)_inset] sm:text-base">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8c82ff]" />
            Tech &amp; Creative Hub
          </span>

          <h1 className="mt-14 max-w-[980px] text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl md:text-7xl lg:text-[5.7rem] lg:leading-[0.97]">
            <span className="block">Where ideas meet</span>
            <span className="mt-2 block bg-gradient-to-r from-[#7875ff] via-[#6d8de5] to-[#66d8b7] bg-clip-text text-transparent">
              the right people
            </span>
          </h1>

          <p className="mt-10 max-w-[920px] text-xl leading-relaxed text-[#9e9998] sm:text-2xl">
            Post your project, find your collaborators, and build something remarkable
            together.
          </p>

          <button
            type="button"
            aria-label="Scroll down"
            className="mt-8 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-white/75 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:border-white/20 hover:bg-white/[0.12]"
          >
            <FaArrowDownLong className="h-5 w-5" />
          </button>

          <div className="mt-14 flex h-14 w-full max-w-[740px] items-start justify-center overflow-hidden rounded-t-[18px] border border-white/12 bg-gradient-to-b from-white/[0.035] to-white/[0.015]" />
        </section>

        <div id="discover" />
        <div id="projects" />
        <div id="community" />
        <div id="about" />
      </main>
    </div>
  );
};

export default LandingPage;
