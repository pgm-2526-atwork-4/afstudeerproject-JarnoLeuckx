export default function Footer() {
  return (
    <footer className="border-t border-[#1d4fb6] bg-[#0b0b0f] text-slate-200">
      <div className="max-w-6xl mx-auto p-4 text-sm text-center">
        © {new Date().getFullYear()} Social Drive
      </div>
    </footer>
  );
}
