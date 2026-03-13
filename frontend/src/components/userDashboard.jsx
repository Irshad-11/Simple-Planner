// src/components/UserDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import Tasks from './Tasks';
import Todos from './Todos';
import Planner from './Planner';
import Notes from './Notes';

import {
  MdGridView, MdTaskAlt, MdFormatListBulleted, MdCalendarMonth, MdNoteAlt,
  MdSettings, MdLogout, MdSearch, MdNotifications, MdPendingActions, MdBolt,
  MdChevronLeft, MdChevronRight, MdLightMode, MdDarkMode, MdRefresh,
} from 'react-icons/md';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_BASE = 'http://localhost:5000';

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const currentTab = searchParams.get('tab') || 'dashboard';
  const activeTab = ['dashboard', 'tasks', 'todo', 'planner', 'notes'].includes(currentTab) ? currentTab : 'dashboard';

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Load user
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

  // ── FETCH STATS (now refetches every time you switch to dashboard) ──
  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingStats(true);
    try {
      const res = await fetch(`${API_BASE}/api/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        localStorage.clear();
        navigate('/');
        return;
      }

      if (!res.ok) throw new Error('Server error');

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Dashboard stats error:', err.message);
    } finally {
      setLoadingStats(false);
    }
  }, [navigate]);

  // Auto-refetch when switching to dashboard tab
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab, fetchStats]);

  const handleTabChange = (tab) => setSearchParams({ tab });
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getAvatarColor = (name) => {
    const colors = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#ef4444','#f97316','#10b981'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // ── Sidebar & Header (your original unchanged) ─────────────────────
  const Sidebar = () => (
    <aside className={`h-screen flex flex-col border-r border-border bg-bg-secondary transition-all duration-500 ${isCollapsed ? 'w-16' : 'w-64'}`}>
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
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-accent/10 rounded-lg">
          {isCollapsed ? <MdChevronRight size={22} /> : <MdChevronLeft size={22} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: MdGridView },
          { id: 'tasks', label: 'Tasks', icon: MdTaskAlt },
          { id: 'todo', label: 'To-Do', icon: MdFormatListBulleted },
          { id: 'planner', label: 'Planner', icon: MdCalendarMonth },
          { id: 'notes', label: 'Notes', icon: MdNoteAlt },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-accent/15 text-accent' : 'text-text-muted hover:bg-accent/10 hover:text-text'} ${isCollapsed ? 'justify-center' : ''}`}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 text-sm font-medium">
          <MdLogout size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  const Header = () => (
    <header className="h-16 border-b border-border bg-bg-secondary flex items-center justify-between px-5 md:px-8">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input className="w-full bg-bg border border-border rounded-xl py-2.5 pl-11 pr-4 text-text placeholder:text-text-muted/70 text-sm focus:border-accent/60 focus:ring-2 focus:ring-accent/20 outline-none" placeholder="Search tasks, notes, projects..." />
        </div>
      </div>

      <div className="flex items-center gap-5 md:gap-6">
        <button className="relative p-2.5 text-text-muted hover:text-text hover:bg-accent/10 rounded-lg">
          <MdNotifications size={22} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-bg"></span>
        </button>

        <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 text-text-muted hover:text-accent rounded-lg hover:bg-accent/10">
          {darkMode ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm font-medium">{user.firstName} {user.lastName}</span>
            <div className="size-9 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: getAvatarColor(user.firstName + user.lastName) }}>
              {user.initials}
            </div>
          </div>
        )}
      </div>
    </header>
  );

  // ── Dashboard with Real-Time Chart ─────────────────────────────────
  const DashboardOverview = () => {
    if (loadingStats) {
      return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent"></div></div>;
    }

    if (!stats) {
      return <div className="p-10 text-center text-red-400 text-xl">Failed to load statistics</div>;
    }

    const chartData = {
      labels: stats.weeklyTrend?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          type: 'bar',
          label: 'Daily Activity',
          data: stats.weeklyTrend?.total || [0,0,0,0,0,0,0],
          backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.55)' : 'rgba(99, 102, 241, 0.75)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
          borderRadius: 8,
          barPercentage: 0.65,
        },
        {
          type: 'line',
          label: 'Activity Trend',
          data: stats.weeklyTrend?.total || [0,0,0,0,0,0,0],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgb(16, 185, 129)',
          pointBorderWidth: 3,
          pointRadius: 6,
          borderWidth: 4,
        },
      ],
    };

    return (
      <div className="space-y-10 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            Good {darkMode ? 'evening' : 'morning'}, {user?.firstName || 'User'}!
          </h2>
          <p className="text-text-muted mt-2 text-lg">Here's your daily activity overview</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Tasks", value: stats.totalTasks },
            { title: "Completed", value: stats.completedTasks },
            { title: "Pending", value: stats.pendingTasks },
            { title: "Completion Rate", value: stats.completionRate },
          ].map((c,i) => (
            <div key={i} className="bg-bg-secondary p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
              <p className="text-text-muted text-sm font-medium">{c.title}</p>
              <h3 className="text-3xl font-bold mt-2">{c.value}</h3>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <section className="bg-bg-secondary rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-text">Daily Activity Overview</h3>
              <p className="text-text-muted text-sm md:text-base mt-1">Tasks + To-Dos per day</p>
            </div>
            <button
              onClick={fetchStats}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent-hover transition-all text-sm font-medium"
            >
              <MdRefresh size={18} /> Refresh
            </button>
          </div>

          <div className="p-6 md:p-10 h-80 md:h-[420px]">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text font-display antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 bg-bg transition-colors duration-700">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'todo' && <Todos />}
          {activeTab === 'planner' && <Planner />}
          {activeTab === 'notes' && <Notes />}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;