import { CheckSquare, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-cyan-600 p-2 text-white">
            <CheckSquare size={20} />
          </div>

          <span className="text-lg font-bold tracking-tight">
            TaskFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-zinc-600 sm:inline">
            Hi, {user?.name}
          </span>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}