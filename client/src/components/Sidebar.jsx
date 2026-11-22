import {
  LayoutDashboard,
  CalendarDays,
  CheckCircle2,
  ListTodo,
  Moon,
  Sun,
  X,
  LogOut,
  Menu,
} from "lucide-react";

const navigation = [
  { label: "Overview", value: "overview", icon: LayoutDashboard },
  { label: "My Tasks", value: "tasks", icon: ListTodo },
  { label: "Calendar", value: "calendar", icon: CalendarDays },
  { label: "Completed", value: "completed", icon: CheckCircle2 },
];

export default function Sidebar({
  user,
  activeView,
  setActiveView,
  darkMode,
  setDarkMode,
  isOpen,
  setIsOpen,
  logout,
}) {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-950 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white">
              <CheckCircle2 size={23} />
            </div>

            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              TaskFlow
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-cyan-500 dark:hover:bg-gray-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-8">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map(({ label, value, icon: Icon }) => {
              const active = activeView === value;

              return (
                <button
                  key={value}
                  onClick={() => {
                    setActiveView(value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-cyan-50 text-cyan-900 dark:bg-cyan-500/15 dark:text-cyan-300 border-b"
                      : "text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
                  }`}
                >
                  <Icon size={19} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto space-y-4 border-t border-gray-100 p-4 dark:border-gray-800">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex w-full items-center gap-3 px-3 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900 border-b"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            {darkMode ? "Light mode" : "Dark mode"}
          </button>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.email || "My account"}
              </p>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-red-500 dark:hover:bg-gray-800"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-gray-200 p-2 text-gray-600 dark:border-gray-700 dark:text-gray-300 lg:hidden"
      aria-label="Open sidebar"
    >
      <Menu size={21} />
    </button>
  );
}