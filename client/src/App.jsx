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
          <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Acerca de YouToxic</h1>
                <p className="text-gray-400 text-lg">
                  Plataforma avanzada de análisis de toxicidad en comentarios usando IA
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-8 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-orange-500">¿Qué es YouToxic?</h2>
                <p className="text-gray-300 mb-4">
                  YouToxic es una herramienta de análisis de toxicidad que utiliza inteligencia artificial 
                  para evaluar comentarios individuales y comentarios de videos de YouTube. Nuestro objetivo 
                  es crear comunidades online más seguras y respetuosas.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-orange-500">Características principales:</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Análisis en tiempo real de comentarios</li>
                  <li>• Análisis masivo de comentarios de YouTube</li>
                  <li>• Dos modelos de IA: ML rápido y NLP Transformer preciso</li>
                  <li>• Historial de análisis realizados</li>
                  <li>• Interfaz intuitiva y moderna</li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-semibold mb-4 text-orange-500">Tecnología</h2>
                <p className="text-gray-300 mb-4">
                  Utilizamos modelos de machine learning avanzados y transformers de NLP para 
                  proporcionar análisis precisos y confiables de la toxicidad en el texto.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">AI</span>
                    </div>
                    <h3 className="font-semibold mb-2">Inteligencia Artificial</h3>
                    <p className="text-sm text-gray-400">Modelos avanzados de ML y NLP</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">⚡</span>
                    </div>
                    <h3 className="font-semibold mb-2">Análisis Rápido</h3>
                    <p className="text-sm text-gray-400">Resultados instantáneos</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">🎯</span>
                    </div>
                    <h3 className="font-semibold mb-2">Alta Precisión</h3>
                    <p className="text-sm text-gray-400">99.5% de exactitud</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Hero onStartAnalysis={() => setActiveSection('comentario')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      {renderContent()}
    </div>
  );
}

export default App;