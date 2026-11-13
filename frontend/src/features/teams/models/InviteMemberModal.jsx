import { useState } from "react";
import { X, Mail, UserPlus } from "lucide-react";

function InviteMemberModal({ isOpen, onClose, onInvite, loading = false }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const invitedEmail = email.trim().toLowerCase();

    if (!invitedEmail) {
      setError("Please enter an email address.");
      return;
    }

    try {
      await onInvite({
        invited_email: invitedEmail,
        role,
      });

      setEmail("");
      setRole("editor");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to send invitation.",
      );
    }
  };

  const handleClose = () => {
    if (loading) return;

    setEmail("");
    setRole("editor");
    setError("");
    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 p-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl border border-[var(--border)]
          bg-[var(--surface)]
          p-6 shadow-2xl
        "
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl bg-[var(--surface-secondary)]
                text-[var(--primary)]
              "
            >
              <UserPlus size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Invite a teammate
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Add someone to your project.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-secondary)]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Email address
            </label>

            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3">
              <Mail size={16} className="text-[var(--muted)]" />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="teammate@example.com"
                required
                disabled={loading}
                className="w-full bg-transparent py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
              Permission
            </label>

            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              disabled={loading}
              className="
                w-full rounded-lg border border-[var(--border)]
                bg-[var(--background)] px-3 py-3
                text-sm text-[var(--foreground)] outline-none
                focus:border-[var(--primary)]
              "
            >
              <option value="editor">Editor — Can edit project files</option>
              <option value="viewer">Viewer — Can view project files</option>
            </select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface-secondary)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="
                rounded-lg bg-[var(--primary)]
                px-4 py-2 text-sm font-semibold
                text-[#171B19] transition-opacity
                hover:opacity-90
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {loading ? "Sending..." : "Send invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteMemberModal;
