import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Challenges", path: "/challenges" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Brand */}
        <button
          className="navbar-brand"
          onClick={() => navigate("/")}
          aria-label="Go to GovPilot-X home"
        >
          <span className="brand-mark">✦</span>

          <span className="brand-name">
            GovPilot<span>-X</span>
          </span>
        </button>

        {/* Navigation */}
        <nav className="navbar-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <button
            className="nav-btn nav-btn-department"
            onClick={() => navigate("/login?role=department")}
          >
            Department
          </button>

          <button
            className="nav-btn nav-btn-startup"
            onClick={() => navigate("/login?role=startup")}
          >
            Startup
          </button>
        </div>

      </div>
    </header>
  );
}