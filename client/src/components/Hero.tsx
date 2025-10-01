import BookCover from "./BookCover";
import { ShoppingCart } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="position-relative text-white overflow-hidden glass-morphism">
      {/* Modern Dynamic Background */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 pulse-modern"
        style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
          zIndex: 0
        }}
      />
      
      {/* Neu strukturierter Inhaltsbereich */}
      <div className="position-relative" style={{ zIndex: 2 }}>
        {/* Hauptcontainer mit fester Höhe und strukturiertem Layout */}
        <div className="container py-5" style={{ minHeight: "95vh" }}>
          {/* Dreispaltiges Layout für bessere Textplatzierung */}
          <div className="row" style={{ minHeight: "95vh" }}>
            <div className="col-12 d-flex flex-column justify-content-center align-items-center">
              
              {/* Textbereich mit klarer Sichtbarkeit */}
              <div className="text-center mb-4 mt-5">
                <div style={{ maxWidth: "90%", margin: "0 auto" }}>
                  <p style={{ 
                    fontSize: "1rem", 
                    lineHeight: "1.5",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                    width: "100%",
                    display: "block"
                  }}>
                    Les meilleurs conseils et offres pour une vie abordable au Luxembourg.
                  </p>
                  <p style={{ 
                    fontSize: "1rem", 
                    lineHeight: "1.5",
                    textAlign: "center",
                    width: "100%",
                    display: "block"
                  }}>
                    Découvrez comment profiter de ce magnifique pays sans vider votre portefeuille.
                  </p>
                </div>
              </div>

              {/* Buchcover in fester Größe und Position */}
              <div className="text-center mb-4">
                <div 
                  className="mx-auto" 
                  style={{ 
                    width: "250px", 
                    background: "white", 
                    borderRadius: "8px",
                    padding: "8px",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
                  }}
                >
                  <BookCover />
                </div>
              </div>
              
              {/* CTA Button mit verbesserter Accessibility und Touch-Optimierung */}
              <div className="text-center mb-5">
                <button
                  className="hero-cta-button"
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    background: "#00A4E0",
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    padding: "16px 32px",
                    minWidth: "200px",
                    minHeight: "48px",
                    letterSpacing: "1px",
                    boxShadow: "0 6px 20px rgba(0,164,224,0.4)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = "translateY(-2px)";
                    target.style.boxShadow = "0 10px 25px rgba(0,164,224,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = "translateY(0)";
                    target.style.boxShadow = "0 6px 20px rgba(0,164,224,0.4)";
                  }}
                  aria-label="Commander le livre Luxembourg Pas Chère maintenant"
                  role="button"
                  tabIndex={0}
                >
                  <ShoppingCart size={20} aria-hidden="true" />
                  COMMANDER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
