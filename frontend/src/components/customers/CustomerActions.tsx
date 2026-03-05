export default function CustomerActions() {
  return (
    <div className="mb-4 flex justify-end gap-2.5">
      <button
        className="btn-outline"
        onClick={() => alert("PVB contract later")}
      >
        📄 PVB Contract aanvragen
      </button>

      <button
        className="btn-primary"
        onClick={() => alert("Nieuwe rit boeken later")}
      >
        ➕ Nieuwe rit boeken
      </button>
    </div>
  );
}
