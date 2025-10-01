import { useState, useEffect } from "react";
import MobileMenu from './ui/MobileMenu';
import SearchBar from './SearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Facebook, Linkedin } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  // Add scroll event listener to detect when to add shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky-top ${isScrolled ? 'shadow' : ''}`} 
      style={{ 
        transition: 'all 0.3s ease', 
        background: 'white', 
        zIndex: 1030 
      }}
    >
      <div className="container px-3">
        <nav className="navbar navbar-expand-lg navbar-light py-2 py-lg-3" aria-label="Site Navigation">
          <div className="row w-100 align-items-center">
            <div className="col-auto">
              {/* Logo - optimiert für alle Geräte */}
              <a 
                className="navbar-brand d-flex align-items-center" 
                href="#home" 
                aria-label="Luxembourg Pas Chère Homepage"
                style={{ marginRight: 0 }}
              >
                <div className="d-flex align-items-center">
                  <span className="font-montserrat fw-bold text-lux-red me-2" 
                        style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)" }}>
                    Luxembourg
                  </span>
                  <span className="font-montserrat fw-bold text-lux-dark"
                        style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)" }}>
                    Pas Cher
                  </span>
                </div>
              </a>
            </div>

            {/* Removed author info as requested */}

            {/* Hamburger Button für Mobile Geräte */}
            <div className="col-auto d-lg-none">
              <button 
                className="navbar-toggler border-0" 
                type="button" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                aria-controls="navbarContent" 
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>

            {/* Navigation Links - responsive gestaltet */}
            <div className="col-auto d-none d-lg-block">
              <div className="d-flex align-items-center">
                <ul className="navbar-nav align-items-center mb-0">
                  <li className="nav-item">
                    <a 
                      className="nav-link font-montserrat fw-medium px-3" 
                      href="#home"
                    >
                      Accueil
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link font-montserrat fw-medium px-3" 
                      href="#about"
                    >
                      À propos
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link font-montserrat fw-medium px-3" 
                      href="#book"
                    >
                      Livre
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link font-montserrat fw-medium px-3"
                      href="#contact"
                    >
                      Contact
                    </a>
                  </li>

                  {/* Search functionality */}
                  <li className="nav-item">
                    <div className="nav-link px-3">
                      <SearchBar />
                    </div>
                  </li>

                  {/* Social Media Icons */}
                  <li className="nav-item">
                    <a 
                      className="nav-link px-2" 
                      href="https://www.instagram.com/luxembourgpaschere/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label="Instagram"
                    >
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          width: "36px", 
                          height: "36px", 
                          background: "#E1306C",
                        }}
                      >
                        <Instagram size={18} color="white" />
                      </div>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link px-2" 
                      href="https://www.facebook.com/luxembourgpascher" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label="Facebook"
                    >
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          width: "36px", 
                          height: "36px", 
                          background: "#1877F2",
                        }}
                      >
                        <Facebook size={18} color="white" />
                      </div>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a 
                      className="nav-link px-2" 
                      href="https://www.linkedin.com/company/luxembourg-pas-cher" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label="LinkedIn"
                    >
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          width: "36px", 
                          height: "36px", 
                          background: "#0A66C2",
                        }}
                      >
                        <Linkedin size={18} color="white" />
                      </div>
                    </a>
                  </li>
                  
                  {/* Sprachauswahl */}
                  <li className="nav-item dropdown">
                    <a 
                      className="nav-link dropdown-toggle font-montserrat fw-medium px-3 d-flex align-items-center" 
                      href="#" 
                      id="languageDropdown" 
                      role="button" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                    >
                      <span className="me-1">FR</span>
                    </a>
                    <ul 
                      className="dropdown-menu dropdown-menu-end" 
                      aria-labelledby="languageDropdown"
                    >
                      <li>
                        <button 
                          className={`dropdown-item ${language === 'fr' ? 'active' : ''}`} 
                          onClick={() => setLanguage('fr')}
                        >
                          Français
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`dropdown-item ${language === 'de' ? 'active' : ''}`} 
                          onClick={() => setLanguage('de')}
                        >
                          Deutsch
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`dropdown-item ${language === 'en' ? 'active' : ''}`} 
                          onClick={() => setLanguage('en')}
                        >
                          English
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menü mit allen Optionen */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
