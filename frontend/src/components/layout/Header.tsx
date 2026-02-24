import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 no-underline">
          <img
            src="/image/logo.png"
            alt="Social Drive"
            className="h-10 w-auto"
          />
          <span className="font-bold">
            <span className="text-[#0043A8]">Social </span>
            <span className="text-[#FDB812]">Drive</span>
          </span>
        </a>

        {/* Nav */}
        <nav aria-label="Hoofdnavigatie">
          <ul className="flex list-none gap-6">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm transition-all hover:underline hover:underline-offset-4 ${
                    isActive
                      ? "font-semibold text-[#0043A8]"
                      : "font-medium text-gray-700"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
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
                to="/luchthaven"
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
