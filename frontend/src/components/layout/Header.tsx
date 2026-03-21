import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  getCurrentUser,
  logout,
  onAuthChanged,
  type User,
} from "../../auth/auth.api";
import { Bell, Menu, X } from "lucide-react";
import {
  getMyNotifications,
  markNotificationAsRead,
  type NotificationItem,
} from "../../lib/notification.api";

export default function Header() {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement | null>(null);

  const accountPath =
    user?.role === "driver"
      ? "/driver/account"
      : user?.role === "customer"
        ? "/customer/account"
        : "/login";

  useEffect(() => {
    const sync = () => {
      setUser(getCurrentUser());
    };

    const offAuthChanged = onAuthChanged(sync);
    window.addEventListener("storage", sync);

    return () => {
      offAuthChanged();
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsNotificationsOpen(false);
      setIsMobileNavOpen(false);
      return;
    }

    void loadNotifications();
  }, [user]);

  useEffect(() => {
    if (!isNotificationsOpen && !isAccountMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!notificationMenuRef.current) {
        return;
      }

      if (!notificationMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
        setIsAccountMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsAccountMenuOpen(false);
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen, isNotificationsOpen]);

  async function handleLogout() {
    await logout();
    setIsAccountMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsMobileNavOpen(false);
    setUser(getCurrentUser());
  }

  function closeMenus() {
    setIsAccountMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsMobileNavOpen(false);
  }

  async function loadNotifications() {
    setNotificationsLoading(true);

    try {
      const result = await getMyNotifications();
      setNotifications(result.items);
      setUnreadCount(result.unread_count);
    } finally {
      setNotificationsLoading(false);
    }
  }

  async function handleNotificationClick(notification: NotificationItem) {
    if (!notification.read_at) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? { ...item, read_at: new Date().toISOString() }
              : item,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        return;
      }
    }

    if (notification.url) {
      window.location.href = notification.url;
      return;
    }

    setIsNotificationsOpen(false);
  }

  return (
    <header className="relative z-[80] border-b border-[#D7E3F7] bg-[linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(234,243,255,0.92)_50%,rgba(255,255,255,0.92)_100%)] backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-2 md:grid-cols-[auto_1fr_auto] md:gap-5">
        <div className="justify-self-start">
          <a href="/" className="shrink-0 no-underline">
            <img
              src="/image/logo.png"
              alt="Social Drive"
              className="h-16 w-auto object-contain drop-shadow-[0_4px_10px_rgba(15,23,42,0.2)] transition duration-300 hover:scale-[1.02] sm:h-20 md:h-24"
            />
          </a>
        </div>

        <nav
          aria-label="Hoofdnavigatie"
          className="hidden justify-self-center md:block"
        >
          <ul className="flex list-none items-center gap-2">
            <li>
              <NavLink
                to="/rolstoelvervoer"
                onClick={closeMenus}
                className={({ isActive }) =>
                  `relative rounded-md px-4 py-2 text-[13px] font-bold uppercase tracking-[0.04em] transition-all duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#0043A8] after:transition-transform after:duration-200 hover:after:scale-x-100 ${
                    isActive
                      ? "text-[#0043A8] after:scale-x-100"
                      : "text-slate-700 hover:text-[#0043A8]"
                  }`
                }
              >
                Rolstoelvervoer
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/luchthavenvervoer"
                onClick={closeMenus}
                className={({ isActive }) =>
                  `relative rounded-md px-4 py-2 text-[13px] font-bold uppercase tracking-[0.04em] transition-all duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#0043A8] after:transition-transform after:duration-200 hover:after:scale-x-100 ${
                    isActive
                      ? "text-[#0043A8] after:scale-x-100"
                      : "text-slate-700 hover:text-[#0043A8]"
                  }`
                }
              >
                Luchthaven
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/assistentie"
                onClick={closeMenus}
                className={({ isActive }) =>
                  `relative rounded-md px-4 py-2 text-[13px] font-bold uppercase tracking-[0.04em] transition-all duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#0043A8] after:transition-transform after:duration-200 hover:after:scale-x-100 ${
                    isActive
                      ? "text-[#0043A8] after:scale-x-100"
                      : "text-slate-700 hover:text-[#0043A8]"
                  }`
                }
              >
                Assistentie
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                onClick={closeMenus}
                className={({ isActive }) =>
                  `relative rounded-md px-4 py-2 text-[13px] font-bold uppercase tracking-[0.04em] transition-all duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#0043A8] after:transition-transform after:duration-200 hover:after:scale-x-100 ${
                    isActive
                      ? "text-[#0043A8] after:scale-x-100"
                      : "text-slate-700 hover:text-[#0043A8]"
                  }`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          {!user ? (
            <>
              <NavLink
                to="/login"
                onClick={closeMenus}
                className={({ isActive }) =>
                  `btn-accent hidden rounded-full sm:inline-flex ${isActive ? "" : "opacity-95"}`
                }
              >
                Login
              </NavLink>

              <button
                type="button"
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
                className="btn-outline rounded-full px-3 py-2 md:hidden"
                aria-expanded={isMobileNavOpen}
                aria-label="Open navigatie"
              >
                {isMobileNavOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </>
          ) : (
            <div
              className="relative flex items-center gap-2"
              ref={notificationMenuRef}
            >
              <button
                type="button"
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
                className="btn-outline rounded-full px-3 py-2 md:hidden"
                aria-expanded={isMobileNavOpen}
                aria-label="Open navigatie"
              >
                {isMobileNavOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAccountMenuOpen((prev) => !prev);
                  if (!isAccountMenuOpen) {
                    void loadNotifications();
                  }
                }}
                className="btn-outline rounded-full px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-1 relative"
                aria-expanded={isAccountMenuOpen}
                aria-controls="account-menu"
                aria-label="Open accountpaneel"
              >
                <span className="hidden sm:inline">Mijn account</span>
                <span className="sm:hidden">Account</span>
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${isAccountMenuOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.855a.75.75 0 111.08 1.04l-4.24 4.4a.75.75 0 01-1.08 0l-4.24-4.4a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isAccountMenuOpen && (
                <div
                  id="account-menu"
                  aria-label="Accountpaneel"
                  className={`absolute right-2 md:right-2 left-auto md:left-auto mx-0 md:mx-0 top-full md:mt-2 z-[90] w-[min(18rem,calc(100vw-1rem))] max-h-[80vh] overflow-y-auto rounded-xl border border-slate-200 bg-white pt-5 p-3 shadow-xl transition-all duration-200 ease-out
                    before:absolute before:-top-2 before:right-6 before:h-3 before:w-3 before:rotate-45 before:bg-white before:border-l before:border-t before:border-slate-200 before:shadow before:z-[-1]
                    ${isAccountMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
                    sm:left-auto sm:right-2 left-1/2 -translate-x-1/2 sm:translate-x-0`}
                  style={{
                    visibility: isAccountMenuOpen ? "visible" : "hidden",
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <NavLink
                      to={accountPath}
                      onClick={() => {
                        closeMenus();
                      }}
                      className="btn-outline w-full justify-start"
                    >
                      Mijn account
                    </NavLink>

                    {user?.role === "customer" && (
                      <NavLink
                        to="/customer/settings"
                        onClick={() => {
                          closeMenus();
                        }}
                        className="btn-outline w-full justify-start"
                      >
                        Instellingen
                      </NavLink>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsNotificationsOpen((prev) => !prev);
                        if (!isNotificationsOpen) {
                          void loadNotifications();
                        }
                      }}
                      className="btn-outline flex w-full items-center justify-between"
                      aria-expanded={isNotificationsOpen}
                      aria-controls="notification-menu"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Bell className="h-4 w-4" aria-hidden="true" />
                        Meldingen
                      </span>
                      {unreadCount > 0 && (
                        <span
                          className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white"
                          aria-label={`${unreadCount > 9 ? "Meer dan 9" : unreadCount} ongelezen meldingen`}
                        >
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        void handleLogout();
                      }}
                      className="btn-danger w-full"
                    >
                      Logout
                    </button>
                  </div>

                  {isNotificationsOpen && (
                    <div
                      id="notification-menu"
                      aria-label="Meldingen"
                      className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2"
                    >
                      <div className="mb-2 text-sm font-bold text-slate-900">
                        Meldingen
                      </div>

                      {notificationsLoading ? (
                        <p className="text-sm text-slate-500">Laden...</p>
                      ) : notifications.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          Geen meldingen.
                        </p>
                      ) : (
                        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                          {notifications.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() => {
                                void handleNotificationClick(notification);
                              }}
                              className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                                notification.read_at
                                  ? "border-slate-200 bg-white"
                                  : "border-blue-200 bg-blue-50"
                              }`}
                            >
                              <div className="text-sm font-semibold text-slate-900">
                                {notification.title}
                              </div>
                              {notification.body && (
                                <div className="mt-1 text-xs text-slate-600">
                                  {notification.body}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isMobileNavOpen && (
        <div className="border-t border-[#D7E3F7] px-4 pb-4 md:hidden">
          <nav
            aria-label="Mobiele hoofdnavigatie"
            className="mx-auto max-w-6xl"
          >
            <ul className="mt-3 grid gap-2">
              {[
                ["/rolstoelvervoer", "Rolstoelvervoer"],
                ["/luchthavenvervoer", "Luchthaven"],
                ["/assistentie", "Assistentie"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={closeMenus}
                    className={({ isActive }) =>
                      [
                        "block rounded-xl border px-4 py-3 text-sm font-semibold transition",
                        isActive
                          ? "border-[#0043A8] bg-[#EAF3FF] text-[#0043A8]"
                          : "border-slate-200 bg-white text-slate-700",
                      ].join(" ")
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}

              {!user && (
                <li>
                  <NavLink
                    to="/login"
                    onClick={closeMenus}
                    className="btn-accent w-full justify-center"
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
