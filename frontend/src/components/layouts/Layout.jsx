import { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({
  children,
  activePage,
  onNavigate,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur md:hidden">

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <span className="text-lg">
            {sidebarOpen ? "✕" : "☰"}
          </span>
        </button>

        <div>
          <h1 className="text-sm font-bold">
            Smart File Organizer
          </h1>

          <p className="text-xs text-slate-500">
            File management system
          </p>
        </div>

      </header>


      {/* Layout */}
      <div className="flex min-h-screen">

        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;