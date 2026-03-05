// src/components/Landing.jsx  (or App.jsx)

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";           // ← added
import "material-symbols";
import { FaMoon, FaSun } from "react-icons/fa";

function Landing() {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <div className="font-display bg-bg dark:bg-bg text-text dark:text-text antialiased min-h-screen">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-white text-2xl">event_available</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Simple Planner</span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <a className="text-sm font-medium hover:text-accent transition-colors" href="#features">
              Features
            </a>
            <a className="text-sm font-medium hover:text-accent transition-colors" href="#analytics">
              Analytics
            </a>
            <a className="text-sm font-medium hover:text-accent transition-colors" href="#testimonials">
              Testimonials
            </a>
            <a className="text-sm font-medium hover:text-accent transition-colors" href="#contact">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent-soft transition-colors"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400 text-lg" />
              ) : (
                <FaMoon className="text-text-muted text-lg" />
              )}
            </button>

            {/* Changed to Link → /auth */}
            <Link
              to="/auth"
              className="hidden sm:block text-sm font-semibold px-4 py-2 hover:bg-accent-soft rounded-lg transition-colors"
            >
              Log In
            </Link>

            <button className="bg-accent text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-accent/20 hover:bg-accent-hover transition-colors">
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-accent-soft text-accent text-xs font-bold tracking-wider uppercase mb-6">
            Redefining Productivity
          </span>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 max-w-4xl">
            Master Your Day, <br />
            <span className="text-accent">Simplify Your Life</span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted max-w-2xl mb-10 leading-relaxed">
            Seamless task and calendar integration designed to help you focus on what matters most. Stop juggling tabs and start making progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent text-white text-lg font-bold px-8 py-4 rounded-xl shadow-xl shadow-accent/30 hover:bg-accent-hover transition-colors">
              Start Planning for Free
            </button>
            <button className="flex items-center justify-center gap-2 bg-bg-secondary border border-border px-8 py-4 rounded-xl font-bold hover:bg-accent-soft transition-colors">
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>

          {/* Dashboard UI Preview */}
          <div className="mt-20 w-full max-w-5xl rounded-2xl border border-border shadow-2xl overflow-hidden bg-bg-secondary">
            <div className="bg-bg px-4 py-3 flex gap-2 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <img
              className="w-full h-auto"
              alt="Clean minimal dashboard interface with calendar and tasks"
              src="https://placehold.co/1200x600/3211d4/ffffff/png?text=Dashboard+Preview+(Calendar+%26+Tasks)"
            />
          </div>
        </div>
      </section>

      {/* Product Overview - What is Simple Planner? */}
      <section className="py-24 bg-bg-secondary" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">What is Simple Planner?</h2>
              <p className="text-lg text-text-muted mb-10">
                An all-in-one workspace for tasks, notes, and planning. We've built the ultimate tool for those who need more than a list but less than a complex project manager.
              </p>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined text-3xl">calendar_month</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Integrated Calendar</h3>
                    <p className="text-text-muted">Sync your schedule across all devices effortlessly. View your to-dos alongside your meetings.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined text-3xl">task_alt</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Quick To-Dos</h3>
                    <p className="text-text-muted">Capture tasks the moment they come to mind with our natural language processing shortcuts.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center text-accent">
                    <span className="material-symbols-outlined text-3xl">edit_note</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Rich Notes</h3>
                    <p className="text-text-muted">Draft detailed plans with our powerful rich text editor. Link notes to tasks and events.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-accent-soft rounded-3xl -rotate-2"></div>
              <img
                className="relative rounded-2xl shadow-xl w-full border border-border"
                alt="Close up of task management cards and notes"
                src="https://placehold.co/800x500/3211d4/ffffff/png?text=Task+Cards+%26+Notes+View"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why We're Different</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            We bridge the gap between quick lists and complex enterprise tools.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-border bg-bg-secondary hover:border-accent transition-colors group">
            <span className="material-symbols-outlined text-4xl text-accent mb-6 group-hover:scale-110 transition-transform inline-block">analytics</span>
            <h3 className="text-xl font-bold mb-4">Smart Analytics</h3>
            <p className="text-text-muted leading-relaxed">
              Understand your habits. See when you're most productive and where your time goes each week.
            </p>
          </div>
          <div className="p-8 rounded-2xl border border-border bg-bg-secondary hover:border-accent transition-colors group">
            <span className="material-symbols-outlined text-4xl text-accent mb-6 group-hover:scale-110 transition-transform inline-block">sync</span>
            <h3 className="text-xl font-bold mb-4">Seamless Sync</h3>
            <p className="text-text-muted leading-relaxed">
              Real-time synchronization across desktop, mobile, and web. Never lose a task again.
            </p>
          </div>
          <div className="p-8 rounded-2xl border border-border bg-bg-secondary hover:border-accent transition-colors group">
            <span className="material-symbols-outlined text-4xl text-accent mb-6 group-hover:scale-110 transition-transform inline-block">grid_view</span>
            <h3 className="text-xl font-bold mb-4">Flexible Views</h3>
            <p className="text-text-muted leading-relaxed">
              Switch between List, Kanban, and Calendar views with a single click to match your workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Analytics Highlight */}
      <section className="py-24 bg-accent text-white overflow-hidden" id="analytics">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Track Your Growth</h2>
              <p className="bg-white/10 p-2 rounded inline-block text-xs font-bold uppercase mb-4">Insights Dashboard</p>
              <p className="text-lg opacity-90 mb-8 leading-relaxed">
                Data-driven productivity isn't just for teams. Simple Planner provides personal insights that help you optimize your schedule and celebrate your wins.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-black mb-1">87%</div>
                  <p className="text-sm opacity-80 uppercase tracking-wide">Completion Rate</p>
                </div>
                <div>
                  <div className="text-3xl font-black mb-1">12h</div>
                  <p className="text-sm opacity-80 uppercase tracking-wide">Weekly Focus Time</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-bg-secondary rounded-2xl p-8 text-text shadow-2xl">
                <div className="flex justify-between items-end h-64 gap-3">
                  {/* Simple Bar Chart */}
                  <div className="flex-1 bg-accent-soft rounded-t-lg relative group">
                    <div className="absolute bottom-0 w-full bg-accent rounded-t-lg transition-all h-2/3"></div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-text-muted uppercase">Mon</span>
                  </div>
                  <div className="flex-1 bg-accent-soft rounded-t-lg relative group">
                    <div className="absolute bottom-0 w-full bg-accent rounded-t-lg transition-all h-3/4"></div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-text-muted uppercase">Tue</span>
                  </div>
                  {/* ... rest of bars ... */}
                </div>

                <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center">
                      <span className="material-symbols-outlined text-text-muted">pie_chart</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Category Mix</p>
                      <p className="text-xs text-text-muted">Work, Personal, Growth</p>
                    </div>
                  </div>
                  <button className="text-accent text-sm font-bold">Full Report →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ... Testimonials, Contact, Footer sections follow the same pattern ... */}

      {/* Example: Testimonials card */}
      <section className="py-24 bg-bg" id="testimonials">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Loved by Productive People</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-bg-secondary border border-border">
              <p className="text-text-muted italic mb-8">
                "The only planner that actually stuck. It's clean, fast, and doesn't get in my way."
              </p>
              <div className="flex items-center gap-4">
                <img
                  className="w-12 h-12 rounded-full border-2 border-accent-soft object-cover"
                  alt="Portrait of Sarah Jenkins, Designer"
                  src="https://i.pravatar.cc/96?img=44"
                />
                <div>
                  <h4 className="font-bold">Sarah Jenkins</h4>
                  <p className="text-xs text-text-muted uppercase font-semibold">UX Designer</p>
                </div>
              </div>
            </div>
            {/* ... other testimonials ... */}
          </div>
        </div>
      </section>

      {/* Footer example */}
      <footer className="bg-dark-bg text-dark-text py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* ... footer content ... */}
          <div className="pt-8 border-t border-dark-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-dark-text-muted">
            <p>© 2024 Simple Planner Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-dark-text transition-colors" href="#">Twitter</a>
              <a className="hover:text-dark-text transition-colors" href="#">LinkedIn</a>
              <a className="hover:text-dark-text transition-colors" href="#">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;