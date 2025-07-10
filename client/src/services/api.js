import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // asegúrate que tu FastAPI corra aquí
  timeout: 10000,
});

// Evaluar toxicidad con modelo ML
export const evaluarComentarioML = async (comentario) => {
  try {
    const response = await API.post("/predict_ml", { text: comentario });
    return response.data;
  } catch (error) {
    console.error("Error al evaluar comentario ML:", error);
    throw error;
  }
};

// Evaluar toxicidad con modelo NLP Transformer
export const evaluarComentarioNLP = async (comentario) => {
  try {
    const response = await API.post("/predict_nlp", { text: comentario });
    return response.data;
  } catch (error) {
    console.error("Error al evaluar comentario NLP:", error);
    throw error;
  }
};

// Obtener historial de evaluaciones
export const getHistorial = async () => {
  try {
    const response = await API.get("/historial");
    return response.data;
  } catch (error) {
    console.error("Error al obtener historial:", error);
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

// Obtener predicciones de comentarios YouTube usando modelo ML
export const evaluarYoutubeCommentsML = async (youtubeUrl) => {
  try {
    const response = await API.post("/predict/youtube_comments", { url: youtubeUrl });
    return response.data;
  } catch (error) {
    console.error("Error al evaluar comentarios YouTube ML:", error);
    throw error;
  }
};

// Obtener predicciones de comentarios YouTube usando modelo Transformer NLP
export const evaluarYoutubeCommentsNLP = async (youtubeUrl) => {
  try {
    const response = await API.post("/predict/youtube_comments_transformer", { url: youtubeUrl });
    return response.data;
  } catch (error) {
    console.error("Error al evaluar comentarios YouTube NLP:", error);
    throw error;
  }
};

export default API;
