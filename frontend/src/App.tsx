import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F5F5F5] px-6 py-12">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="mb-2 text-3xl font-bold text-[#0043A8]">
            Social <span className="text-[#FDB812]">Drive</span>
          </h1>

          <p className="mt-3 text-[#001A3D]">Logo kleuren preview</p>

          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
            <div className="rounded-lg bg-[#0043A8] p-4 font-semibold text-white">
              primaryBlue
              <br />
              <span className="text-xs">#0043A8</span>
            </div>
            <div className="rounded-lg bg-[#FDB812] p-4 font-semibold text-[#001A3D]">
              accentYellow
              <br />
              <span className="text-xs">#FDB812</span>
            </div>
            <div className="rounded-lg bg-[#2E8FDB] p-4 font-semibold text-white">
              lightBlue
              <br />
              <span className="text-xs">#2E8FDB</span>
            </div>
            <div className="rounded-lg bg-[#001A3D] p-4 font-semibold text-white">
              dark
              <br />
              <span className="text-xs">#001A3D</span>
            </div>
            <div className="rounded-lg border border-[#001A3D]/20 bg-[#F5F5F5] p-4 font-semibold text-[#001A3D]">
              lightGray
              <br />
              <span className="text-xs">#F5F5F5</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
