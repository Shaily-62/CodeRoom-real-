import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { loginUser } from "./authService";
import { useAuthStore } from "../../store/authStore";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const redirectTo = new URLSearchParams(location.search).get("redirect");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(formData);
      const result = response.data;

      setAuth({
        user: result.user,
        profile: null,
        session: result.session,
      });

      // Return the user to the invitation page after login.
      // Only allow internal application paths.
      const safeRedirect =
        redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
          ? redirectTo
          : "/dashboard";

      navigate(safeRedirect, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to log in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Code<span className="text-primary">Room</span>
          </h1>
          <p className="text-muted mt-2">Build together. Ship together.</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold">Welcome back</h2>

          <p className="text-muted text-sm mt-2 mb-7">
            Log in to continue working with your team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary"
              />
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary text-background py-3 font-semibold hover:bg-primary-hover transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-7">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
