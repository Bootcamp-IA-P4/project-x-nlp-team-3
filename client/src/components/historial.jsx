// import React, { useEffect, useState } from "react";
// import { getHistorial } from "../services/api";

// function Historial() {
//   const [historial, setHistorial] = useState([]);

//   useEffect(() => {
//     const fetchHistorial = async () => {
//       try {
//         const data = await getHistorial();
//         setHistorial(data);
//       } catch (error) {
//         console.error("No se pudo obtener el historial");
//       }
//     };

//     fetchHistorial();
//   }, []);

//   return (
//     <section id="historial" className="py-12 bg-white text-center">
//       <h2 className="text-2xl font-bold text-teal-900 mb-2">Historial de Evaluaciones</h2>
//       <p className="text-teal-800 mb-6">Últimos comentarios evaluados con nuestro modelo de IA</p>

//       {historial.length === 0 ? (
//         <div className="max-w-md mx-auto border rounded-lg p-6 shadow">
//           <p className="text-teal-600 font-medium">No hay evaluaciones aún</p>
//           <p className="text-sm text-teal-800 mt-2">Realiza tu primera evaluación para ver los resultados aquí</p>
//         </div>
//       ) : (
//         <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
//           {historial.map((item, index) => (
//             <div key={index} className="border rounded-lg p-4 shadow text-left">
//               <p className="font-semibold text-teal-900">Comentario:</p>
//               <p className="text-teal-800 mb-2">{item.comentario}</p>
//               <p className="text-teal-700 text-sm">Predicción: {item.prediccion}</p>
//               <p className="text-teal-600 text-xs">Fecha: {item.fecha}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }

// export default Historial;
