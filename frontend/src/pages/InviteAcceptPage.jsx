import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

import { acceptInvitation } from "../features/auth/invitationService";
import { useAuthStore } from "../store/authStore";

const InviteAcceptPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(
    "Accepting your project invitation...",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("The invitation link is invalid or missing its token.");
      return;
    }

    if (!isAuthenticated) {
      setStatus("login");
      setMessage(
        "Please log in using the email address that received this invitation.",
      );
      return;
    }

    let cancelled = false;

    const handleAcceptance = async () => {
      try {
        const response = await acceptInvitation(token);

        if (cancelled) return;

        setStatus("success");
        setMessage("You have successfully joined the project!");

        setTimeout(() => {
          navigate(`/workspace/${response.data.project_id}`, {
            replace: true,
          });
        }, 1500);
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Unable to accept this invitation. Please try again.",
        );
      }
    };

    handleAcceptance();

    return () => {
      cancelled = true;
    };
  }, [token, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-lg">
        {status === "loading" && (
          <Loader2 className="mx-auto mb-5 h-12 w-12 animate-spin text-[var(--primary)]" />
        )}

        {status === "success" && (
          <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-green-500" />
        )}

        {status === "error" && (
          <AlertCircle className="mx-auto mb-5 h-12 w-12 text-red-500" />
        )}

        <h1 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">
          {status === "success"
            ? "Welcome to CodeRoom!"
            : status === "login"
              ? "Sign in to continue"
              : status === "error"
                ? "Invitation Failed"
                : "Joining Project"}
        </h1>

        <p className="text-sm leading-6 text-[var(--muted)]">{message}</p>

        {status === "login" && (
          <Link
            to={`/login?redirect=${encodeURIComponent(
              window.location.pathname + window.location.search,
            )}`}
            className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-white hover:opacity-90"
          >
            Log In
          </Link>
        )}

        {status === "error" && (
          <Link
            to="/dashboard"
            className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-white hover:opacity-90"
          >
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default InviteAcceptPage;
