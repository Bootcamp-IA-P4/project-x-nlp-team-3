import React, { useState, useEffect } from 'react';
import { evaluarComentarioML, evaluarComentarioNLP } from '../services/api';

const AnilisisComentario = () => {
  const [comentario, setComentario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [modeloSeleccionado, setModeloSeleccionado] = useState('ml');
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalizar = async () => {
    if (!comentario.trim()) {
      setError('Por favor ingresa un comentario para analizar');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultado(null);

    try {
      let response;
      if (modeloSeleccionado === 'ml') {
        response = await evaluarComentarioML(comentario);
      } else {
        response = await evaluarComentarioNLP(comentario);
      }
      
      setResultado(response);
    } catch (err) {
      setError('Error al analizar el comentario. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAnalizar();
    }
  };

  const getToxicityLevel = (score) => {
    if (score >= 0.8) return { level: 'Muy Tóxico', color: 'bg-red-500', textColor: 'text-red-500' };
    if (score >= 0.6) return { level: 'Tóxico', color: 'bg-orange-500', textColor: 'text-orange-500' };
    if (score >= 0.4) return { level: 'Moderado', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    if (score >= 0.2) return { level: 'Bajo', color: 'bg-blue-500', textColor: 'text-blue-500' };
    return { level: 'No Tóxico', color: 'bg-green-500', textColor: 'text-green-500' };
  };

  const getScorePercentage = (score) => {
    return Math.round(score * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className={`max-w-4xl mx-auto transition-all duration-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Análisis de Comentario
          </h1>
          <p className="text-gray-300 text-lg">
            Detecta toxicidad en comentarios con tecnología de IA avanzada
          </p>
        </div>

        {/* Características */}
        <div className="flex justify-center space-x-8 mb-8 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">Análisis en Tiempo Real</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">99.5% Precisión</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">Resultados Instantáneos</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          {/* Selector de Modelo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Selecciona el modelo de análisis:
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setModeloSeleccionado('ml')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  modeloSeleccionado === 'ml'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Machine Learning
              </button>
              <button
                onClick={() => setModeloSeleccionado('nlp')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  modeloSeleccionado === 'nlp'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Transformer NLP
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-orange-400 mb-3">
              🔍 Ingresa un comentario para analizar
            </label>
            <div className="relative">
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu comentario aquí..."
                className="w-full h-32 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {comentario.length}/500
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Presiona Ctrl+Enter para analizar rápidamente
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-300">{error}</span>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalizar}
            disabled={isLoading || !comentario.trim()}
            className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 transform ${
              isLoading || !comentario.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analizando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Analizar Toxicidad
              </div>
            )}
          </button>
        </div>

        {/* Results */}
        {resultado && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-center">
              📊 Resultados del Análisis
            </h2>
            
            {/* Toxicity Score */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Nivel de Toxicidad</span>
                <span className={`text-xl font-bold ${getToxicityLevel(resultado.toxicity_score || resultado.score || 0).textColor}`}>
                  {getToxicityLevel(resultado.toxicity_score || resultado.score || 0).level}
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full ${getToxicityLevel(resultado.toxicity_score || resultado.score || 0).color} transition-all duration-1000 ease-out`}
                  style={{ width: `${getScorePercentage(resultado.toxicity_score || resultado.score || 0)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>0%</span>
                <span className="font-medium">
                  {getScorePercentage(resultado.toxicity_score || resultado.score || 0)}%
                </span>
                <span>100%</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-orange-400">📈 Puntuación</h3>
                <p className="text-2xl font-bold">
                  {(resultado.toxicity_score || resultado.score || 0).toFixed(4)}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Escala de 0.0 a 1.0
                </p>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-400">🤖 Modelo</h3>
                <p className="text-lg font-medium">
                  {modeloSeleccionado === 'ml' ? 'Machine Learning' : 'Transformer NLP'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {modeloSeleccionado === 'ml' ? 'Modelo clásico' : 'Modelo avanzado'}
                </p>
              </div>
            </div>

            {/* Analyzed Comment */}
            <div className="mt-6 bg-gray-700/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-purple-400">💬 Comentario Analizado</h3>
              <p className="text-gray-300 italic">
                "{comentario}"
              </p>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center">
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

export default AnilisisComentario;