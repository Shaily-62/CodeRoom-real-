import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { signupUser } from "./authService";
import { useAuthStore } from "../../store/authStore";

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const redirectTo = new URLSearchParams(location.search).get("redirect");

  const safeRedirect =
    redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/dashboard";

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await signupUser(formData);
      const result = response.data;

      if (result.session) {
        setAuth({
          user: result.user,
          profile: null,
          session: result.session,
        });

        navigate(safeRedirect, { replace: true });
      } else {
        setSuccess(
          "Account created! Please confirm your email before logging in.",
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create your account.");
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
          <h2 className="text-2xl font-semibold">Create your account</h2>

          <p className="text-muted text-sm mt-2 mb-7">
            Start building something great with your team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary"
              />
            </div>

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
                placeholder="At least 8 characters"
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary"
              />
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            {success && <p className="text-success text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary text-background py-3 font-semibold hover:bg-primary-hover transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-7">
            Already have an account?{" "}
            <Link
              to={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-primary font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          By creating an account, you agree to use CodeRoom responsibly.
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
