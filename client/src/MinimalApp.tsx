import { useState, useRef, useEffect } from 'react';
import { Instagram, ChevronDown, ChevronUp, Menu, X, ArrowRight, ShoppingCart, Calendar, MapPin, Star, Users, Book, Heart, ExternalLink, Check, Wand2 } from 'lucide-react';
import ClaudeDesignAssistant from './components/ClaudeDesignAssistant';

export default function MinimalApp() {
  const [language, setLanguage] = useState('fr');
  const [showDesignAssistant, setShowDesignAssistant] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const toggleDesignAssistant = () => {
    setShowDesignAssistant(!showDesignAssistant);
  };

  const toggleLangDropdown = () => {
    setIsLangDropdownOpen(!isLangDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Scroll handler for highlighting active nav item
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu handler - close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Window resize handler for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'about', label: 'À propos' },
    { id: 'book', label: 'Livre' },
    { id: 'contact', label: 'Contact' }
  ];

  const teamMembers = [
    {
      name: "Sophie Dupont",
      role: "Auteure Principale",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      description: "Experte en économie locale et amoureuse du Luxembourg depuis 15 ans. Sophie partage ses astuces pour profiter pleinement de la vie luxembourgeoise sans se ruiner."
    },
    {
      name: "Jean-Marc Weber",
      role: "Photographe & Contributeur",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      description: "Photographe luxembourgeois reconnu qui capture la beauté du pays sous tous ses angles. Il contribue avec ses connaissances des lieux cachés et économiques."
    },
    {
      name: "Maria Schmidt",
      role: "Experte Culinaire",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      description: "Spécialiste de la gastronomie locale, Maria déniche les meilleurs restaurants offrant un excellent rapport qualité-prix dans tout le Luxembourg."
    }
  ];

  const testimonials = [
    {
      text: "Ce guide a complètement changé ma façon de vivre au Luxembourg. J'économise maintenant plus de 300€ par mois grâce aux conseils pratiques!",
      author: "Pierre, résident depuis 5 ans",
      rating: 5
    },
    {
      text: "Indispensable pour tous les nouveaux arrivants. Luxembourg Pas Chère m'a aidé à découvrir des endroits abordables que je n'aurais jamais trouvés autrement.",
      author: "Maria, expatriée",
      rating: 5
    },
    {
      text: "Un vrai trésor d'informations pour vivre sans se ruiner dans l'un des pays les plus chers d'Europe. Hautement recommandé!",
      author: "Thomas, étudiant",
      rating: 4
    }
  ];
  
  return (
    <div style={{ 
      fontFamily: '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, sans-serif', 
      margin: 0, 
      padding: 0,
      color: '#333',
      scrollBehavior: 'smooth',
      scrollPaddingTop: '80px' // Compensate for sticky header
    }}>
      {/* Header */}
      <header ref={headerRef} style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.98)', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)', 
        padding: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div style={{ 
            position: 'relative',
            zIndex: 101
          }}>
            <a href="#home" style={{ textDecoration: 'none', display: 'block' }}>
              <span style={{ fontWeight: '800', color: '#E31837', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>Luxembourg</span>
              <span style={{ fontWeight: '800', color: '#00A4E0', fontSize: '1.5rem', marginLeft: '8px', letterSpacing: '-0.5px' }}>Pas Chère</span>
              <div style={{ 
                position: 'absolute', 
                top: '-5px', 
                right: '-12px', 
                background: '#E31837', 
                color: 'white', 
                padding: '0 4px', 
                borderRadius: '50%', 
                transform: 'rotate(12deg)', 
                fontSize: '12px', 
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                animation: 'pulse 2s infinite'
              }}>€</div>
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            style={{
              display: window.innerWidth <= 768 ? 'block' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#333',
              zIndex: 101
            }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Navigation - Desktop */}
          <nav style={{ 
            display: window.innerWidth <= 768 ? 'none' : 'block'
          }}>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '2rem', margin: 0, padding: 0, alignItems: 'center' }}>
              {navItems.map(item => (
                <li key={item.id}>
                  <a 
                    href={`#${item.id}`} 
                    style={{ 
                      textDecoration: 'none', 
                      color: activeSection === item.id ? '#E31837' : '#333',
                      fontWeight: activeSection === item.id ? '600' : '400',
                      fontSize: '0.95rem',
                      padding: '0.5rem 0',
                      position: 'relative',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '25px',
                        height: '2px',
                        background: '#E31837',
                        borderRadius: '2px'
                      }} />
                    )}
                  </a>
                </li>
              ))}
              <li>
                <a href="https://www.instagram.com/luxembourgpaschere/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <div style={{ 
                    width: "36px", 
                    height: "36px", 
                    background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease',
                  }}
                  className="instagram-icon"
                  >
                    <Instagram size={20} color="white" />
                  </div>
                </a>
              </li>
              <li>
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={toggleLangDropdown} 
                    style={{ 
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    {language.toUpperCase()}
                    {isLangDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isLangDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: '1px solid #eee',
                      minWidth: '120px',
                      zIndex: 1000,
                      marginTop: '0.5rem'
                    }}>
                      <button
                        onClick={() => handleLanguageChange('fr')}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem 1rem',
                          border: 'none',
                          background: language === 'fr' ? '#f0f0f0' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          borderRadius: '8px 8px 0 0'
                        }}
                      >
                        Français
                      </button>
                      <button
                        onClick={() => handleLanguageChange('en')}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem 1rem',
                          border: 'none',
                          background: language === 'en' ? '#f0f0f0' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          borderRadius: '0 0 8px 8px',
                          borderTop: '1px solid #eee'
                        }}
                      >
                        English
                      </button>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </nav>
          
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              zIndex: 100,
              padding: '5rem 2rem 2rem',
              overflowY: 'auto',
              animation: 'slideInRight 0.3s ease'
            }}>
              <nav>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  {navItems.map(item => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          textDecoration: 'none',
                          color: activeSection === item.id ? '#E31837' : '#333',
                          fontWeight: activeSection === item.id ? '600' : '500',
                          fontSize: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        {item.label}
                        <ArrowRight size={18} color={activeSection === item.id ? '#E31837' : '#999'} />
                      </a>
                    </li>
                  ))}
                  <li style={{ marginTop: '1rem' }}>
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
                        Langues
                      </h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleLanguageChange('fr')} 
                          style={{ 
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: language === 'fr' ? '#E31837' : '#f0f0f0',
                            color: language === 'fr' ? 'white' : '#333',
                            fontWeight: language === 'fr' ? '600' : '400',
                            cursor: 'pointer'
                          }}
                        >
                          FR
                        </button>
                        <button 
                          onClick={() => handleLanguageChange('de')} 
                          style={{ 
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: language === 'de' ? '#E31837' : '#f0f0f0',
                            color: language === 'de' ? 'white' : '#333',
                            fontWeight: language === 'de' ? '600' : '400',
                            cursor: 'pointer'
                          }}
                        >
                          DE
                        </button>
                        <button 
                          onClick={() => handleLanguageChange('en')} 
                          style={{ 
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: language === 'en' ? '#E31837' : '#f0f0f0',
                            color: language === 'en' ? 'white' : '#333',
                            fontWeight: language === 'en' ? '600' : '400',
                            cursor: 'pointer'
                          }}
                        >
                          EN
                        </button>
                      </div>
                    </div>
                  </li>
                  <li style={{ marginTop: '1rem' }}>
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#666', fontWeight: '500' }}>
                        Suivez-nous
                      </h3>
                      <a href="https://www.instagram.com/luxembourgpaschere/" target="_blank" rel="noopener noreferrer" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        textDecoration: 'none',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        <div style={{ 
                          width: "40px", 
                          height: "40px", 
                          background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Instagram size={24} color="white" />
                        </div>
                        Instagram
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      {/* Hero Section */}
      <section id="home" style={{ 
        position: 'relative', 
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image with Lazy Loading */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          zIndex: -2
        }}>
          <img 
            src="https://images.unsplash.com/photo-1580846961439-725c18a67d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
            alt="Vue panoramique de Luxembourg" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: 'brightness(0.9)'
            }}
            loading="lazy"
          />
        </div>
        
        {/* Enhanced Gradient Overlay */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          background: 'linear-gradient(135deg, rgba(227, 24, 55, 0.85) 0%, rgba(0, 164, 224, 0.75) 100%)',
          zIndex: -1
        }} />
        
        {/* Content with Animation */}
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
          width: '100%',
          zIndex: 1,
          opacity: 1,
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <div className="hero-grid">
            {/* Text Content */}
            <div className="hero-text-left">
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Calendar size={16} style={{ marginRight: '0.5rem' }} />
                {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </div>
              
              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
                fontWeight: '800', 
                marginBottom: '1.5rem',
                lineHeight: '1.1',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                Luxembourg<br />
                <span style={{ color: 'rgba(255,255,255,0.9)' }}>Pas Chère</span>
              </h1>
              
              <p className="hero-description">
                Les meilleurs conseils et offres pour une vie abordable au Luxembourg. 
                Découvrez comment profiter de ce magnifique pays sans vider votre portefeuille.
              </p>
              
              {/* CTA Buttons */}
              <div className="cta-buttons-container">
                <a
                  href="#book"
                  className="cta-button"
                  style={{
                    background: 'white',
                    color: '#E31837',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <ShoppingCart size={18} style={{ marginRight: '0.5rem' }} />
                  Commander le livre
                </a>
                <a
                  href="#about"
                  className="cta-button-primary cta-button-secondary"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    backdropFilter: 'blur(10px)',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  En savoir plus
                </a>
              </div>
            </div>
            
            {/* Book Display with Enhanced Animation */}
            <div className="hero-book-right">
              <div
                className="hero-book-container"
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                  width: 'min(100%, 320px)',
                  position: 'relative',
                  transform: 'rotate(2deg)',
                  transition: 'transform 0.5s ease, box-shadow 0.5s ease'
                }}
              >
                {/* Book Cover with Loading Animation */}
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
                  <img 
                    src="/assets/cover.png" 
                    alt="Luxembourg Pas Cher - Guide Pratique" 
                    style={{ 
                      width: '100%', 
                      display: 'block',
                      borderRadius: '8px',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden'
                    }} 
                    onError={(e) => {
                      console.error('Bildfehler:', e);
                      // Fallback zu einer Text-Repräsentation, wenn das Bild nicht geladen werden kann
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Verhindern einer Fehler-Schleife
                      target.style.background = 'linear-gradient(45deg, #E31837, #00A4E0)';
                      target.style.aspectRatio = '0.7/1';
                      target.style.display = 'flex';
                      target.style.alignItems = 'center';
                      target.style.justifyContent = 'center';
                      target.alt = 'LUXEMBOURG PAS CHÈRE';
                    }}
                  />
                </div>
                
                {/* Enhanced Price Badge */}
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  transform: 'translate(30%, -30%) rotate(15deg)',
                  background: 'white',
                  color: '#E31837',
                  padding: '1rem',
                  borderRadius: '50%',
                  fontWeight: '800',
                  fontSize: '1.25rem',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  border: '2px solid #E31837',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '65px',
                  height: '65px',
                  animation: 'pulse 2s infinite'
                }}>
                  24€99
                </div>
                
                {/* Book Details */}
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Star fill="#FFD700" color="#FFD700" size={16} />
                    <Star fill="#FFD700" color="#FFD700" size={16} />
                    <Star fill="#FFD700" color="#FFD700" size={16} />
                    <Star fill="#FFD700" color="#FFD700" size={16} />
                    <Star fill="#FFD700" color="#FFD700" size={16} />
                  </div>
                  <p style={{ 
                    margin: '0',
                    fontSize: '0.9rem',
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    212 pages • Français
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Banner */}
          <div className="features-grid">
            <div style={{ 
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                minWidth: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={20} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: '600' }}>
                  Secrets locaux
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9, lineHeight: '1.4' }}>
                  Des lieux connus uniquement des habitants
                </p>
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                minWidth: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={20} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: '600' }}>
                  Offres exclusives
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9, lineHeight: '1.4' }}>
                  Réductions négociées pour nos lecteurs
                </p>
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                minWidth: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={20} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: '600' }}>
                  Budget intelligent
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9, lineHeight: '1.4' }}>
                  Conseils pratiques d'économies quotidiennes
                </p>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div style={{ 
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite'
          }}>
            <a href="#about" className="scroll-indicator" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white',
              textDecoration: 'none',
              opacity: 0.7,
              transition: 'opacity 0.3s ease'
            }}>
              <span style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Découvrir</span>
              <ChevronDown size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* À propos Section */}
      <section id="about" ref={aboutSectionRef} style={{ 
        padding: '6rem 2rem',
        background: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'radial-gradient(circle at 70% 30%, #f0f8ff 0%, transparent 70%)',
          opacity: 0.7,
          zIndex: 0
        }} />
        
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ 
              display: 'inline-block', 
              color: '#00A4E0', 
              fontSize: '1rem', 
              fontWeight: '600',
              marginBottom: '1rem',
              position: 'relative'
            }}>
              NOTRE PROJET
              <span style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '3px',
                background: '#00A4E0',
                borderRadius: '4px'
              }} />
            </span>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: '#333',
              margin: '0 0 1.5rem',
              fontWeight: '800'
            }}>
              À propos de Luxembourg Pas Chère
            </h2>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Notre mission est de vous aider à profiter pleinement de la vie au Luxembourg sans vous ruiner.
              Découvrez comment ce projet est né et qui sont les personnes derrière cette initiative.
            </p>
          </div>
          
          {/* Main Content Grid */}
          <div className="about-grid">
            {/* Image Side */}
            <div className="about-image-left">
              <div className="about-image-3d">
                <img
                  src="https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Vue panoramique de Luxembourg"
                  style={{
                    width: '100%',
                    display: 'block'
                  }}
                  loading="lazy"
                />
              </div>
              
              {/* Floating Stats */}
              <div className="floating-stats">
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    background: '#f0f7ff',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Book size={24} color="#00A4E0" />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: '700', color: '#E31837' }}>
                      1500+
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
                      Exemplaires vendus
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="floating-badge">
                <Calendar size={16} />
                Depuis 2022
              </div>
            </div>
            
            {/* Text Content Side */}
            <div className="about-text-right">
              <h3 style={{ 
                fontSize: '1.5rem', 
                color: '#333',
                margin: '0 0 1.5rem',
                fontWeight: '700'
              }}>
                Pourquoi avons-nous créé ce guide ?
              </h3>
              
              <p style={{ 
                fontSize: '1.05rem',
                color: '#555',
                lineHeight: '1.8',
                marginBottom: '1.5rem'
              }}>
                Le Luxembourg est souvent cité comme l'un des pays les plus chers d'Europe. Pourtant, il regorge d'opportunités et de secrets pour y vivre confortablement sans dépenser une fortune. 
              </p>
              
              <p style={{ 
                fontSize: '1.05rem',
                color: '#555',
                lineHeight: '1.8',
                marginBottom: '2rem'
              }}>
                Après des années passées à explorer les moindres recoins du pays et à découvrir les astuces qui permettent de réduire considérablement son coût de vie, nous avons décidé de partager toutes ces connaissances dans un guide pratique et accessible à tous.
              </p>
              
              {/* Feature List */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ 
                    background: '#f0f7ff',
                    borderRadius: '50%',
                    minWidth: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '0.25rem'
                  }}>
                    <Check size={18} color="#00A4E0" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                      Des conseils pratiques vérifiés
                    </h4>
                    <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
                      Toutes nos recommandations ont été testées et validées par notre équipe d'experts locaux et d'expatriés.
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ 
                    background: '#f0f7ff',
                    borderRadius: '50%',
                    minWidth: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '0.25rem'
                  }}>
                    <Check size={18} color="#00A4E0" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                      Des économies significatives
                    </h4>
                    <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
                      Nos lecteurs économisent en moyenne 200€ à 350€ par mois en appliquant nos conseils et en profitant des offres négociées.
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    background: '#f0f7ff',
                    borderRadius: '50%',
                    minWidth: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '0.25rem'
                  }}>
                    <Check size={18} color="#00A4E0" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                      Mises à jour régulières
                    </h4>
                    <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
                      Notre site web et notre communauté Instagram vous permettent d'accéder aux dernières astuces et offres même après l'achat du livre.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
                    <a
                      href="#about"
                      className="cta-button-secondary-hover"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '50px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        backdropFilter: 'blur(10px)',
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                Explorer le guide
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
          
          {/* Team Section */}
          <div style={{ marginTop: '6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h3 style={{ 
                fontSize: '1.75rem',
                color: '#333',
                margin: '0 0 1rem',
                fontWeight: '700'
              }}>
                Notre équipe
              </h3>
              <p style={{ 
                fontSize: '1.05rem',
                color: '#666',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                Voici les experts passionnés qui partagent leurs connaissances pour vous aider à vivre mieux au Luxembourg.
              </p>
            </div>
            
            {/* Team Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member-card">
                  <div style={{ 
                    height: '200px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top'
                      }}
                      loading="lazy"
                    />
                  </div>
                  
                  <div style={{ padding: '1.5rem' }}>
                    <h4 style={{ 
                      margin: '0 0 0.25rem',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#333'
                    }}>
                      {member.name}
                    </h4>
                    <p style={{ 
                      margin: '0 0 1rem',
                      fontSize: '0.95rem',
                      color: '#00A4E0',
                      fontWeight: '600'
                    }}>
                      {member.role}
                    </p>
                    <p style={{ 
                      margin: '0',
                      fontSize: '0.95rem',
                      color: '#666',
                      lineHeight: '1.6'
                    }}>
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Testimonials Section */}
          <div style={{ marginTop: '6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h3 style={{ 
                fontSize: '1.75rem',
                color: '#333',
                margin: '0 0 1rem',
                fontWeight: '700'
              }}>
                Ce que disent nos lecteurs
              </h3>
              <p style={{ 
                fontSize: '1.05rem',
                color: '#666',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                Découvrez les témoignages de personnes qui ont utilisé notre guide pour améliorer leur vie au Luxembourg.
              </p>
            </div>
            
            {/* Testimonials Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="testimonials-card-hover"
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                    borderRadius: '12px',
                    padding: '2rem',
                    border: '1px solid #eee',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    position: 'relative',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {/* Quote Mark */}
                  <div style={{ 
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    fontSize: '3rem',
                    color: '#f0f0f0',
                    fontFamily: 'serif',
                    lineHeight: 1
                  }}>
                    "
                  </div>
                  
                  {/* Stars */}
                  <div style={{ 
                    display: 'flex',
                    gap: '0.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        fill={i < testimonial.rating ? "#FFD700" : "#e0e0e0"} 
                        color={i < testimonial.rating ? "#FFD700" : "#e0e0e0"} 
                      />
                    ))}
                  </div>
                  
                  {/* Quote Text */}
                  <p style={{ 
                    fontSize: '1rem',
                    color: '#444',
                    lineHeight: '1.7',
                    marginBottom: '1.5rem',
                    fontStyle: 'italic'
                  }}>
                    "{testimonial.text}"
                  </p>
                  
                  {/* Author */}
                  <p style={{ 
                    fontSize: '0.95rem',
                    color: '#666',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Book Order Section */}
      <section id="book" style={{ 
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(227, 24, 55, 0.1) 0%, rgba(227, 24, 55, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 164, 224, 0.1) 0%, rgba(0, 164, 224, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ 
              display: 'inline-block', 
              color: '#E31837', 
              fontSize: '1rem', 
              fontWeight: '600',
              marginBottom: '1rem',
              position: 'relative'
            }}>
              COMMANDER MAINTENANT
              <span style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '3px',
                background: '#E31837',
                borderRadius: '4px'
              }} />
            </span>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: '#333',
              margin: '0 0 1.5rem',
              fontWeight: '800'
            }}>
              Obtenez votre guide Luxembourg Pas Chère
            </h2>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Commandez dès maintenant et commencez à économiser au Luxembourg. Livraison rapide et satisfaction garantie.
            </p>
          </div>
          
          {/* Order Content */}
          <div className="book-features-grid">
            {/* Book Features */}
            <div className="book-features-left">
              <h3 style={{ 
                fontSize: '1.5rem', 
                color: '#333',
                margin: '0 0 1.5rem',
                fontWeight: '700'
              }}>
                Ce que vous trouverez dans ce guide
              </h3>
              
              {/* Features List */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ 
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    minWidth: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MapPin size={20} color="#E31837" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: '600' }}>
                      212 lieux et services abordables
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                      Restaurants, activités culturelles, magasins et plus
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ 
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    minWidth: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Heart size={20} color="#E31837" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: '600' }}>
                      45 offres exclusives et codes promo
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                      Négociées directement avec nos partenaires locaux
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ 
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    minWidth: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Calendar size={20} color="#E31837" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: '600' }}>
                      Calendrier des événements gratuits
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                      Pour profiter du Luxembourg toute l'année sans dépenser
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ 
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    minWidth: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Book size={20} color="#E31837" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: '600' }}>
                      Guide pratique format poche
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                      Facile à emporter partout avec vous lors de vos sorties
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 0'
                }}>
                  <div style={{ 
                    background: '#f0f0f0',
                    borderRadius: '8px',
                    minWidth: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={20} color="#E31837" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: '600' }}>
                      Communauté d'entraide
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                      Accès au groupe Facebook privé des lecteurs pour échanger
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Price Box */}
              <div style={{ 
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid #eee',
                marginTop: '2rem'
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                    Prix du guide
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: '800', 
                      color: '#E31837'
                    }}>
                      24,99€
                    </span>
                    <span style={{ 
                      fontSize: '0.9rem', 
                      color: '#666',
                      marginLeft: '0.5rem',
                      textDecoration: 'line-through'
                    }}>
                      29,99€
                    </span>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderTop: '1px solid #eee',
                  borderBottom: '1px solid #eee',
                  margin: '1rem 0'
                }}>
                  <Check size={18} color="#00A4E0" />
                  <span style={{ fontSize: '0.95rem', color: '#555' }}>
                    Livraison rapide (2-3 jours ouvrables)
                  </span>
                </div>
                
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="book-order-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    background: '#E31837',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    boxShadow: '0 6px 15px rgba(227, 24, 55, 0.3)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <ShoppingCart size={20} />
                  Commander maintenant
                </a>
                
                <p style={{ 
                  margin: '1rem 0 0',
                  fontSize: '0.85rem',
                  color: '#999',
                  textAlign: 'center'
                }}>
                  Paiement sécurisé • Satisfait ou remboursé
                </p>
              </div>
            </div>
            
            {/* Book Display */}
            <div className="book-display-right">
              <div style={{ 
                position: 'relative',
                perspective: '1000px'
              }}>
                {/* 3D Book */}
                <div
                  className="book-display-hover"
                  style={{
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transform: 'rotateY(-30deg) rotateX(5deg)',
                    transition: 'transform 0.6s ease'
                  }}
                >
                  {/* Front Cover */}
                  <div style={{ 
                    position: 'relative',
                    backgroundImage: 'url(/assets/cover.png)',
                    backgroundSize: 'cover',
                    width: '300px',
                    height: '420px',
                    borderRadius: '4px 10px 10px 4px',
                    boxShadow: '0 25px 35px rgba(0,0,0,0.25)',
                    backfaceVisibility: 'hidden'
                  }} />
                  
                  {/* Book Spine */}
                  <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '40px',
                    height: '420px',
                    background: '#E31837',
                    transformOrigin: 'left',
                    transform: 'rotateY(-90deg) translateX(-40px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <span style={{ 
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      whiteSpace: 'nowrap',
                      transform: 'rotate(-90deg)',
                      textTransform: 'uppercase',
                      letterSpacing: '2px'
                    }}>
                      LUXEMBOURG PAS CHÈRE
                    </span>
                  </div>
                  
                  {/* Book Pages */}
                  <div style={{ 
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '290px',
                    height: '410px',
                    background: 'white',
                    transformOrigin: 'left',
                    transform: 'translateZ(-1px) translateX(5px) translateY(5px)',
                    borderRadius: '0 5px 5px 0',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                  }} />
                </div>
                
                {/* Floating Labels */}
                <div style={{ 
                  position: 'absolute',
                  top: '-30px',
                  right: '-20px',
                  background: '#00A4E0',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 5px 15px rgba(0, 164, 224, 0.3)',
                  transform: 'rotate(5deg)',
                  zIndex: 2
                }}>
                  Edition 2023
                </div>
                
                <div style={{ 
                  position: 'absolute',
                  bottom: '-15px',
                  left: '20px',
                  background: '#E31837',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 5px 15px rgba(227, 24, 55, 0.3)',
                  transform: 'rotate(-5deg)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Star fill="white" size={16} />
                  Bestseller local
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Tools Section */}
      <section id="design-tools" style={{
        padding: '5rem 2rem',
        background: '#f8f9fa'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              display: 'inline-block',
              color: '#00A4E0',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '1rem',
              position: 'relative'
            }}>
              AI ASSISTANT DESIGN
              <span style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '3px',
                background: '#00A4E0',
                borderRadius: '4px'
              }} />
            </span>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: '#333',
              margin: '0 0 1.5rem',
              fontWeight: '800'
            }}>
              Design-Optimierung mit Claude
            </h2>
            <p style={{
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto',
              fontSize: '1.05rem',
              lineHeight: '1.6'
            }}>
              Nutzen Sie die Kraft der Claude 3.7 KI, um professionelle Designvorschläge für unsere Website zu generieren.
              Helfen Sie uns, die visuelle Gestaltung und Benutzerführung zu optimieren.
            </p>
            <button
              onClick={toggleDesignAssistant}
              style={{
                background: '#00A4E0',
                color: 'white',
                border: 'none',
                padding: '0.875rem 2rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '1.5rem',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 5px 15px rgba(0, 164, 224, 0.2)'
              }}
              className="cta-button-hover"
            >
              <Wand2 size={18} />
              {showDesignAssistant ? 'Design-Assistent ausblenden' : 'Design-Assistent anzeigen'}
            </button>
          </div>

          {showDesignAssistant && (
            <div style={{
              marginTop: '2rem',
              animation: 'fadeIn 0.5s ease'
            }}>
              <ClaudeDesignAssistant
                initialDescription="Erstellen Sie ein modernes Design-System für die 'Luxembourg Pas Chère' Website, die Benutzern hilft, bezahlbare Angebote in Luxemburg zu finden. Die Website soll luxemburgische Farben (rot und blau) verwenden, professionell aussehen und ein Buchcover hervorheben."
              />
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ 
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #E31837 0%, #00A4E0 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 10%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 10%)',
          backgroundSize: '50px 50px',
          zIndex: 0,
          opacity: 0.5
        }} />
        
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              margin: '0 0 1.5rem',
              fontWeight: '800'
            }}>
              Contactez-nous
            </h2>
            <p style={{ 
              fontSize: '1.125rem',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              Des questions ? Besoin d'informations supplémentaires ? N'hésitez pas à nous contacter.
            </p>
          </div>
          
          {/* Contact Grid */}
          <div className="contact-grid">
            {/* Contact Info */}
            <div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                margin: '0 0 1.5rem',
                fontWeight: '700'
              }}>
                Restons en contact
              </h3>
              
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '50%',
                    minWidth: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '0.25rem'
                  }}>
                    <ExternalLink size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                      Suivez-nous sur les réseaux sociaux
                    </h4>
                    <p style={{ margin: '0 0 0.75rem', lineHeight: '1.6', opacity: 0.9 }}>
                      Rejoignez notre communauté pour recevoir régulièrement des astuces gratuites et des offres exclusives.
                    </p>
                    <a
                      href="https://www.instagram.com/luxembourgpaschere/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-bg"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontWeight: '500',
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      <Instagram size={18} />
                      @luxembourgpaschere
                    </a>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '50%',
                    minWidth: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '0.25rem'
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                      Nous trouver
                    </h4>
                    <p style={{ margin: 0, lineHeight: '1.6', opacity: 0.9 }}>
                      Notre guide est disponible dans les principales librairies du Luxembourg ainsi que sur notre site web.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Newsletter */}
              <div style={{ 
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem', 
                  fontSize: '1.25rem', 
                  fontWeight: '600' 
                }}>
                  Inscrivez-vous à la newsletter
                </h4>
                <p style={{ 
                  margin: '0 0 1.5rem',
                  fontSize: '0.95rem',
                  opacity: 0.9
                }}>
                  Recevez nos conseils d'économies et nos offres directement dans votre boîte mail.
                </p>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="form-input-base"
                  />
                  <button 
                    style={{ 
                      position: 'absolute',
                      right: '4px',
                      top: '4px',
                      bottom: '4px',
                      background: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0 1rem',
                      fontWeight: '600',
                      color: '#E31837',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(5px)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                margin: '0 0 1.5rem',
                fontWeight: '700'
              }}>
                Envoyez-nous un message
              </h3>
              
              {/* Form */}
              <form action="#" method="POST">
                <div style={{ marginBottom: '1rem' }}>
                  <label 
                    htmlFor="name" 
                    style={{ 
                      display: 'block', 
                      fontSize: '0.95rem', 
                      marginBottom: '0.5rem',
                      fontWeight: '500'
                    }}
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Votre nom complet"
                    className="form-input-base"
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label 
                    htmlFor="email" 
                    style={{ 
                      display: 'block', 
                      fontSize: '0.95rem', 
                      marginBottom: '0.5rem',
                      fontWeight: '500'
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Votre adresse email"
                    className="form-input-base"
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label 
                    htmlFor="message" 
                    style={{ 
                      display: 'block', 
                      fontSize: '0.95rem', 
                      marginBottom: '0.5rem',
                      fontWeight: '500'
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Votre message..."
                    className="form-input-base"
                  />
                </div>
                
                <button
                  type="submit"
                  className="form-button-hover"
                  style={{
                    width: '100%',
                    background: 'white',
                    color: '#E31837',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: '#1a1a1a',
        color: 'white',
        padding: '4rem 2rem 2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Logo + Intro */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: '800', color: '#E31837', fontSize: '1.75rem', letterSpacing: '-0.5px' }}>Luxembourg</span>
                <span style={{ fontWeight: '800', color: '#00A4E0', fontSize: '1.75rem', marginLeft: '8px', letterSpacing: '-0.5px' }}>Pas Chère</span>
              </div>
              <p style={{ 
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: '#aaa',
                marginBottom: '1.5rem'
              }}>
                Le guide indispensable pour vivre au Luxembourg sans se ruiner. Découvrez tous nos conseils pour profiter du Luxembourg à petit prix.
              </p>
              <div style={{ 
                display: 'flex',
                gap: '1rem'
              }}>
                <a 
                  href="https://www.instagram.com/luxembourgpaschere/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <Instagram size={18} color="white" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 style={{ 
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                fontWeight: '600'
              }}>
                Liens rapides
              </h3>
              <ul style={{ 
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {navItems.map(item => (
                  <li key={item.id} style={{ marginBottom: '0.75rem' }}>
                    <a 
                      href={`#${item.id}`} 
                        style={{
                          color: '#aaa',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          transition: 'color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                    >
                      <ArrowRight size={14} />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 style={{
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                fontWeight: '600'
              }}>
                Contact
              </h3>
              <p style={{
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: '#aaa',
                marginBottom: '1rem'
              }}>
                Pour toute question ou suggestion, n'hésitez pas à nous contacter.
              </p>
              <a
                href="mailto:info@luxembourgpaschere.lu"
                style={{
                  color: '#00A4E0',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s ease'
                }}
              >
                info@luxembourgpaschere.lu
              </a>
            </div>
            
            {/* Newsletter */}
            <div>
              <h3 style={{ 
                fontSize: '1.1rem',
                marginBottom: '1.5rem',
                fontWeight: '600'
              }}>
                Newsletter
              </h3>
              <p style={{ 
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: '#aaa',
                marginBottom: '1rem'
              }}>
                Inscrivez-vous pour recevoir nos actualités et offres spéciales.
              </p>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Votre email"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    paddingRight: '3.5rem',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    background: '#222',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
                <button
                  style={{
                    position: 'absolute',
                    right: '4px',
                    top: '4px',
                    bottom: '4px',
                    background: '#E31837',
                    border: 'none',
                    borderRadius: '6px',
                    width: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <ArrowRight size={16} color="white" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div style={{ 
            borderTop: '1px solid #333',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            color: '#777',
            fontSize: '0.9rem'
          }}>
            <div>
              © {new Date().getFullYear()} Luxembourg Pas Chère. Tous droits réservés.
            </div>
            <div style={{ 
              display: 'flex',
              gap: '1.5rem'
            }}>
              <a href="#" style={{ color: '#777', textDecoration: 'none' }}>
                Mentions légales
              </a>
              <a href="#" style={{ color: '#777', textDecoration: 'none' }}>
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* CSS styles moved to separate file */}
      <style dangerouslySetInnerHTML={{ __html: `
        .instagram-icon:hover {
          transform: scale(1.1);
        }

        .language-button:hover {
          background-color: #f5f5f5;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }
      `}} />
    </div>
  );
}
