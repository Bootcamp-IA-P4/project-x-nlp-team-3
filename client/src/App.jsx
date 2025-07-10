import React, { useState } from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import AnalisisComentario from './components/AnilisisComentario';
import AnalisisVideo from './components/AnilisisVideo';
import Historial from './components/historial';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'comentario':
        return <AnalisisComentario />;
      case 'video':
        return <AnalisisVideo />;
      case 'historial':
        return <Historial />;

case 'acerca':
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto transition-all duration-1000 opacity-100 translate-y-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Acerca de Ok.Hater
          </h1>
          <p className="text-gray-300 text-lg">
            Plataforma avanzada de análisis de toxicidad en comentarios usando IA
          </p>
        </div>

        {/* Características */}
        <div className="flex justify-center space-x-8 mb-8 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">Inteligencia Artificial</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">Análisis Rápido</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">Alta Precisión</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🚀 ¿Qué es Ok.Hater?
          </h2>
          
          <div className="mb-8">
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Ok.Hater es una herramienta de análisis de toxicidad que utiliza inteligencia artificial 
              para evaluar comentarios individuales y comentarios de videos de YouTube. Nuestro objetivo 
              es crear comunidades online más seguras y respetuosas.
            </p>
            
            <div className="bg-gray-700/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-orange-400">
                ⭐ Características principales:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Análisis en tiempo real de comentarios</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Análisis masivo de comentarios de YouTube</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Modelos de: ML rápido y NLP Transformer preciso</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Historial de análisis realizados</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">Interfaz intuitiva y moderna</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🔬 Tecnología
          </h2>
          
          <p className="text-gray-300 mb-6 text-lg leading-relaxed text-center">
            Utilizamos modelos de machine learning avanzados y transformers de NLP para 
            proporcionar análisis precisos y confiables de la toxicidad en el texto.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700/30 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">AI</span>
              </div>
              <h3 className="font-semibold mb-2 text-green-400">Inteligencia Artificial</h3>
              <p className="text-sm text-gray-400">Modelos avanzados de ML y NLP</p>
            </div>
            
            <div className="bg-gray-700/30 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-blue-400">Análisis Rápido</h3>
              <p className="text-sm text-gray-400">Resultados instantáneos</p>
            </div>
            
            <div className="bg-gray-700/30 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 text-purple-400">Alta Precisión</h3>
              <p className="text-sm text-gray-400">99.5% de exactitud</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Seguro & Privado
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Súper Rápido
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              IA Avanzada
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Powered by advanced machine learning to keep online communities safe and respectful.
          </p>
        </div>
      </div>
    </div>
  );
      default:
        return <Hero onStartAnalysis={() => setActiveSection('comentario')} />;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      {renderContent()}
    </div>
  );
}

export default App;