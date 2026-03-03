type Props = {
  name: string;
  email: string;
  phone: string;
};

export default function CustomerProfileCard({ name, email, phone }: Props) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 18,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 16,
      }}
    >
      <Info label="Naam" value={name} icon="👤" />
      <Info label="Email" value={email} icon="✉️" />
      <Info label="Telefoon" value={phone} icon="📞" />
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f1f5f9", display: "grid", placeItems: "center" }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>{label}</div>
        <div style={{ fontWeight: 800 }}>{value}</div>
      </div>
    </div>
  );
}