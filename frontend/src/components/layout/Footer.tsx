export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(90deg,#001A3D_0%,#00306F_60%,#001A3D_100%)] text-white">
      <div className="max-w-6xl mx-auto p-4 text-sm text-center">
        © {new Date().getFullYear()} Social Drive
      </div>
    </footer>
  );
}
