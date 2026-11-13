function MemberRoleSelect({
  role,
  onChange,
  disabled = false,
  isOwner = false,
}) {
  if (isOwner) {
    return (
      <span
        className="
          rounded-md
          bg-[var(--surface-secondary)]
          px-2.5 py-1
          text-xs font-medium
          text-[var(--muted)]
        "
      >
        Owner
      </span>
    );
  }

  return (
    <select
      value={role}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="
        rounded-lg border border-[var(--border)]
        bg-[var(--surface)]
        px-2.5 py-1.5
        text-xs
        text-[var(--foreground)]
        outline-none
        focus:border-[var(--primary)]
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <option value="editor">Editor</option>
      <option value="viewer">Viewer</option>
    </select>
  );
}

export default MemberRoleSelect;
