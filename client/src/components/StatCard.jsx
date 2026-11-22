

export default function StatCard({ title, value, subtitle, icon: Icon, color, progress = 0 }) {

  const colors = {
    indigo: {
      border: "#6366f1",
      icon: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    },
    emerald: {
      border: "#10b981",
      icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    amber: {
      border: "#f59e0b",
      icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    },
    red: {
      border: "#ef4444",
      icon: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    },
  };

  const percentage = Math.min(Math.max(progress, 0), 100);
  const selectedColor = colors[color];

  return (
    <div className="rounded-full w-50 h-50 p-2 hover:p-2.5"
    style={{
      background: `conic-gradient(
      ${selectedColor.border} ${percentage}%,
      #e5e7eb ${percentage}% 100%
      )`,
    }}
    >
        <div className="flex flex-col w-full h-full items-center justify-center rounded-full border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <div className="flex items-center justify-center gap-5">
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>

            <div className={`rounded-xl p-3 ${selectedColor.icon}`}>
              <Icon size={18} />
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            {subtitle}
          </p>
          <p
          className="mt-1 text-xs font-semibold"
          style={{ color: selectedColor.border }}
        >
          {Math.round(percentage)}%
        </p>
        </div>
      </div>
  );
}