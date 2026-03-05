import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IoCalendarSharp } from "react-icons/io5";

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "signin";
  const activeTab = ["signin", "signup"].includes(currentTab)
    ? currentTab
    : "signin";
  const navigate = useNavigate();

  // Read theme from localStorage (or default to light)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  // Apply dark class to <html> when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null); // null = not checked, true/false = result

  const API_BASE = "http://localhost:5000"; // ← change if your Flask port is different

  // Username live availability check (debounced)
  useEffect(() => {
    if (
      activeTab !== "signup" ||
      !formData.username ||
      formData.username.length < 3
    ) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/auth/check-username?username=${encodeURIComponent(formData.username)}`,
        );
        const data = await res.json();

        if (res.ok) {
          setUsernameAvailable(data.available);
        } else {
          setUsernameAvailable(false);
        }
      } catch {
        setUsernameAvailable(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.username, activeTab]);

  const validateSignUp = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (usernameAvailable === false)
      newErrors.username = "Username is already taken";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignIn = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateSignIn()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token (you can use context / redux later)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") {
        navigate("/admin?tab=users");
      } else {
        navigate("/dashboard?tab=dashboard");
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateSignUp()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto-login after register (optional – you can force login instead)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "user");

      navigate("/dashboard?tab=dashboard");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-display bg-bg text-text antialiased">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* LEFT / MARKETING SECTION ─ visible on lg+ */}
        <div className="relative hidden lg:flex lg:w-1/2 bg-bg-secondary flex-col justify-between p-12 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/10 dark:bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/5 dark:bg-accent/15 blur-3xl" />

          <div className="relative justify-center z-10 flex items-center gap-3">
            <IoCalendarSharp className="text-2xl text-accent" />
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Simple Planner Auth
            </h1>
          </div>

          <div className="relative z-10 max-w-lg">
            {activeTab === "signin" ? (
              <>
                <h2 className="mb-6 text-center text-5xl font-black leading-tight text-text tracking-tight">
                  Welcome back!
                </h2>
                <p className="text-xl text-center text-text/80">
                  Your tasks and plans are waiting. Jump right back into.
                </p>
              </>
            ) : (
              <>
                <h2 className="mb-6 text-5xl text-center font-black leading-tight text-text tracking-tight">
                  Join to Simple your life
                </h2>
                <p className="text-xl text-center text-text/80">
                  Sync your plans. Access from anywhere.
                </p>
              </>
            )}

            <div className="mt-12 space-y-8">
              <Feature
                icon="check_circle"
                title="Intuitive Tasks"
                desc="Visual Calendar"
              />
              <Feature
                icon="analytics"
                title="Progress Insights"
                desc="See where your progress"
              />
              <Feature
                icon="notes"
                title="Rich Notes"
                desc="Note down your ideas"
              />
            </div>
          </div>

          <div className="relative text-center z-10 text-sm opacity-50 text-text/50">
            © 2025 Simple Planner
          </div>
        </div>

        {/* RIGHT / FORM SECTION */}
        <div className="flex-1 flex items-center justify-center bg-bg px-6 py-12 lg:px-16">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-white">
                <span className="material-symbols-outlined text-3xl">
                  event_upcoming
                </span>
              </div>
              <h1 className="text-2xl font-bold text-text">Simple Planner</h1>
            </div>

            {/* Tabs */}
            <div className="mb-10 flex rounded-xl bg-bg-secondary/30 dark:bg-bg-secondary/50 p-1.5 backdrop-blur-sm border border-border/40 dark:border-dark-border">
              <button
                type="button"
                onClick={() => setSearchParams({ tab: "signin" })}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "signin"
                    ? "bg-bg-secondary text-text shadow-md dark:bg-slate-700"
                    : "text-text/80 hover:text-accent hover:bg-bg-secondary/50 dark:hover:bg-slate-700/50"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setSearchParams({ tab: "signup" })}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "signup"
                    ? "bg-bg-secondary text-text shadow-md dark:bg-slate-700"
                    : "text-text/80 hover:text-accent hover:bg-bg-secondary/50 dark:hover:bg-slate-700/50"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-text tracking-tight">
                {activeTab === "signin" ? "Sign In" : "Create Account"}
              </h2>
              <p className="mt-2 text-text/70">
                {activeTab === "signin"
                  ? "Enter your credentials to continue"
                  : ""}
              </p>
            </div>

            {/* FORMS */}
            {activeTab === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-6">
                <InputField
                  icon="person"
                  label="Username"
                  name="username" // must have
                  placeholder="yourname"
                  type="text"
                  value={formData.username} // must have
                  onChange={handleChange} // must have
                  error={errors.username}
                />
                <InputField
                  icon="lock"
                  label="Password"
                  name="password" // must have
                  placeholder="••••••••"
                  type="password"
                  value={formData.password} // must have
                  onChange={handleChange} // must have
                  error={errors.password}
                />

                {apiError && (
                  <p className="text-red-500 text-sm text-center">{apiError}</p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-border/50 bg-bg-secondary checked:bg-accent checked:border-accent focus:ring-accent/30 dark:focus:ring-accent/40"
                    />
                    <span className="text-text/80">Remember me</span>
                  </label>
                  <a href="#" className="text-accent hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-accent-hover  text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 group ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && (
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    name="firstName"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                </div>

                <InputField
                  label="Username"
                  name="username"
                  placeholder="janedoe123"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  helper={
                    usernameAvailable === true ? (
                      <span className="text-green-500 text-xs">
                        Username available
                      </span>
                    ) : usernameAvailable === false ? (
                      <span className="text-red-500 text-xs">
                        Username taken
                      </span>
                    ) : null
                  }
                />

                <InputField
                  label="Email"
                  name="email"
                  placeholder="jane@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                  />
                </div>

                {apiError && (
                  <p className="text-red-500 text-sm text-center">{apiError}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-accent-hover dark:bg-accent-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/20 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-text/70">
              {activeTab === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="?tab=signup"
                    onClick={() => setSearchParams({ tab: "signup" })}
                    className="text-accent font-bold hover:underline"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    to="?tab=signin"
                    onClick={() => setSearchParams({ tab: "signin" })}
                    className="text-accent font-bold hover:underline"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 dark:bg-accent/20 text-accent shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h3 className="font-bold text-text">{title}</h3>
        <p className="text-text/70 text-sm">{desc}</p>
      </div>
    </div>
  );
}

function InputField({
  icon,
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text/90 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 mt-4 flex items-center pl-4 text-text/50 dark:text-text/40 material-symbols-outlined">
            {icon}
          </span>
        )}
        <input
          name={name} // ← now used
          type={type}
          placeholder={placeholder}
          value={value || ""} // ← now controlled
          onChange={onChange} // ← now updates state
          className={`
            w-full rounded-xl
            bg-input-bg
            border ${error ? "border-red-500" : "border-border dark:border-border"}
            px-4 py-3.5 text-text
            placeholder:text-text/40 dark:placeholder:text-text/50
            focus:border-accent focus:ring-2 focus:ring-accent/20 dark:focus:ring-accent/30
            transition-all outline-none
            ${icon ? "pl-11" : "pl-4"}
          `}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
