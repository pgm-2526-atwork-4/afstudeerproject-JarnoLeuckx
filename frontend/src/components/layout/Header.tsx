import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getCurrentUser, onAuthChanged, type User } from "../../auth/auth.api";
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

  const accountPath =
    user?.role === "driver"
      ? "/driver/account"
      : user?.role === "customer"
        ? "/customer/account"
        : "/auth";

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
    <header className="border-b border-[#D7E3F7] bg-[linear-gradient(90deg,#FFFFFF_0%,#F2F7FF_50%,#FFFFFF_100%)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between pl-0 pr-4 py-4">
        <a href="/" className="flex items-center gap-5 no-underline">
          <img
            src="/image/logo.png"
            alt="Social Drive"
            className="h-20 w-auto shrink-0 object-contain"
          />
        </a>

        <nav aria-label="Hoofdnavigatie" className="flex-2 flex justify-evenly">
          <ul className="flex list-none gap-6">
            <li>
              <NavLink
                to="/rolstoelvervoer"
                className={({ isActive }) =>
                  `text-sm transition-all hover:underline hover:underline-offset-4 ${
                    isActive
                      ? "font-semibold text-[#0043A8]"
                      : "font-medium text-gray-700"
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
                  `text-sm transition-all hover:underline hover:underline-offset-4 ${
                    isActive
                      ? "font-semibold text-[#0043A8]"
                      : "font-medium text-gray-700"
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
                  `text-sm transition-all hover:underline hover:underline-offset-4 ${
                    isActive
                      ? "font-semibold text-[#0043A8]"
                      : "font-medium text-gray-700"
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
                  `text-sm transition-all hover:underline hover:underline-offset-4 ${
                    isActive
                      ? "font-semibold text-[#0043A8]"
                      : "font-medium text-gray-700"
                  }`
                }
              >
                Contact
              </NavLink>
            </li>
            <li>
              {!user ? (
                <NavLink
                  to="/auth"
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm transition-all border border-[#0043A8] ${
                      isActive
                        ? "font-semibold bg-[#0043A8] text-white"
                        : "font-semibold text-[#0043A8] hover:bg-[#EAF3FF]"
                    }`
                  }
                >
                  Login
                </NavLink>
              ) : (
                <NavLink
                  to={accountPath}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm transition-all border border-[#0043A8] ${
                      isActive
                        ? "font-semibold bg-[#0043A8] text-white"
                        : "font-semibold text-[#0043A8] hover:bg-[#EAF3FF]"
                    }`
                  }
                >
                  Mijn account
                </NavLink>
              )}
            </li>

            {user && (
              <li className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationsOpen((prev) => !prev);
                    if (!isNotificationsOpen) {
                      void loadNotifications();
                    }
                  }}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#0043A8] text-[#0043A8] transition hover:bg-[#EAF3FF]"
                  aria-label="Meldingen"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                    <div className="mb-2 text-sm font-bold text-slate-900">
                      Meldingen
                    </div>

                    {notificationsLoading ? (
                      <p className="text-sm text-slate-500">Laden...</p>
                    ) : notifications.length === 0 ? (
                      <p className="text-sm text-slate-500">Geen meldingen.</p>
                    ) : (
                      <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
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
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
