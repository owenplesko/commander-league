export function PP({
  packPoints,
  accent = false,
}: {
  packPoints: number;
  accent?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        color: accent ? "var(--highlight-text-color)" : "var(--text-color)",
      }}
    >
      <i className="pi pi-ticket" style={{ marginRight: "0.5rem" }} />
      {packPoints}
    </span>
  );
}
