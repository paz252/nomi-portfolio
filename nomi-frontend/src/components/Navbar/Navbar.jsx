import { useEffect, useState } from "react";
import "./Navbar.css";
import MetallicText from "../utils/MetallicText";

export default function Navbar({ guestName }) {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setMenuOpen(false); // close mobile menu after selecting a section
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const sections = [...document.querySelectorAll("section[id]")];

    const handleScroll = () => {
      const navOffset = 90;

      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (scrolledToBottom) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }

      let current = sections[0].id;

      sections.forEach((section) => {
        if (window.scrollY + navOffset >= section.offsetTop) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const navLinks = ["home", "about", "skills", "projects", "contact"];

  return (
  <nav
    className="navbar sticky-top navbar-expand-lg py-3 ps-3 text-white fw-bold d-flex justify-content-between align-items-center"
    style={{
      background: "linear-gradient(135deg, #07070a 0%, #0f1116 100%)",
      height: "8vh",
    }}
  >
    <div className="navbar-brand mb-0 text-white">
      <MetallicText period={8}>Aman Saxena</MetallicText>
    </div>

    {/* Desktop pill nav */}
    <div className="nav-pill-group">
      {navLinks.map((id) => (
        <button
          key={id}
          className={`btn nav-pill-btn fw-bold ${
            activeSection === id ? "active" : "text-white"
          }`}
          onClick={() => scrollToSection(id)}
        >
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </button>
      ))}
    </div>

    {/* Burger button (mobile only) — direct child of nav for grid placement */}
    <button
      className={`burger-btn ${menuOpen ? "open" : ""}`}
      aria-label="Toggle navigation menu"
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen((prev) => !prev)}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div className="d-flex align-items-center gap-2 pe-3 guest-info">
      {guestName && (
        <>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#4ade80",
              boxShadow: "0 0 8px rgba(74, 222, 128, 0.8)",
              display: "inline-block",
            }}
          />
          <span className="small">Hi, {guestName}</span>
        </>
      )}
    </div>

    {/* Mobile dropdown menu */}
    <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
      {navLinks.map((id) => (
        <button
          key={id}
          className={`mobile-menu-link ${
            activeSection === id ? "active" : ""
          }`}
          onClick={() => scrollToSection(id)}
        >
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </button>
      ))}
    </div>
  </nav>
);
}