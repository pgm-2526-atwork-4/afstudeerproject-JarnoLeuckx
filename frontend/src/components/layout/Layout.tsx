import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { enforceActiveSession, touchActivity } from "../../auth/auth.api";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F9F6EF] via-white to-[#EAF2FF]">
      <Header />

      {/* Main groeit automatisch en vult scherm */}
      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
}
