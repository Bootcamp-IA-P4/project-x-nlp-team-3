// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8000/predict", // Cambia según tu backend real
//   timeout: 10000,
// });

// // Obtener historial de evaluaciones
// export const getHistorial = async () => {
//   try {
//     const response = await API.get("/historial");
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener historial:", error);
//     throw error;
//   }
// };

// // Evaluar toxicidad de comentario
// export const evaluarComentario = async (comentario) => {
//   try {
//     const response = await API.post("/evaluar", { comentario });
//     return response.data;
//   } catch (error) {
//     console.error("Error al evaluar comentario:", error);
//     throw error;
//   }
// };

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // asegúrate que tu FastAPI corra aquí
  timeout: 10000,
});

// Evaluar toxicidad de comentario
export const evaluarComentario = async (comentario) => {
  try {
    const response = await API.post("/predict", { text: comentario });
    return response.data;
  } catch (error) {
    console.error("Error al evaluar comentario:", error);
    throw error;
  }
};

// Verificar estado del backend (opcional)
export const verificarBackend = async () => {
  try {
    const response = await API.get("/");
    return response.data;
  } catch (error) {
    console.error("Error al verificar backend:", error);
    throw error;
  }
};

export default API;
