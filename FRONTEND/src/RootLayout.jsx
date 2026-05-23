import { Outlet } from "@tanstack/react-router";
import Navbar from "./components/NavBar";
import { ToastViewport } from "./components/ui-kit.jsx";

const RootLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden text-[color:var(--text)]">
      <div className="pointer-events-none absolute inset-0 subtle-grid opacity-50" />
      <Navbar />
      <main className="relative z-10 flex-1 pb-16 pt-6 sm:pt-8">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-white/10 bg-[color:var(--bg-elevated)]">
        <div className="page-shell flex flex-col gap-4 py-8 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[color:var(--text)]">
              url_shortner
            </p>
            <p className="mt-1 max-w-xl leading-6">
              A polished link workspace for creating, tracking, and organizing
              short URLs with a premium, responsive experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-neutral">Responsive</span>
            <span className="badge badge-neutral">Accessible</span>
            <span className="badge badge-neutral">Dark mode</span>
          </div>
        </div>
      </footer>
      <ToastViewport />
    </div>
  );
};

export default RootLayout;
