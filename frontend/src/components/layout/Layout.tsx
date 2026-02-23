import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-120px)]">{children}</main>
      <Footer />
    </>
  );
}