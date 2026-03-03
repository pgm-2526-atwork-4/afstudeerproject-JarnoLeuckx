export default function CustomerActions() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 16 }}>
      <button
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "white",
          cursor: "pointer",
          fontWeight: 700,
        }}
        onClick={() => alert("PVB contract later")}
      >
        📄 PVB Contract aanvragen
      </button>

      <button
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "none",
          background: "#111827",
          color: "white",
          cursor: "pointer",
          fontWeight: 800,
        }}
        onClick={() => alert("Nieuwe rit boeken later")}
      >
        ➕ Nieuwe rit boeken
      </button>
    </div>
  );
}