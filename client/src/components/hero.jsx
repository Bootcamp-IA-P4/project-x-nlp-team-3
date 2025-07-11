import React, { useState, useEffect } from 'react';

const Hero = ({ onStartAnalysis }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className={`max-w-4xl mx-auto px-6 py-16 transition-all duration-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo y Título Principal */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="w-35 h-35">
                <img 
                  src="/logo.png" 
                  alt="Ok.Hater Logo" 
                  className="w-35 h-35 object-contain"
                />
              </div>
            </div>
          </div>
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Ok.Hater
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Detección Avanzada de Toxicidad en Comentarios con Inteligencia Artificial
          </p>
        </div>

        {/* Características destacadas */}
        <div className="flex justify-center flex-wrap gap-6 mb-16 text-sm">
          <div className="flex items-center bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">Análisis en Tiempo Real</span>
          </div>
          <div className="flex items-center bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">99.5% Precisión</span>
          </div>
          <div className="flex items-center bg-gray-800/50 rounded-full px-4 py-2 backdrop-blur-sm">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">Resultados Instantáneos</span>
          </div>
        </div>

        {/* Área de entrada principal */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-10 mb-12 shadow-2xl border border-gray-700/50">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              🔍 Comienza tu análisis
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Análisis Individual */}
            <div className="bg-gray-700/30 rounded-xl p-8 hover:bg-gray-700/40 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Analizar Comentario Individual</h3>
              <p className="text-gray-400 mb-6 text-center leading-relaxed">
                Ingresa un comentario específico para analizar su nivel de toxicidad
              </p>
              <button
                onClick={() => onStartAnalysis('comentario')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Comenzar Análisis
              </button>
            </div>

            {/* Análisis de Video */}
            <div className="bg-gray-700/30 rounded-xl p-8 hover:bg-gray-700/40 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 015.83 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Analizar Video de YouTube</h3>
              <p className="text-gray-400 mb-6 text-center leading-relaxed">
                Analiza todos los comentarios de un video de YouTube ingresando su URL
              </p>
              <button
                onClick={() => onStartAnalysis('video')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Analizar Video
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Análisis Preciso</h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Utilizamos modelos de IA avanzados para detectar toxicidad con alta precisión
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Súper Rápido</h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Obtén resultados instantáneos sin demoras ni tiempos de espera largos
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Privado & Seguro</h3>
            <p className="text-gray-400 text-center leading-relaxed">
              Tus datos están protegidos y el análisis se realiza de forma segura
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-2xl border border-gray-700/50">
          <h3 className="text-2xl font-semibold mb-8 text-center">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              🚀 Rendimiento Superior
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">99.5%</div>
              <div className="text-gray-400">Precisión</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">&lt;1s</div>
              <div className="text-gray-400">Tiempo de Respuesta</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">24/7</div>
              <div className="text-gray-400">Disponibilidad</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="flex justify-center space-x-8 text-sm text-gray-400 mb-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Seguro & Privado
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Súper Rápido
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              IA Avanzada
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Powered by advanced machine learning to keep online communities safe and respectful.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Hero;