export default function Footer() {
  return (
    <footer className="bg-[#001A3D] text-white">
      <div className="max-w-6xl mx-auto p-4 text-sm text-center">
        © {new Date().getFullYear()} Social Drive
      </div>
    </footer>
  );
}
