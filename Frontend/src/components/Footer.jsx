const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-slate-600">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} ProjectHub. Built for modern collaboration.</p>
        <div className="flex flex-wrap gap-4 text-slate-500">
          <a href="#" className="transition hover:text-slate-900">Terms</a>
          <a href="#" className="transition hover:text-slate-900">Privacy</a>
          <a href="#" className="transition hover:text-slate-900">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
