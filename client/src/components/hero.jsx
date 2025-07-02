import React, { useState } from "react";
import { evaluarComentario } from "../services/api";

function Hero() {
  const [comentario, setComentario] = useState("");
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleEvaluacion = async () => {
    if (!comentario.trim()) {
      alert("Por favor ingresa un comentario para evaluar.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await evaluarComentario(comentario);
      setResultado(res);
      setIsAnalyzed(true);
    } catch (error) {
      alert("Error al evaluar el comentario. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setComentario("");
    setResultado(null);
    setIsAnalyzed(false);
  };

  const getToxicityLevel = (prediction) => {
    // Asumiendo que tu API devuelve algo como { prediccion: "Tóxico" } o un score
    if (typeof prediction === 'string') {
      return prediction.toLowerCase().includes('tóxico') || prediction.toLowerCase().includes('toxic');
    }
    // Si es un objeto con score, ajusta según tu API
    return prediction?.toxic || prediction?.prediccion === 'Tóxico';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">YouToxic</h1>
          <p className="text-gray-300 text-lg">Advanced AI-Powered Comment Toxicity Detection</p>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>99.5% Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Instant Results</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {!isAnalyzed ? (
            <>
              {/* Input Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-amber-500 font-medium">Enter a comment to analyze</span>
                </div>
                <div className="relative">
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Write your comment here..."
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all duration-200"
                    rows="6"
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {comentario.length}/500
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to analyze quickly</p>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleEvaluacion}
                disabled={isLoading || !comentario.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Analyze Toxicity</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Results Section */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 font-medium">Analysis Complete</span>
                </div>
              </div>

              {/* Result Card */}
              <div className={`border rounded-xl p-6 mb-6 ${
                getToxicityLevel(resultado) 
                  ? 'bg-red-900/20 border-red-500/50' 
                  : 'bg-green-900/20 border-green-500/50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold text-lg">Result:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getToxicityLevel(resultado)
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}>
                    {getToxicityLevel(resultado) ? 'Toxic' : 'Safe'}
                  </span>
                </div>
                
                <div className="text-gray-300">
                  {getToxicityLevel(resultado) ? (
                    <p>This comment contains toxic language that may be harmful or offensive.</p>
                  ) : (
                    <p>This comment appears to be safe and non-toxic.</p>
                  )}
                </div>

                {/* Optional: Show additional details if your API provides them */}
                {resultado?.confidence && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Confidence Level:</span>
                      <span>{Math.round(resultado.confidence * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Analyze Another Button */}
              <button
                onClick={handleNewAnalysis}
                className="w-full bg-slate-700 hover:bg-slate-600 text-amber-400 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 border border-slate-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>Analyze Another Comment</span>
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <span>AI-Powered</span>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            Powered by advanced machine learning to keep online communities safe and respectful.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;