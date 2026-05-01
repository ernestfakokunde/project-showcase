import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaCheck,
  FaCode,
  FaComments,
  FaLayerGroup,
  FaPalette,
  FaShieldHalved,
  FaUsers,
} from "react-icons/fa6";

const navLinks = [
  { label: "Discover", href: "#discover" },
  { label: "Workflow", href: "#workflow" },
  { label: "Community", href: "#community" },
  { label: "FAQ", href: "#faq" },
];

const stats = [
  { value: "7", label: "creator tracks" },
  { value: "24/7", label: "async collaboration" },
  { value: "100%", label: "project-first profiles" },
];

const features = [
  {
    icon: FaLayerGroup,
    title: "Project discovery",
    text: "Browse active builds by category, stage, tools, roles, and collaboration needs.",
  },
  {
    icon: FaUsers,
    title: "Role-based matching",
    text: "Find developers, designers, AI builders, Web3 makers, motion artists, and game devs.",
  },
  {
    icon: FaComments,
    title: "Built-in coordination",
    text: "Send requests, comment on work, follow builders, and continue conversations in messages.",
  },
  {
    icon: FaShieldHalved,
    title: "Moderated platform",
    text: "Admin tools, reports, rate limits, and content checks keep the community healthier.",
  },
];

const steps = [
  "Create a focused profile that shows what you build.",
  "Post a project with open roles, expectations, and links.",
  "Review requests, collaborate, and keep momentum in one workspace.",
];

const categories = [
  { label: "Development", icon: FaCode },
  { label: "Design", icon: FaPalette },
  { label: "AI / ML", icon: FaBolt },
  { label: "Web3", icon: FaLayerGroup },
  { label: "Game Dev", icon: FaCode },
  { label: "Motion", icon: FaPalette },
];

const previewProjects = [
  { title: "Open-source design system", category: "Design", role: "Frontend Engineer", status: "Building" },
  { title: "Web3 grant tracker", category: "Web3", role: "Smart Contract Dev", status: "Looking for collaborators" },
  { title: "AI study planner", category: "AI / ML", role: "Product Designer", status: "Idea" },
];

const previewCreators = [
  { username: "maya_ui", role: "Product Designer", availability: "Open to collaborate" },
  { username: "tobi_dev", role: "Full-stack Developer", availability: "Available for invites" },
  { username: "nora_ai", role: "AI Builder", availability: "Open to collaborate" },
];

