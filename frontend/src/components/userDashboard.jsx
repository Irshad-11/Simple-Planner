// src/components/UserDashboard.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// React Icons
import {
  MdGridView,
  MdTaskAlt,
  MdFormatListBulleted,
  MdCalendarMonth,
  MdNoteAlt,
  MdBarChart,
  MdSettings,
  MdLogout,
  MdSearch,
  MdNotifications,
  MdAdd,
  MdPendingActions,
  MdBolt,
  MdChevronLeft,
  MdChevronRight,
  MdLightMode,
  MdDarkMode,
} from 'react-icons/md';

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // User info from localStorage
  const [user, setUser] = useState(null);

  // Tab handling
  const currentTab = searchParams.get('tab') || 'dashboard';
  const validTabs = ['dashboard', 'tasks', 'todo', 'planner', 'notes', 'analytics'];
  const activeTab = validTabs.includes(currentTab) ? currentTab : 'dashboard';

  // Collapsible sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Load user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'user') {
      navigate('/');
      return;
    }

    const firstName = localStorage.getItem('firstName') || 'User';
    const lastName = localStorage.getItem('lastName') || '';

    setUser({
      firstName,
      lastName,
      initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
    });
  }, [navigate]);

  useEffect(() => {
    if (!searchParams.has('tab')) {
      setSearchParams({ tab: 'dashboard' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    navigate('/');
  };

  // Avatar color generator
  const getAvatarColor = (name) => {
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
      '#ef4444', '#f97316', '#f59e0b', '#84cc16',
      '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // ─── Sidebar ───────────────────────────────────────────────────
  const Sidebar = () => (
    <aside
      className={`
        h-screen flex flex-col border-r border-border
        bg-bg-secondary transition-all duration-500 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo + collapse toggle */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 dark:bg-accent/20 p-1.5 rounded-lg text-accent transition-colors duration-300">
              <MdGridView size={26} />
            </div>
            <div>
              <h1 className="text-text text-base font-bold leading-none">TaskMaster</h1>
              <p className="text-text-muted text-xs font-medium">Pro</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-accent/10 dark:hover:bg-accent/15 text-text-muted hover:text-accent transition-all duration-300"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <MdChevronRight size={22} /> : <MdChevronLeft size={22} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: MdGridView },
          { id: 'tasks',     label: 'Tasks',     icon: MdTaskAlt },
          { id: 'todo',      label: 'To-Do',     icon: MdFormatListBulleted },
          { id: 'planner',   label: 'Planner',   icon: MdCalendarMonth },
          { id: 'notes',     label: 'Notes',     icon: MdNoteAlt },
          { id: 'analytics', label: 'Analytics', icon: MdBarChart },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-300 ease-in-out
              ${activeTab === item.id
                ? 'bg-accent/15 dark:bg-accent/25 text-accent'
                : 'text-text-muted hover:bg-accent/10 dark:hover:bg-accent/15 hover:text-text'
              }
              ${isCollapsed ? 'justify-center px-2 py-3' : ''}
            `}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={20} className={isCollapsed ? 'mx-auto' : ''} />
            {!isCollapsed && <span className="transition-opacity duration-400">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border space-y-1">
        <button
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            text-text-muted hover:bg-accent/10 dark:hover:bg-accent/15 hover:text-text
            transition-all duration-300
            ${isCollapsed ? 'justify-center px-2 py-3' : ''}
          `}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <MdSettings size={20} className={isCollapsed ? 'mx-auto' : ''} />
          {!isCollapsed && <span>Settings</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20
            transition-all duration-300
            ${isCollapsed ? 'justify-center px-2 py-3' : ''}
          `}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <MdLogout size={20} className={isCollapsed ? 'mx-auto' : ''} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  // ─── Header ────────────────────────────────────────────────────
  const Header = () => (
    <header className="
      h-16 border-b border-border bg-bg-secondary
      flex items-center justify-between px-5 md:px-8 z-10 shrink-0
      transition-colors duration-500
    ">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <MdSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors duration-300"
            size={20}
          />
          <input
            className="
              w-full bg-bg border border-border rounded-xl
              py-2.5 pl-11 pr-4 text-text placeholder:text-text-muted/70 text-sm
              focus:border-accent/60 focus:ring-2 focus:ring-accent/20
              transition-all duration-300 outline-none
            "
            placeholder="Search tasks, notes, projects..."
            type="text"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5 md:gap-6">
        <button className="relative p-2.5 text-text-muted hover:text-text hover:bg-accent/10 dark:hover:bg-accent/15 rounded-lg transition-all duration-300">
          <MdNotifications size={22} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-bg"></span>
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="
            p-2.5 text-text-muted hover:text-accent rounded-lg
            hover:bg-accent/10 dark:hover:bg-accent/15
            transition-all duration-300
          "
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
        </button>

        <div className="h-8 w-px bg-border hidden md:block transition-colors duration-500" />

        {/* User info with initials avatar */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text hidden md:block transition-colors duration-300">
              {user.firstName} {user.lastName}
            </span>
            <div
              className="size-9 rounded-full border-2 border-accent/30 flex items-center justify-center text-white font-bold text-lg transition-all duration-300"
              style={{ backgroundColor: getAvatarColor(user.firstName + user.lastName) }}
            >
              {user.initials}
            </div>
          </div>
        ) : (
          <div className="size-9 rounded-full bg-accent/20 animate-pulse" />
        )}
      </div>
    </header>
  );

  // ─── Dashboard Content ─────────────────────────────────────────
  const DashboardOverview = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text transition-colors duration-500">
          Good morning, {user?.firstName || 'User'}!
        </h2>
        <p className="text-text-muted mt-1.5 transition-colors duration-500">
          You have 6 tasks pending for today.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Tasks', value: '24', icon: MdFormatListBulleted },
          { title: 'Completed',   value: '18', icon: MdTaskAlt },
          { title: 'Pending',     value: '6',  icon: MdPendingActions },
          { title: 'Productivity',value: '75%', icon: MdBolt },
        ].map((card, i) => (
          <div
            key={i}
            className="
              bg-bg-secondary p-6 rounded-xl border border-border shadow-sm
              transition-all duration-500 hover:shadow-md hover:-translate-y-0.5
            "
          >
            <div className="flex justify-between items-start mb-5">
              <div className="p-2.5 bg-accent/10 dark:bg-accent/15 text-accent rounded-lg transition-colors duration-300">
                <card.icon size={26} />
              </div>
            </div>
            <p className="text-sm font-medium text-text-muted transition-colors duration-500">{card.title}</p>
            <h3 className="text-3xl font-bold text-text mt-2 transition-colors duration-500">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* ... rest of DashboardOverview remains unchanged ... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text transition-colors duration-500">Recent Tasks</h3>
            <button className="text-sm text-accent font-medium hover:underline transition-colors duration-300">View All</button>
          </div>
          <div className="
            bg-bg-secondary rounded-xl border border-border overflow-hidden shadow-sm
            transition-all duration-500
          ">
            <table className="w-full text-left">
              <thead className="bg-bg text-text-muted text-xs uppercase tracking-wider transition-colors duration-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Task Name</th>
                  <th className="px-6 py-4 font-medium">Priority</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border transition-colors duration-500">
                {[
                  { name: 'Update Q4 Marketing Strategy', priority: 'High', status: 'In Progress' },
                  { name: 'Review Team OKRs', priority: 'Medium', status: 'Pending' },
                  { name: 'Product Design Handover', priority: 'Low', status: 'Completed' },
                  { name: 'Client Feedback Session', priority: 'High', status: 'In Progress' },
                ].map((task, i) => (
                  <tr key={i} className="hover:bg-accent-soft transition-colors duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-2.5 rounded-full bg-accent"></div>
                        <span className="text-sm font-medium text-text">{task.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="
                        px-2.5 py-1 rounded-full text-[10px] font-bold uppercase
                        bg-accent/10 dark:bg-accent/20 text-accent
                      ">
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-text-muted italic">{task.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-text transition-colors duration-500">Upcoming Deadlines</h3>

          {[
            { day: 'Today', count: 2, tasks: [
              { name: 'Prepare Sales Deck', time: '5:00 PM' },
              { name: 'Submit Monthly Report', time: '11:59 PM' },
            ]},
            { day: 'Tomorrow', count: 1, tasks: [
              { name: 'Team Sync Call', time: '10:00 AM' },
            ]},
          ].map((group, i) => (
            <div
              key={i}
              className="bg-bg-secondary p-5 rounded-xl border border-border shadow-sm transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase text-text-muted tracking-wider">{group.day}</h4>
                <span className="
                  text-[10px] font-bold px-2.5 py-1 rounded
                  bg-accent/10 dark:bg-accent/20 text-accent
                ">
                  {group.count} Tasks
                </span>
              </div>
              <div className="space-y-3">
                {group.tasks.map((task, j) => (
                  <div
                    key={j}
                    className="
                      flex items-start gap-3 p-2.5 rounded-lg
                      hover:bg-accent-soft transition-colors duration-300 cursor-pointer
                    "
                  >
                    <div className="mt-1 size-4 rounded border border-border"></div>
                    <div>
                      <p className="text-sm font-medium text-text">{task.name}</p>
                      <p className="text-xs text-text-muted">{task.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button className="
            w-full py-3.5 bg-accent text-white font-semibold rounded-xl
            flex items-center justify-center gap-2
            hover:bg-accent-hover transition-all duration-300
            shadow-md shadow-accent/20 dark:shadow-accent/10
          ">
            <MdAdd size={20} />
            Create New Task
          </button>
        </div>
      </div>
    </div>
  );

  const PlaceholderTab = ({ title }) => (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-text mb-6 transition-colors duration-500">{title}</h2>
      <p className="text-text-muted transition-colors duration-500">
        This section is under construction. Content will be added soon.
      </p>
    </div>
  );

  // ─── Main Layout ───────────────────────────────────────────────
  return (
    <div className="
      flex h-screen overflow-hidden font-display
      bg-bg text-text antialiased
      transition-colors duration-700
    ">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="
          flex-1 overflow-y-auto p-6 md:p-8
          bg-bg transition-colors duration-700
        ">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'tasks'     && <PlaceholderTab title="Tasks" />}
          {activeTab === 'todo'      && <PlaceholderTab title="To-Do List" />}
          {activeTab === 'planner'   && <PlaceholderTab title="Planner / Calendar" />}
          {activeTab === 'notes'     && <PlaceholderTab title="Notes" />}
          {activeTab === 'analytics' && <PlaceholderTab title="Analytics & Reports" />}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;