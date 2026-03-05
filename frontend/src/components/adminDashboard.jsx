// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentTab = searchParams.get('tab') || 'users';
  const validTabs = ['users', 'analytics'];
  const activeTab = validTabs.includes(currentTab) ? currentTab : 'users';

  // Admin's own info for avatar
  const [adminUser, setAdminUser] = useState(null);

  // Users list from backend
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dark mode
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

  useEffect(() => {
    if (!searchParams.has('tab')) {
      setSearchParams({ tab: 'users' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Load admin info & fetch users on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      navigate('/');
      return;
    }

    // Set admin's own avatar info
    const firstName = localStorage.getItem('firstName') || 'Admin';
    const lastName = localStorage.getItem('lastName') || '';
    setAdminUser({
      firstName,
      lastName,
      initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
    });

    // Fetch users
    fetchUsers(token);
  }, [navigate]);

  const fetchUsers = async (token) => {
  setLoading(true);
  setError(null);

  console.log("Attempting to fetch users with token:", token ? token.substring(0, 20) + "..." : "MISSING TOKEN");

  try {
    const res = await fetch("http://localhost:5000/auth/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = {};
      }
      console.log("Error response from server:", errorData);

      if (res.status === 401 || res.status === 403 || res.status === 422) {
        console.warn("Auth error - clearing session");
        localStorage.clear();
        navigate("/");
        return;
      }
      throw new Error(errorData.error || `Server error: ${res.status}`);
    }

    const data = await res.json();
    console.log("Users loaded:", data);
    setUsers(data);
  } catch (err) {
    console.error("Fetch users failed:", err.message);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleDeleteUser = async (userId) => {
    // Prevent self-deletion
    const currentUserId = parseInt(localStorage.getItem('userId') || '0'); // optional: if you store userId
    if (userId === currentUserId) {
      alert("You cannot delete your own account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh the list
      fetchUsers(token);
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    // localStorage.removeItem('userId'); // if you have it
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Avatar color generator (same as UserDashboard)
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
    <aside className="w-64 border-r border-border flex flex-col h-screen bg-bg-secondary shrink-0 transition-colors duration-500">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-xl">event_note</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none text-text">Simple Planner</h1>
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {[
          { id: 'users', label: 'Users', icon: 'group', active: activeTab === 'users' },
          { id: 'analytics', label: 'Analytics', icon: 'analytics', active: activeTab === 'analytics' },
          { id: 'projects', label: 'Projects', icon: 'folder', active: false },
          { id: 'subscriptions', label: 'Subscriptions', icon: 'payments', active: false },
          { id: 'settings', label: 'Settings', icon: 'settings', active: false },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => item.id !== 'settings' && handleTabChange(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300
              ${item.active
                ? 'bg-primary-soft dark:bg-primary/20 text-primary font-semibold'
                : 'text-text-muted hover:text-primary hover:bg-primary-soft dark:hover:bg-primary/10'
              }
            `}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-text-muted hover:text-primary rounded-lg transition-colors">
          <span className="material-symbols-outlined text-[20px]">help_center</span>
          <span className="text-sm font-medium">Help Center</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );

  // ─── Header ────────────────────────────────────────────────────
  const Header = () => (
    <header className="h-16 flex items-center justify-between px-8 bg-bg border-b border-border transition-colors duration-500">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold text-text">
          {activeTab === 'users' ? 'Users' : 'Analytics Overview'}
        </h2>

        {activeTab === 'analytics' && (
          <button className="flex items-center gap-2 text-sm font-medium text-text-muted bg-bg-secondary border border-border px-3 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            Last 30 Days
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-5">
        <button className="p-2 text-text-muted hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>

        {activeTab === 'users' && (
          <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined">person_add</span>
            Add User
          </button>
        )}

        {/* Admin avatar with initials */}
        {adminUser ? (
          <div
            className="h-8 w-8 rounded-full border-2 border-accent/30 flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: getAvatarColor(adminUser.firstName + adminUser.lastName) }}
          >
            {adminUser.initials}
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-700 animate-pulse" />
        )}
      </div>
    </header>
  );

  // ─── Users Tab Content ─────────────────────────────────────────
  const UsersTab = () => (
    <div className="p-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">Users</h1>
          <p className="text-text-muted mt-1">Manage member account permissions and access levels.</p>
        </div>
        <div className="flex gap-2 border-b border-border">
          <button className="px-4 py-2 text-sm font-semibold text-primary border-b-2 border-primary">All Users</button>
          <button className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text transition-colors">Active</button>
          <button className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text transition-colors">Inactive</button>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    Loading users...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    No users registered yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const initials = `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase();
                  const color = getAvatarColor(user.first_name + user.last_name);

                  return (
                    <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-text-muted">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: color }}
                          >
                            {initials || '??'}
                          </div>
                          <span className="text-sm font-semibold text-text">
                            {user.first_name} {user.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-accent/20 text-accent dark:bg-accent/30'
                              : 'bg-bg-secondary text-text-muted dark:bg-slate-800'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-emerald-500"></span>
                          <span className="text-sm font-medium text-text">Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button className="text-accent hover:text-accent-hover text-sm font-bold tracking-wide">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-600 text-sm font-bold tracking-wide"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-border bg-surface/50 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing {users.length} {users.length === 1 ? 'user' : 'users'}
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm font-medium text-text-muted hover:bg-bg border border-border rounded transition-all">
              Previous
            </button>
            <button className="px-3 py-1 text-sm font-medium text-white bg-primary rounded shadow-sm transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Analytics Tab Content ─────────────────────────────────────
  const AnalyticsTab = () => (
    <div className="p-8">
      {/* Stats Grid - now using real user count */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Users', value: users.length.toString(), change: '', icon: 'group', color: 'blue' },
          { title: 'Admins', value: users.filter(u => u.role === 'admin').length.toString(), change: '', icon: 'security', color: 'accent' },
          { title: 'Regular Users', value: users.filter(u => u.role !== 'admin').length.toString(), change: '', icon: 'people', color: 'emerald' },
          { title: 'System Health', value: '99.9%', change: '', icon: 'dns', color: 'amber' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-bg-secondary p-6 rounded-xl border border-border shadow-sm transition-colors duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted text-sm font-medium">{stat.title}</span>
              <div className={`p-2 bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 rounded-lg`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* You can keep your existing charts and table as placeholder */}
      {/* ... paste your original charts + real-time table here if you want ... */}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden font-display bg-bg text-text antialiased transition-colors duration-500">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-bg transition-colors duration-500 p-6">
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;