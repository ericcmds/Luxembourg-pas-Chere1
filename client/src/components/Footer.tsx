import React from 'react';
import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-morphism text-primary pt-16 pb-8 pulse-modern">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4 hover:opacity-80 transition-opacity">
              <div className="position-relative">
                <span className="font-montserrat fw-bold fs-4 text-lux-red">Luxembourg</span>
                <span className="font-montserrat fw-bold fs-4 text-lux-blue ms-2">Pas Cher</span>
              </div>
            </Link>
            <p className="text-light-gray mb-4">
              Votre guide pour une vie abordable au Luxembourg sans pression financière.
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-3 mb-6">
              <a href="https://www.instagram.com/luxembourgpaschere/" target="_blank" rel="noopener noreferrer" 
                className="instagram-gradient w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
                aria-label="Suivez-nous sur Instagram">
                <Instagram size={18} color="white" />
              </a>
              <a href="https://www.facebook.com/luxembourgpascher" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: "#1877F2" }}
                aria-label="Suivez-nous sur Facebook">
                <Facebook size={18} color="white" />
              </a>
              <a href="https://www.linkedin.com/company/luxembourg-pas-cher" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: "#0A66C2" }}
                aria-label="Suivez-nous sur LinkedIn">
                <Linkedin size={18} color="white" />
              </a>
            </div>
          </div>

          {/* Main Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-light-gray hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#about" className="text-light-gray hover:text-white transition-colors">À propos</a></li>
              <li><a href="#book" className="text-light-gray hover:text-white transition-colors">Livre</a></li>
              <li><a href="#contact" className="text-light-gray hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-light-gray hover:text-white transition-colors">Restaurants</a></li>
              <li><a href="#" className="text-light-gray hover:text-white transition-colors">Shopping</a></li>
              <li><a href="#" className="text-light-gray hover:text-white transition-colors">Activités</a></li>
              <li><a href="#" className="text-light-gray hover:text-white transition-colors">Logement</a></li>
              <li><a href="#" className="text-light-gray hover:text-white transition-colors">Transport</a></li>
              <li><a href="#" className="text-light-gray hover:text-white transition-colors">Culture & Loisirs</a></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-lux-red" />
                <span className="text-light-gray">Luxembourg City, 2121<br />Avenue de la Liberté</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-lux-red" />
                <a href="tel:+352123456789" className="text-light-gray hover:text-white transition-colors">+352 12 345 6789</a>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-lux-red" />
                <a href="mailto:info@lux-pas-cher.com" className="text-light-gray hover:text-white transition-colors">info@lux-pas-cher.com</a>
              </li>
              <li className="flex items-center">
                <Clock size={16} className="mr-2 text-lux-red" />
                <span className="text-light-gray">Lun-Ven: 9h-17h</span>
              </li>
            </ul>
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-lg mb-2">Mentions légales</h3>
              <a href="#" className="block text-light-gray hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="#" className="block text-light-gray hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="block text-light-gray hover:text-white transition-colors">Conditions générales</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-light-gray text-sm mb-4 md:mb-0">
              © {currentYear} Luxembourg Pas Cher. Tous droits réservés.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-light-gray hover:text-white text-sm transition-colors">FAQ</a>
              <a href="#" className="text-light-gray hover:text-white text-sm transition-colors">Support</a>
              <a href="#" className="text-light-gray hover:text-white text-sm transition-colors">Presse</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <a href="#top" className="back-to-top fixed bottom-8 right-8 bg-lux-red hover:bg-red-700 transition-colors text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </a>
    </footer>
  );
}
