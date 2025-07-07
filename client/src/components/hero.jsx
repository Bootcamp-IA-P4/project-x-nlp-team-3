import React from 'react';

const Hero = ({ onStartAnalysis }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo y Título Principal */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-3xl">+</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            YouToxic
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Detección Avanzada de Toxicidad en Comentarios con IA
          </p>
        </div>

        {/* Características destacadas */}
        <div className="flex justify-center space-x-8 mb-12 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Análisis en Tiempo Real</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-300">99.5% Precisión</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Resultados Instantáneos</span>
          </div>
        </div>

        {/* Área de entrada principal */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-orange-500">
            🔍 Comienza tu análisis
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-lg mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Analizar Comentario Individual</h3>
              <p className="text-gray-400 mb-4">
                Ingresa un comentario específico para analizar su nivel de toxicidad
              </p>
              <button
                onClick={onStartAnalysis}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Comenzar Análisis
              </button>
            </div>

            <div className="text-gray-400 text-sm">
              <span>o</span>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 015.83 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Analizar Video de YouTube</h3>
              <p className="text-gray-400 mb-4">
                Analiza todos los comentarios de un video de YouTube ingresando su URL
              </p>
              <button
                onClick={() => {/* Esta función se manejará desde el dropdown */}}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Usar el Menú de Análisis
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Análisis Preciso</h3>
            <p className="text-sm text-gray-400">
              Utilizamos modelos de IA avanzados para detectar toxicidad con alta precisión
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Súper Rápido</h3>
            <p className="text-sm text-gray-400">
              Obtén resultados instantáneos sin demoras ni tiempos de espera largos
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Privado & Seguro</h3>
            <p className="text-sm text-gray-400">
              Tus datos están protegidos y el análisis se realiza de forma segura
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Powered by advanced machine learning to keep online communities safe and respectful.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;