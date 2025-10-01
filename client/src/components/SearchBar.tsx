import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchTips = [
    "logement abordable Luxembourg",
    "économies alimentation",
    "transport bon marché",
    "loisirs gratuits Luxembourg"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const searchQuery = encodeURIComponent(searchTerm.trim());
      // Build search URL with proper parameters
      const searchUrl = `https://www.google.com/search?q=site:luxembourgpaschere.com+${searchQuery}`;
      window.open(searchUrl, '_blank');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="search-toggle-btn flex items-center justify-center w-9 h-9 border-2 border-red-500 rounded-full bg-white text-red-500 cursor-pointer transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-110 hover:shadow-lg"
        aria-label="Ouvrir la recherche"
        aria-expanded={isOpen}
      >
        <Search size={20} />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <>
          <div
            className="search-overlay fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-[1000] animate-fadeIn"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="search-modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-xl shadow-2xl z-[1002] animate-slideIn max-h-[90vh] overflow-y-auto">
            <div className="search-header flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="search-title" className="search-title text-xl font-bold text-gray-800 m-0">
                Rechercher sur le site
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="search-close-btn bg-none border-none text-gray-400 cursor-pointer p-1 rounded-full transition-all hover:bg-gray-100 hover:text-gray-800"
                aria-label="Fermer la recherche"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="search-form px-6 pb-6">
              <div className="search-input-container relative flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Rechercher des astuces d'économie..."
                  className="search-input flex-1 px-4 py-4 pr-12 border-2 border-gray-300 rounded-lg text-base outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  aria-label="Terme de recherche"
                  autoFocus
                />
                <button
                  type="submit"
                  className="search-submit-btn absolute right-1 bg-red-500 text-white border-none w-12 h-12 rounded-lg cursor-pointer transition-all hover:bg-red-600 hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center"
                  aria-label="Lancer la recherche"
                  disabled={!searchTerm.trim()}
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            <div className="search-suggestions px-6 pb-6 border-t border-gray-200">
              <h3 className="suggestions-title text-sm font-semibold text-gray-500 m-0 mb-3">
                Recherches populaires :
              </h3>
              <div className="suggestions-list flex flex-wrap gap-2">
                {searchTips.map((tip, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(tip);
                    }}
                    className="suggestion-btn bg-gray-100 text-gray-700 border border-gray-300 px-3 py-2 rounded-full text-sm cursor-pointer transition-all hover:bg-red-500 hover:text-white hover:border-red-500 hover:transform hover:-translate-y-0.5"
                    type="button"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>

            <div className="search-info px-6 pb-6">
              <p className="text-sm text-gray-500 m-0 text-center bg-gray-50 p-3 rounded-lg">
                💡 La recherche ouvre Google avec notre site comme filtre automatique
              </p>
            </div>
          </div>
        </>
      )}

      {/* Custom animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @media (max-width: 768px) {
          .search-modal { width: 95%; margin: 20px; }
          .suggestions-list { flex-direction: column; }
          .suggestion-btn { width: 100%; text-align: left; }
        }
      `}</style>
    </>
  );
}
