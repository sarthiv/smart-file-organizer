import {
  LayoutDashboard,
  FolderOpen,
  Copy,
  CalendarDays,
  History,
  ListFilter,
  Settings,
  X,
} from "lucide-react";


const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Organizer",
    icon: FolderOpen,
  },
  {
    name: "Duplicates",
    icon: Copy,
  },
  {
    name: "Date Organizer",
    icon: CalendarDays,
  },
  {
    name: "Activity",
    icon: History,
  },
  {
    name: "Rules",
    icon: ListFilter,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];


function Sidebar({
  activePage,
  onNavigate,
  sidebarOpen,
  onClose,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}


      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 shrink-0
          border-r border-slate-800
          bg-slate-950
          p-5 text-white
          transition-transform duration-300

          md:static
          md:min-h-screen
          md:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">

          <div>
            <h1 className="text-xl font-bold">
              Smart File Organizer
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              File management system
            </p>
          </div>


          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>

        </div>


        {/* Navigation */}
        <nav className="space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const isActive =
              activePage === item.name;


            return (
              <button
                key={item.name}
                onClick={() =>
                  onNavigate(item.name)
                }
                className={`
                  flex w-full items-center gap-3
                  rounded-lg px-4 py-3
                  text-left
                  transition

                  ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }
                `}
              >

                <Icon size={20} />

                <span className="text-sm font-medium">
                  {item.name}
                </span>

              </button>
            );
          })}

        </nav>

      </aside>
    </>
  );
}

export default Sidebar;