const faqs = [
  {
    question: "Is StackLab only for developers?",
    answer: "No. It is built for technical and creative collaborators: designers, developers, AI builders, Web3 teams, game makers, and motion creators.",
  },
  {
    question: "Can I find people for an early idea?",
    answer: "Yes. You can post by project stage and explain exactly what kind of collaborator you need.",
  },
  {
    question: "What happens after someone wants to join?",
    answer: "They send a request, you review it, and then you can coordinate through comments, notifications, and messages.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07070b]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 grid-cols-2 gap-1 rounded-lg bg-[#7f77dd] p-2 shadow-[0_18px_45px_rgba(127,119,221,0.25)]">
              <span className="rounded-[3px] bg-white/95" />
              <span className="rounded-[3px] bg-white/55" />
              <span className="rounded-[3px] bg-white/55" />
              <span className="rounded-[3px] bg-white/95" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              Stack<span className="text-[#afa9ec]">Lab</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-white/55 lg:flex">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-[#7f77dd] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6f67ce]"
            >
              Get started
              <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(127,119,221,0.24),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_32%)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-[#c6c1ff]">
                <span className="h-2 w-2 rounded-full bg-[#1d9e75]" />
                Collaboration hub for builders
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Find the right people to build the next thing.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/58 sm:text-xl">
                StackLab helps creators publish projects, discover collaborators, manage requests, and keep work moving from idea to launch.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7f77dd] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f67ce]"
                >
                  Start building
                  <FaArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="#discover"
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Explore features
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                {stats.map((item) => (
                  <div key={item.label} className="border-l border-white/10 pl-4">
                    <div className="text-2xl font-semibold text-white">{item.value}</div>
                    <div className="mt-1 text-xs leading-5 text-white/40">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#101018] shadow-[0_30px_120px_rgba(0,0,0,0.4)]">
              <div className="border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f06b6b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f2be5c]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1d9e75]" />
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="rounded-lg border border-white/10 bg-[#0b0b11] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#afa9ec]">Open project</p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight">AI design review assistant</h2>
                    </div>
                    <span className="rounded-full bg-[#1d9e75]/12 px-3 py-1 text-xs font-medium text-[#6ee7bf]">Hiring</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/52">
                    Looking for a frontend engineer and product designer to ship an MVP with feedback loops, saved reviews, and team workspaces.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {["React", "Node", "Product UI", "AI"].map((tag) => (
                      <span key={tag} className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-white/55">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {["Frontend Developer", "Product Designer"].map((role) => (
                    <div key={role} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-sm font-medium text-white">{role}</p>
                      <p className="mt-2 text-xs leading-5 text-white/45">Open role with clear scope and async collaboration.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#08080c] py-18 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#afa9ec]">Live Preview</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">See the kind of work and people you will find inside.</h2>
              <p className="mt-4 text-base leading-7 text-white/50">
                StackLab is built around real project cards, open roles, creator profiles, and invite-ready collaboration.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-[#111118] p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/35">Sample projects</h3>
                <div className="mt-4 space-y-3">
                  {previewProjects.map((project) => (
                    <div key={project.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md bg-[#7f77dd]/15 px-2 py-1 text-[11px] text-[#afa9ec]">{project.category}</span>
                        <span className="text-[11px] text-[#6ee7bf]">{project.status}</span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-white">{project.title}</p>
                      <p className="mt-1 text-xs text-white/38">Open role: {project.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#111118] p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/35">Creator profiles</h3>
                <div className="mt-4 space-y-3">
                  {previewCreators.map((creator) => (
                    <div key={creator.username} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7f77dd]/25 text-sm font-semibold text-[#afa9ec]">
                        {creator.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">@{creator.username}</p>
                        <p className="text-xs text-white/38">{creator.role} • {creator.availability}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="discover" className="border-t border-white/10 bg-[#0b0b11] py-18 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#afa9ec]">Discover</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything a builder community needs to feel useful.</h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-lg border border-white/10 bg-[#111118] p-5">
                    <Icon className="h-5 w-5 text-[#afa9ec]" />
                    <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/48">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="workflow" className="py-18 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#afa9ec]">Workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Go from idea to team without losing the thread.</h2>
              <p className="mt-4 text-base leading-7 text-white/50">
                StackLab keeps the core collaboration loop simple: present the work, clarify what you need, and move the best conversations forward.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#7f77dd]/16 text-sm font-semibold text-[#c6c1ff]">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-base leading-7 text-white/68">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="community" className="border-y border-white/10 bg-[#0b0b11] py-18 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#afa9ec]">Community</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A place for different makers to meet around real work.</h2>
              </div>
              <Link to="/signup" className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white">
                Join StackLab
                <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#111118] px-4 py-4">
                    <Icon className="h-4 w-4 text-[#afa9ec]" />
                    <span className="text-sm font-medium text-white/75">{category.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="faq" className="py-18 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#afa9ec]">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Clear answers before you jump in.</h2>
            </div>

            <div className="mt-10 grid gap-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex gap-3">
                    <FaCheck className="mt-1 h-4 w-4 shrink-0 text-[#6ee7bf]" />
                    <div>
                      <h3 className="font-semibold text-white">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/48">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#08080c]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-9 w-9 grid-cols-2 gap-1 rounded-lg bg-[#7f77dd] p-2">
                <span className="rounded-[3px] bg-white/95" />
                <span className="rounded-[3px] bg-white/55" />
                <span className="rounded-[3px] bg-white/55" />
                <span className="rounded-[3px] bg-white/95" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Stack<span className="text-[#afa9ec]">Lab</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/45">
              A project-first collaboration platform for builders, designers, and creative technologists.
            </p>
          </div>

          <FooterColumn title="Product" links={["Discover", "Projects", "Requests", "Messages"]} />
          <FooterColumn title="Community" links={["Developers", "Designers", "AI builders", "Web3 teams"]} />
          <FooterColumn title="Company" links={["About", "Guidelines", "Privacy", "Contact"]} />
        </div>

        <div className="border-t border-white/10 px-4 py-5">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} StackLab. All rights reserved.</p>
            <p>Built for people who build together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    <ul className="mt-4 space-y-3">
      {links.map((link) => (
        <li key={link}>
          <a href="#discover" className="text-sm text-white/42 transition hover:text-white">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default LandingPage;
