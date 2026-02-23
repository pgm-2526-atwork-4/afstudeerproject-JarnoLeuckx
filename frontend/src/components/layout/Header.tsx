import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header
      style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}
    >
      <div
        style={{
          maxWidth: "72rem",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          <img
            src="./public/image/logo.png"
            alt="Social Drive"
            style={{ height: "2.5rem", width: "auto" }}
          />
          <span style={{ fontWeight: "bold" }}>
            <span className="text-primary-blue">Social </span>
            <span className="text-accent-yellow">Drive</span>
          </span>
        </a>

        {/* Nav */}
        <nav aria-label="Hoofdnavigatie">
          <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none" }}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "inactive"}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/rolstoelvervoer"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "inactive"}`
                }
              >
                Rolstoelvervoer
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/luchthaven"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "inactive"}`
                }
              >
                Luchthaven
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/assistentie"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "inactive"}`
                }
              >
                Assistentie
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "inactive"}`
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
