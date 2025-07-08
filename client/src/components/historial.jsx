import React, { useEffect, useState } from "react";
import { getHistorial } from "../services/api";

function Historial() {
  const [historial, setHistorial] = useState([]);
  const [visibleItems, setVisibleItems] = useState(new Set());

const maxComments = 20;

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await getHistorial();
        setHistorial(data);
      } catch (error) {
        console.error("No se pudo obtener el historial");
      }
    };

    fetchHistorial();
  }, []);

  useEffect(() => {
    if (historial.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setVisibleItems(prev => new Set([...prev, index]));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Usar un timeout para asegurar que los elementos estén en el DOM
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.historial-item');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [historial]);

  const getStatusColor = (label) => {
    // Debug temporal - puedes remover esto después
    console.log('Label:', label, 'Type:', typeof label);
    
    if (!label) return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    
    // Convertir a string si no lo es
    const labelStr = typeof label === 'string' ? label : String(label);
    
    if (labelStr.toLowerCase().includes('toxic')) {
      return 'bg-red-500/20 border-red-500/30 text-red-400';
    }
    return 'bg-green-500/20 border-green-500/30 text-green-400';
  };

  const getStatusIcon = (label) => {
  if (label === true) return '⚠️';
  if (label === false) return '✅';
  return '🔍';
};

  return (
    <section id="historial" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen relative overflow-hidden">
      {/* Elementos flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-32 bg-orange-500/5 rounded-lg backdrop-blur-3xl transform rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-24 bg-blue-500/5 rounded-lg backdrop-blur-3xl transform -rotate-6 animate-pulse delay-700"></div>
        <div className="absolute bottom-40 left-1/4 w-56 h-28 bg-purple-500/5 rounded-lg backdrop-blur-3xl transform rotate-6 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Historial de Evaluaciones
          </h2>
          <p className="text-slate-300 text-lg">
            Últimos comentarios evaluados con nuestro modelo de IA
          </p>
          
          {/* Stats bar */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">99.5% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">Instant Results</span>
            </div>
          </div>
        </div>

        {historial.length === 0 ? (
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No hay evaluaciones aún
                </h3>
                <p className="text-slate-400">
                  Realiza tu primera evaluación para ver los resultados aquí
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {historial.slice(0, maxComments).map((item, index) => (
                <div
                  key={index}
                  data-index={index}
                  className={`historial-item transform transition-all duration-700 ${
                    visibleItems.has(index) 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    transform: visibleItems.has(index) ? 'translateY(0)' : 'translateY(32px)'
                  }}
                >
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all duration-300 group">
                    {/* Header del comentario */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Comentario</h4>
                          <p className="text-xs text-slate-400">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            }) : 'Fecha no disponible'} • {item.created_at ? new Date(item.created_at).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.label)}`}>
                        <span className="mr-1">{getStatusIcon(item.label)}</span>
                        Analizado
                      </div>
                    </div>

                    {/* Contenido del comentario */}
                    <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {item.text || 'Comentario no disponible'}
                      </p>
                    </div>

                    {/* Footer con detalles */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                        <span>Análisis completado</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>
                          {item.created_at ? new Date(item.created_at).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          }) : 'Hora no disponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer section */}
        <div className="mt-16 text-center">
          <div className="flex justify-center items-center gap-8 text-slate-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">AI-Powered</span>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            Powered by advanced machine learning to keep online communities safe and respectful.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Historial;