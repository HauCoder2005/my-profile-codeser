import { useState } from "react";
import { Menu, X } from "lucide-react";
import "./Header.css";

function Header() {
  const leftItems = [
    { label: "ABOUT", href: "#about" },
    { label: "SKILL", href: "#skill" },
  ];

  const rightItems = [
    { label: "PROJECTS", href: "#projects" },
    { label: "CONTACT", href: "#contact" },
  ];
  const navItems = [...leftItems, ...rightItems];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <span className="header-mobile-spacer" aria-hidden="true" />

        <nav className="header-nav header-nav-left">
          {leftItems.map((item) => (
            <a href={item.href} className="nav-item" key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#top" className="header-logo" aria-label="Huynh Hau home">
          codeser
        </a>

        <nav className="header-nav header-nav-right">
          {rightItems.map((item) => (
            <a href={item.href} className="nav-item" key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="header-menu-button"
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
        </button>
      </div>

      <nav className={`header-mobile-menu ${isMenuOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
        {navItems.map((item) => (
          <a href={item.href} className="header-mobile-link" key={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default Header;
