import React, { useState, useEffect } from 'react';
const evaluarYoutubeCommentsML = async (youtubeUrl) => {
  const response = await fetch('http://localhost:8000/predict/youtube_comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: youtubeUrl })
  });
  if (!response.ok) throw new Error('Error en API ML');
  return response.json();
};

const evaluarYoutubeCommentsNLP = async (youtubeUrl) => {
  const response = await fetch('http://localhost:8000/predict/youtube_comments_transformer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: youtubeUrl })
  });
  if (!response.ok) throw new Error('Error en API NLP');
  return response.json();
};

const AnalisisVideo = ({ setActiveSection }) => {
  const [url, setUrl] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modeloSeleccionado, setModeloSeleccionado] = useState('ml');
  const [videoInfo, setVideoInfo] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Función para validar URL de YouTube
  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Por favor, ingresa una URL de YouTube válida');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError('La URL ingresada no es válida. Debe ser una URL de YouTube.');
      return;
    }

    setIsLoading(true);
    setError('');
    setComments([]);
    setVideoInfo(null);
    setResultado(null);

    try {
      let data;
      
      // Usar la API correspondiente según el modelo seleccionado
      if (modeloSeleccionado === 'ml') {
        data = await evaluarYoutubeCommentsML(url);
      } else {
        data = await evaluarYoutubeCommentsNLP(url);
      }
      
      // Adaptar los datos según la estructura que devuelve tu API
      // Ajusta estas propiedades según lo que devuelve tu backend
      setComments(data.results || []);
      setVideoInfo(data.video_info || {
        title: data.title,
        channel: data.channel,
        views: data.views
      });
      setResultado(data);
      
    } catch (err) {
      console.error('Error al analizar video:', err);
      
      // Manejar diferentes tipos de errores
      if (err.message.includes('fetch') || err.message.includes('NetworkError')) {
        setError('No se pudo conectar con el servidor. Verifica que tu API esté funcionando en http://localhost:8000');
      } else if (err.message.includes('404')) {
        setError('Endpoint no encontrado. Verifica que tu API tenga los endpoints correctos.');
      } else if (err.message.includes('500')) {
        setError('Error interno del servidor. Revisa los logs de tu backend.');
      } else {
        setError(`Error al analizar el video: ${err.message}`);
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleNuevoAnalisis = () => {
    setUrl('');
    setComments([]);
    setError('');
    setVideoInfo(null);
    setResultado(null);
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

  const getAverageScore = () => {
    if (comments.length === 0) return 0;
    const total = comments.reduce((sum, comment) => sum + (comment.toxicity || comment.prediction || 0), 0);
    return total / comments.length;
  };

  const getTotalComments = () => {
    return comments.length;
  };

  const getToxicComments = () => {
    return comments.filter(c => (c.toxicity || c.prediction || 0) >= 0.6).length;
  };

  const getToxicityPercentage = () => {
    if (comments.length === 0) return 0;
    return ((getToxicComments() / getTotalComments()) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className={`max-w-6xl mx-auto p-6 transition-all duration-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 015.83 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Análisis de Video YouTube
          </h1>
          <p className="text-gray-300 text-lg">
            Analiza la toxicidad en todos los comentarios de un video de YouTube
          </p>
        </div>

        {/* Características */}
        <div className="flex justify-center space-x-8 mb-8 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">Análisis Masivo</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">API Real</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-300">Análisis Profundo</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-orange-400 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Ingresa la URL del video de YouTube
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Selecciona el modelo de análisis:
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
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
                  type="button"
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

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-orange-400 mb-3">
                🔗 URL del Video de YouTube
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-400 mt-2">
                Pega aquí la URL completa del video de YouTube que deseas analizar
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 transform ${
                isLoading || !url.trim()
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
                  Analizando comentarios...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Analizar Comentarios del Video
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 text-center animate-fadeIn">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-12 w-12 text-orange-500 mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">Procesando video...</h3>
              <p className="text-gray-400">Extrayendo y analizando todos los comentarios del video</p>
              <div className="mt-4 text-sm text-gray-500">
                Modelo: {modeloSeleccionado === 'ml' ? 'Machine Learning' : 'Transformer NLP'}
              </div>
            </div>
          </div>
        )}

        {/* Video Info */}
        {videoInfo && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-center">
              📺 Información del Video
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">Título</h3>
                <p className="text-gray-300">{videoInfo.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">Canal</h3>
                <p className="text-gray-300">{videoInfo.channel}</p>
              </div>
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">Visualizaciones</h3>
                <p className="text-gray-300">{videoInfo.views?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">Comentarios Analizados</h3>
                <p className="text-gray-300">{comments.length}</p>
              </div>
            </div>
            {videoInfo.thumbnail && (
              <div className="mt-6 flex justify-center">
                <img 
                  src={videoInfo.thumbnail} 
                  alt="Video thumbnail" 
                  className="rounded-lg shadow-lg max-w-xs"
                />
              </div>
            )}
          </div>
        )}

        {/* Resumen del Análisis */}
        {comments.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 mb-8 animate-fadeIn">
            <div className="flex items-center mb-6">
              <svg className="w-6 h-6 text-cyan-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h2 className="text-2xl font-bold text-cyan-400">Resumen del Análisis</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Comentarios */}
              <div className="bg-gray-700/30 rounded-xl p-6 text-center border border-gray-600/50">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">{getTotalComments()}</h3>
                <p className="text-gray-400 text-sm">Total Comentarios</p>
              </div>

              {/* Comentarios Tóxicos */}
              <div className="bg-gray-700/30 rounded-xl p-6 text-center border border-gray-600/50">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-orange-400 mb-2">{getToxicComments()}</h3>
                <p className="text-gray-400 text-sm">Comentarios Tóxicos</p>
              </div>

              {/* Porcentaje de Toxicidad */}
              <div className="bg-gray-700/30 rounded-xl p-6 text-center border border-gray-600/50">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">{getToxicityPercentage()}%</h3>
                <p className="text-gray-400 text-sm">Tasa de Toxicidad</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {comments.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-center">
              📊 Análisis Detallado
            </h2>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <h3 className="font-semibold mb-2 text-green-400">✅ No Tóxicos</h3>
                <p className="text-2xl font-bold">
                  {comments.filter(c => (c.toxicity || c.prediction || 0) < 0.2).length}
                </p>
                <p className="text-sm text-gray-400">
                  {Math.round((comments.filter(c => (c.toxicity || c.prediction || 0) < 0.2).length / comments.length) * 100)}%
                </p>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <h3 className="font-semibold mb-2 text-yellow-400">⚠️ Moderados</h3>
                <p className="text-2xl font-bold">
                  {comments.filter(c => {
                    const score = c.toxicity || c.prediction || 0;
                    return score >= 0.2 && score < 0.6;
                  }).length}
                </p>
                <p className="text-sm text-gray-400">
                  {Math.round((comments.filter(c => {
                    const score = c.toxicity || c.prediction || 0;
                    return score >= 0.2 && score < 0.6;
                  }).length / comments.length) * 100)}%
                </p>
              </div>
              
              <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                <h3 className="font-semibold mb-2 text-red-400">🚨 Tóxicos</h3>
                <p className="text-2xl font-bold">
                  {comments.filter(c => (c.toxicity || c.prediction || 0) >= 0.6).length}
                </p>
                <p className="text-sm text-gray-400">
                  {Math.round((comments.filter(c => (c.toxicity || c.prediction || 0) >= 0.6).length / comments.length) * 100)}%
                </p>
              </div>
            </div>

            {/* Model Info */}
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-2 text-blue-400">🤖 Modelo Utilizado</h3>
              <p className="text-lg font-medium">
                {modeloSeleccionado === 'ml' ? 'Machine Learning' : 'Transformer NLP'}
              </p>
            </div>
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                💬 Comentarios Analizados
              </h2>
              <button
                onClick={handleNuevoAnalisis}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition-colors"
              >
                Nuevo Análisis
              </button>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.map((comment, index) => {
                const toxicityScore = comment.toxicity || comment.prediction || 0;
                const commentText = comment.text || comment.comment || 'Sin texto';
                
                return (
                  <div key={index} className="bg-gray-700/30 rounded-lg p-4 border-l-4 border-opacity-50" 
                       style={{ borderLeftColor: getToxicityLevel(toxicityScore).color.replace('bg-', '') }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${getToxicityLevel(toxicityScore).textColor}`}>
                        {getToxicityLevel(toxicityScore).level}
                      </span>
                      <span className="text-sm text-gray-400">
                        {getScorePercentage(toxicityScore)}%
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {commentText}
                    </p>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${getToxicityLevel(toxicityScore).color} transition-all duration-500`}
                        style={{ width: `${getScorePercentage(toxicityScore)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
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
              Análisis Masivo
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              IA Avanzada
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Powered by advanced machine learning to analyze YouTube video comments and maintain safer online communities.
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

export default AnalisisVideo;