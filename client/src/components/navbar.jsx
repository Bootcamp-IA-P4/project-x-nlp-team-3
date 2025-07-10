import React, { useState } from 'react';

const Navbar = ({ activeSection, setActiveSection }) => {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAnalysisToggle = () => {
    setIsAnalysisOpen(!isAnalysisOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsAnalysisOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleSectionChange('hero')}
              className="flex-shrink-0 flex items-center group transition-all duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:from-orange-400 group-hover:to-red-400 transition-all duration-300">
                <img 
                  src="/logo.png" 
                  alt="Ok.Hater Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="ml-3 text-white text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-red-300 transition-all duration-300">
                Ok.Hater
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              
              {/* Dropdown de Análisis */}
              <div className="relative">
                <button
                  onClick={handleAnalysisToggle}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                    activeSection === 'comentario' || activeSection === 'video'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Análisis</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${isAnalysisOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isAnalysisOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl ring-1 ring-orange-500/20 z-50 animate-fadeIn">
                    <div className="py-2">
                      <button
                        onClick={() => handleSectionChange('comentario')}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-white transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-500/30 transition-all duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Análisis de Comentario</p>
                          <p className="text-xs text-gray-400 mt-1">Analiza comentarios individuales</p>
                        </div>
                      </button>
                      <button
                        onClick={() => handleSectionChange('video')}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-white transition-all duration-300 group"
                      >
                        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-500/30 transition-all duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 015.83 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Análisis de Video</p>
                          <p className="text-xs text-gray-400 mt-1">Analiza videos de YouTube</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Historial */}
              <button
                onClick={() => handleSectionChange('historial')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                  activeSection === 'historial'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Historial</span>
              </button>

              {/* Acerca de */}
              <button
                onClick={() => handleSectionChange('acerca')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
                  activeSection === 'acerca'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Acerca de</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleMobileMenuToggle}
              className="bg-gray-700/50 inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-all duration-300"
            >
              <svg className={`h-6 w-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50">
            <button
              onClick={() => handleSectionChange('comentario')}
              className="text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-white flex items-center px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Análisis de Comentario
            </button>
            <button
              onClick={() => handleSectionChange('video')}
              className="text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-white flex items-center px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 015.83 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Análisis de Video
            </button>
            <button
              onClick={() => handleSectionChange('historial')}
              className="text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-white flex items-center px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historial
            </button>
            <button
              onClick={() => handleSectionChange('acerca')}
              className="text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-white flex items-center px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Acerca de
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;