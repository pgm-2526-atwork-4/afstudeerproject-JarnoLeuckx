import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { enforceActiveSession, touchActivity } from "../../auth/auth.api";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const events: Array<keyof WindowEventMap> = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ];

    const handleActivity = () => {
      if (enforceActiveSession()) {
        touchActivity();
      }
    };

    enforceActiveSession();
    handleActivity();

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    const intervalId = window.setInterval(() => {
      enforceActiveSession();
    }, 60_000);

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleScrollVisibility = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    handleScrollVisibility();
    window.addEventListener("scroll", handleScrollVisibility, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScrollVisibility);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F9F6EF] via-white to-[#EAF2FF]">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-md bg-[#0043A8] px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Spring naar hoofdinhoud
      </a>

      <Header />

      {/* Main groeit automatisch en vult scherm */}
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        {children}
      </main>

      <Footer />

      <div
        className={`group fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Terug naar boven"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#0043A8] bg-[#0043A8] text-white shadow-lg transition-colors hover:bg-[#003688]"
        >
          <ChevronUp className="h-5 w-5" />
        </button>

        <span className="pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
          Naar boven
        </span>
      </div>
    </div>
  );
}
