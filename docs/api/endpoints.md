# Documentación de la API

La API del backend está construida con FastAPI y expone los siguientes endpoints para ser consumidos por el frontend o cualquier otro cliente HTTP.

**URL Base**: `http://localhost:8000`

---

## 1. Analizar un Comentario

-   **Endpoint**: `POST /analyze_comment`
-   **Descripción**: Recibe un único comentario y devuelve su clasificación de toxicidad y la probabilidad asociada.
-   **Request Body**:

    ```json
    {
      "text": "Este es el comentario a analizar."
    }
    ```

-   **Response (Éxito `200 OK`)**:

    ```json
    {
      "prediction": "No Tóxico",
      "probability": 0.98
    }
    ```

-   **Detalles**: Este endpoint utiliza el pipeline de inferencia del modelo cargado para procesar el texto. El resultado también se guarda en la base de datos Supabase.

---

## 2. Analizar un Vídeo de YouTube

-   **Endpoint**: `POST /analyze_video`
-   **Descripción**: Recibe la URL de un vídeo de YouTube, extrae sus comentarios, los analiza y devuelve una lista con los resultados.
-   **Request Body**:

    ```json
    {
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
    ```

-   **Response (Éxito `200 OK`)**:

    ```json
    [
      {
        "comment_text": "¡Gran vídeo! Me ha encantado.",
        "prediction": "No Tóxico",
        "probability": 0.99
      },
      {
        "comment_text": "Esto es terrible, no sabes de lo que hablas.",
        "prediction": "Tóxico",
        "probability": 0.92
      }
    ]
    ```

-   **Detalles**: Este es un endpoint de larga duración. Internamente, se conecta a la API de YouTube (requiere una `YOUTUBE_API_KEY` válida en el backend) para obtener los comentarios antes de procesarlos uno por uno. Cada resultado se guarda individualmente en Supabase.
