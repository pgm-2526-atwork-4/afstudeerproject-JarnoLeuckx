import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-[#D7E3F7] bg-[linear-gradient(90deg,#FFFFFF_0%,#F2F7FF_50%,#FFFFFF_100%)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between pl-0 pr-4 py-4">
        <a href="/" className="flex items-center gap-5 no-underline">
          <img
            src="/image/logo.png"
            alt="Social Drive"
            className="h-32 max-h-32 w-auto object-contain"
          />
        </a>

        <nav aria-label="Hoofdnavigatie" className="flex-2 flex justify-evenly">
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
