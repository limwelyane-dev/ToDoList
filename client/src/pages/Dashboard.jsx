import { useEffect, useMemo, useState } from "react";
import Swal from 'sweetalert2';

import {
  Plus,
  Search,
  Check,
  Clock3,
  ListTodo,
  TrendingUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Circle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import Sidebar, {
  MobileMenuButton,
} from "../components/Sidebar";

import TaskForm from "../components/TaskForm";
import StatCard from "../components/StatCard";

import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../hooks/useTasks";

import { useAuth } from "../context/AuthContext";

const priorityStyles = {
  high: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  medium:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  low: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const todayKey = getDateKey(new Date());

export default function Dashboard() {
  const { user, logout } = useAuth();

  const { data: tasks = [], isLoading, isError, error } = useTasks();

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("taskflow-theme") === "dark"
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem(
      "taskflow-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);
  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks.length / totalTasks) * 100);

  const overdueTasks = pendingTasks.filter(
    (task) => task.dueDate && getDateKey(task.dueDate) < todayKey
  );


  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && !task.completed) ||
        (filter === "completed" && task.completed);

      const matchesView =
        activeView === "completed"
          ? task.completed
          : activeView === "tasks"
            ? true
            : true;

      return matchesSearch && matchesFilter && matchesView;
    });
  }, [tasks, search, filter, activeView]);

  const handleCreate = async (formData) => {
    try {
      await createMutation.mutateAsync(formData);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to create task.");
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingTask) return;

    try {
      await updateMutation.mutateAsync({
        id: editingTask._id,
        ...formData,
      });

      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update task.");
    }
  };

  const handleToggle = async (task) => {
    try {
      await updateMutation.mutateAsync({
        id: task._id,
        completed: !task.completed,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update task.");
    }
  };

  

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Delete this task?",
    text: "This action cannot be undone.",
    icon: "warning",

    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Keep task",

    buttonsStyling: false,

    customClass: {
      popup: "rounded-2xl p-6",
      title: "text-xl font-bold text-gray-900",
      htmlContainer: "text-sm text-gray-500",
      confirmButton:
        "rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 mx-2",
      cancelButton:
        "rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 mx-2",
    },

    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await deleteMutation.mutateAsync(id);

    Swal.fire({
      title: "Deleted!",
      text: "Your task has been deleted.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({
      title: "Error!",
      text: err.response?.data?.message || "Unable to delete task.",
      icon: "error",
    });
  }
};



  const openEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const tasksByDate = useMemo(() => {
    const grouped = {};

    tasks.forEach((task) => {
      if (!task.dueDate) return;

      const key = getDateKey(task.dueDate);

      if (!grouped[key]) grouped[key] = [];

      grouped[key].push(task);
    });

    return grouped;
  }, [tasks]);

  const selectedDateTasks = tasksByDate[selectedDate] || [];

  const monthLabel = calendarMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (amount) => {
    setCalendarMonth(
      new Date(year, month + amount, 1)
    );
  };

  const cardClass =
    "rounded-2xl border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900";

  const headingClass =
    "font-semibold text-gray-900 dark:text-white";

    const totalTasksBorder = tasks.length;

const completedPercentage =
  totalTasksBorder > 0
    ? (completedTasks.length / totalTasksBorder) * 100
    : 0;

const pendingPercentage =
  totalTasksBorder > 0
    ? (pendingTasks.length / totalTasksBorder) * 100
    : 0;

