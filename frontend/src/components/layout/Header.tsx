import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  getCurrentUser,
  logout,
  onAuthChanged,
  type User,
} from "../../auth/auth.api";
import { Bell } from "lucide-react";
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
    setUser(getCurrentUser());
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
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-5 px-4 py-2">
        <div className="justify-self-start">
          <a href="/" className="shrink-0 no-underline">
            <img
              src="/image/logo.png"
              alt="Social Drive"
              className="h-24 w-auto object-contain drop-shadow-[0_4px_10px_rgba(15,23,42,0.2)] transition duration-300 hover:scale-[1.02]"
            />
          </a>
        </div>

        <nav aria-label="Hoofdnavigatie" className="justify-self-center">
          <ul className="flex list-none items-center gap-2">
            <li>
              <NavLink
                to="/rolstoelvervoer"
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
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `btn-accent rounded-full ${isActive ? "" : "opacity-95"}`
              }
            >
              Login
            </NavLink>
          ) : (
            <div className="relative" ref={notificationMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsAccountMenuOpen((prev) => !prev);
                  if (!isAccountMenuOpen) {
                    void loadNotifications();
                  }
                }}
                className="btn-outline rounded-full"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                aria-controls="account-menu"
              >
                Mijn account
              </button>

              {isAccountMenuOpen && (
                <div
                  id="account-menu"
                  role="menu"
                  aria-label="Account menu"
                  className="absolute right-0 z-[90] mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
                >
                  <NavLink
                    to={accountPath}
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      setIsNotificationsOpen(false);
                    }}
                    className="btn-outline w-full justify-start"
                  >
                    Mijn account
                  </NavLink>

                  {user?.role === "customer" && (
                    <NavLink
                      to="/customer/settings"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        setIsNotificationsOpen(false);
                      }}
                      className="btn-outline mt-2 w-full justify-start"
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
                    className="btn-outline mt-2 flex w-full items-center justify-between"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Meldingen
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      void handleLogout();
                    }}
                    className="btn-danger mt-2 w-full"
                  >
                    Logout
                  </button>

                  {isNotificationsOpen && (
                    <div
                      id="notification-menu"
                      role="menu"
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
                              role="menuitem"
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
    </header>
  );
}
