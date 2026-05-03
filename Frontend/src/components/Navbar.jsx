import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors ${isDark ? "border-slate-700 bg-[#09090e]/95 backdrop-blur" : "border-slate-200 bg-white/95 backdrop-blur"}`}>
      <div className={`mx-auto flex max-w-[1480px] items-center justify-between px-4 py-4 md:px-6`}>
        <Link to="/" className={`text-xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          ProjectHub
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-100"}`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isDark ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-900 text-white hover:bg-slate-800"}`}
          >
            Dashboard
          </Link>

          <button
            onClick={toggleTheme}
            className={`ml-2 rounded-full p-2 transition ${isDark ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657-9.193a1 1 0 00-1.414 0l-.707.707A1 1 0 005.05 6.464l.707-.707a1 1 0 011.414 0zM5 6a1 1 0 100-2H4a1 1 0 100 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;