const overduePercentage =
  totalTasksBorder > 0
    ? (overdueTasks.length / totalTasksBorder) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        logout={logout}
      />

      <main className="min-h-screen lg:pl-64">
        
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/90 px-5 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90 sm:px-8">
          <div className="flex items-center gap-3">
            <MobileMenuButton
              onClick={() => setIsSidebarOpen(true)}
            />

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Workspace / {activeView}
              </p>

              <h1 className="text-lg font-bold capitalize text-gray-900 dark:text-white">
                {activeView === "overview"
                  ? "Overview"
                  : activeView === "tasks"
                    ? "My Tasks"
                    : activeView}
              </h1>
            </div>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">New</span>
          </button>
        </header>

        <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
      
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Good day, {user?.name?.split(" ")[0] || "there"}!
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Here's what's happening with your tasks today.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-400">
              <CalendarDays size={17} />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
          </section>

          {isLoading && (
            <div className={cardClass}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading your tasks...
              </p>
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error?.response?.data?.message ||
                "Unable to load tasks. Please try again."}
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {activeView === "overview" && (
                <>
                  <section className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                    <StatCard
                      title="Total Tasks"
                      value={totalTasks}
                      subtitle="All your tasks"
                      icon={ListTodo}
                      color="indigo"
                      progress={100}
                    />

                    <StatCard
                      title="Completed"
                      value={completedTasks.length}
                      subtitle="Successfully finished"
                      icon={CheckCircle2}
                      color="emerald"
                      progress={completedPercentage}
                    />

                    <StatCard
                      title="Pending"
                      value={pendingTasks.length}
                      subtitle="Still to be done"
                      icon={Clock3}
                      color="amber"
                      progress={pendingPercentage}
                    />

                    <StatCard
                      title="Overdue"
                      value={overdueTasks.length}
                      subtitle="Past their due date"
                      icon={AlertCircle}
                      color="red"
                      progress={overduePercentage}
                    />
                  </section>

                  <section className={cardClass}>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <TrendingUp
                            size={19}
                            className="text-indigo-600"
                          />

                          <h3 className={headingClass}>
                            Task progress
                          </h3>
                        </div>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Keep moving forward. You're doing great!
                        </p>
                      </div>

                      <p className="text-3xl font-bold text-indigo-600">
                        {progress}%
                      </p>
                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {completedTasks.length} completed
                      </span>
                      <span>{pendingTasks.length} remaining</span>
                    </div>
                  </section>
                </>
              )}

              {activeView === "calendar" && (
                <section className={cardClass}>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className={headingClass}>
                        Task calendar
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Select a date to see its scheduled tasks.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => changeMonth(-1)}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        aria-label="Previous month"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <span className="min-w-32 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        {monthLabel}
                      </span>

                      <button
                        onClick={() => changeMonth(1)}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        aria-label="Next month"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="py-3 text-center text-xs font-semibold text-gray-400"
                        >
                          {day}
                        </div>
                      )
                    )}

                    {calendarDays.map((day, index) => {
                      if (!day) {
                        return <div key={`empty-${index}`} />;
                      }

                      const key = getDateKey(
                        new Date(year, month, day)
                      );

                      const dayTasks = tasksByDate[key] || [];
                      const isSelected = selectedDate === key;
                      const isToday = todayKey === key;

                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedDate(key)}
                          className={`relative flex min-h-16 flex-col items-center rounded-xl border p-2 text-sm transition sm:min-h-24 ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15"
                              : "border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full ${
                              isToday
                                ? "bg-indigo-600 font-bold text-white"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {day}
                          </span>

                          {dayTasks.length > 0 && (
                            <span className="mt-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                              {dayTasks.length} tasks
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
                    <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                      Tasks for{" "}
                      {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </h4>

                    {selectedDateTasks.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tasks scheduled for this date.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedDateTasks.map((task) => (
                          <TaskRow
                            key={task._id}
                            task={task}
                            onToggle={handleToggle}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeView !== "calendar" && (
                <section className={cardClass}>
                  <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className={headingClass}>
                        {activeView === "completed"
                          ? "Completed tasks"
                          : activeView === "tasks"
                            ? "All tasks"
                            : "Recent tasks"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage and track your daily activities.
                      </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full rounded-xl border border-gray-400 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {["all", "pending", "completed"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${
                          filter === item
                            ? "bg-cyan-600 text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  {filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                      <div className="mb-4 rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
                        <ListTodo
                          size={30}
                          className="text-gray-400"
                        />
                      </div>

                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        No tasks found
                      </h4>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Create a task or change your filters.
                      </p>

                      <button
                        onClick={openCreate}
                        className="mt-4 text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
                      >
                        + Create your first task
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <TaskRow
                          key={task._id}
                          task={task}
                          onToggle={handleToggle}
                          onEdit={openEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {activeView === "overview" && (
                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className={cardClass}>
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className={headingClass}>
                        Priority overview
                      </h3>

                      <span className="text-xs text-gray-400">
                        Pending tasks
                      </span>
                    </div>

                    {["high", "medium", "low"].map((priority) => {
                      const count = pendingTasks.filter(
                        (task) => task.priority === priority
                      ).length;

                      return (
                        <div
                          key={priority}
                          className="mb-5 last:mb-0"
                        >
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="font-medium capitalize text-gray-700 dark:text-gray-300">
                              {priority} priority
                            </span>

                            <span className="text-gray-500 dark:text-gray-400">
                              {count}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className={`h-full rounded-full ${
                                priority === "high"
                                  ? "bg-red-500"
                                  : priority === "medium"
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }`}
                              style={{
                                width: `${
                                  pendingTasks.length
                                    ? (count / pendingTasks.length) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={cardClass}>
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className={headingClass}>
                        Upcoming tasks
                      </h3>

                      <button
                        onClick={() => setActiveView("tasks")}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                      >
                        View all
                      </button>
                    </div>

                    {pendingTasks
                      .filter((task) => task.dueDate)
                      .sort(
                        (a, b) =>
                          new Date(a.dueDate) - new Date(b.dueDate)
                      )
                      .slice(0, 4).length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No upcoming tasks with due dates.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {pendingTasks
                          .filter((task) => task.dueDate)
                          .sort(
                            (a, b) =>
                              new Date(a.dueDate) -
                              new Date(b.dueDate)
                          )
                          .slice(0, 4)
                          .map((task) => (
                            <div
                              key={task._id}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                  {task.title}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  {formatDate(task.dueDate)}
                                </p>
                              </div>

                              <PriorityBadge
                                priority={task.priority}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          loading={
            createMutation.isPending || updateMutation.isPending
          }
        />
      )}
    </div>
  );
}


function PriorityBadge({ priority }) {
  const value = priority || "medium";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${
        priorityStyles[value] || priorityStyles.medium
      }`}
    >
      {value}
    </span>
  );
}

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-indigo-200 hover:bg-gray-50/70 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800/50 sm:flex-row sm:items-center">
      <button
        onClick={() => onToggle(task)}
        aria-label={
          task.completed ? "Mark as pending" : "Mark as completed"
        }
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
          task.completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-gray-300 text-transparent hover:border-indigo-500 dark:border-gray-600"
        }`}
      >
        {task.completed ? <Check size={14} /> : <Circle size={13} />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-semibold ${
            task.completed
              ? "text-gray-400 line-through"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
            {task.description}
          </p>
        )}

        {task.dueDate && (
          <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <CalendarDays size={13} />
            {formatDate(task.dueDate)}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <PriorityBadge priority={task.priority} />

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="rounded-lg p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}