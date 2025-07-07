import React, { useState } from 'react';
import { evaluarYoutubeCommentsML, evaluarYoutubeCommentsNLP } from '../services/api';

const AnalisisVideo = () => {
  const [url, setUrl] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modelType, setModelType] = useState('ml'); // 'ml' o 'nlp'
  const [videoInfo, setVideoInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Por favor, ingresa una URL de YouTube válida');
      return;
    }

    setLoading(true);
    setError('');
    setComments([]);
    setVideoInfo(null);

    try {
      let response;
      if (modelType === 'ml') {
        response = await evaluarYoutubeCommentsML(url);
      } else {
        response = await evaluarYoutubeCommentsNLP(url);
      }

      setComments(response.comments || response.predictions || []);
      setVideoInfo(response.video_info || null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al analizar los comentarios del video');
    } finally {
      setLoading(false);
    }
  };

  const getToxicityColor = (toxicity) => {
    if (toxicity >= 0.8) return 'bg-red-500';
    if (toxicity >= 0.6) return 'bg-red-400';
    if (toxicity >= 0.4) return 'bg-yellow-500';
    if (toxicity >= 0.2) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  const getToxicityLabel = (toxicity) => {
    if (toxicity >= 0.8) return 'Muy Tóxico';
    if (toxicity >= 0.6) return 'Tóxico';
    if (toxicity >= 0.4) return 'Moderado';
    if (toxicity >= 0.2) return 'Ligero';
    return 'No Tóxico';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">YouToxic</h1>
          <p className="text-gray-400 mb-6">
            Análisis Avanzado de Comentarios de YouTube con IA
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Análisis en Tiempo Real
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              99.5% Precisión
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Resultados Instantáneos
            </span>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-orange-500">
            🔗 Análisis de Video de YouTube
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL del Video de YouTube
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Modelo de Análisis
                </label>
                <select
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="ml">Modelo ML (Rápido)</option>
                  <option value="nlp">Modelo NLP Transformer (Preciso)</option>
                </select>
              </div>

              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  &nbsp;
                </label>
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analizando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Analizar Comentarios
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Información del Video */}
        {videoInfo && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-orange-500">📹 Información del Video</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Título</p>
                <p className="text-white font-medium">{videoInfo.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Canal</p>
                <p className="text-white font-medium">{videoInfo.channel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Comentarios Analizados</p>
                <p className="text-white font-medium">{comments.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Modelo Utilizado</p>
                <p className="text-white font-medium">{modelType === 'ml' ? 'Machine Learning' : 'NLP Transformer'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {comments.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-orange-500">
              💬 Análisis de Comentarios ({comments.length})
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.map((comment, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">
                          {comment.author || `Usuario ${index + 1}`}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getToxicityColor(comment.toxicity)} text-white`}>
                            {getToxicityLabel(comment.toxicity)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {(comment.toxicity * 100).toFixed(1)}% tóxico
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {comment.text || comment.comment}
                  </p>

                  {comment.confidence && (
                    <div className="mt-2 text-xs text-gray-400">
                      Confianza: {(comment.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-12 w-12 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className="text-lg font-semibold mb-2">Analizando comentarios...</h3>
              <p className="text-gray-400">Esto puede tomar unos segundos dependiendo del número de comentarios</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-700">
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Seguro y Privado
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Súper Rápido
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              IA Avanzada
            </span>
          </div>
          <p className="text-gray-500 mt-2">
            Powered by advanced machine learning to keep online communities safe and respectful.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalisisVideo;