import { useState } from "react";
import Cookies from "js-cookie";

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => {
  
    return !Cookies.get("cookieConsent");
  });

  function acceptCookies() {
    Cookies.set("cookieConsent", "accepted", { expires: 365 });
    
    Cookies.set("sitePrefs", JSON.stringify({ darkMode: false }), {
      expires: 365,
    });
    setVisible(false);
  }

  function declineCookies() {
    Cookies.set("cookieConsent", "declined", { expires: 365 });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <span className="font-semibold">Cookies</span> — Deze site gebruikt
        cookies voor een optimale werking en anonieme statistieken. Je kunt zelf
        kiezen of je hiermee akkoord gaat.
      </div>
      <div className="flex gap-2">
        <button className="btn-primary px-4 py-2" onClick={acceptCookies}>
          Accepteren
        </button>
        <button className="btn-outline px-4 py-2" onClick={declineCookies}>
          Weigeren
        </button>
      </div>
    </div>
  );
}
