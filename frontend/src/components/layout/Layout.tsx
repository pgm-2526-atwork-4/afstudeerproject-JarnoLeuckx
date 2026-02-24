import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F9F6EF] via-white to-[#EAF2FF]">
      
      <Header />

      {/* Main groeit automatisch en vult scherm */}
      <main className="flex-grow">
        {children}
      </main>

      <Footer />

    </div>
  );
}