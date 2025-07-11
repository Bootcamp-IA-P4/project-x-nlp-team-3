# Proyecto de Detección de Comentarios Tóxicos - Rama `feature/client-server`

## 1. Resumen de la Rama

Esta documentación detalla la arquitectura y funcionalidad de la rama `feature/client-server`, que representa la **productivización de la solución de IA** en una aplicación web full-stack. El trabajo aquí realizado cumple con los requisitos de los **Niveles Esencial, Medio y Experto** del briefing, al proporcionar una solución práctica y tangible que permite a un usuario interactuar con el modelo de IA entrenado.

El objetivo principal ha sido construir una interfaz de usuario (Frontend) y un servidor (Backend) que, en conjunto, ofrecen las siguientes funcionalidades clave:

1.  **Análisis de Comentarios Individuales**: Permite a un usuario introducir un texto para obtener una clasificación de toxicidad y su probabilidad.
2.  **Análisis de Vídeos de YouTube**: Permite introducir la URL de un vídeo para analizar sus comentarios y obtener un listado de resultados.
3.  **Persistencia de Datos**: Guarda cada resultado de análisis en una base de datos **Supabase** para su posterior consulta y auditoría.

## 2. Arquitectura General de la Solución

La aplicación se ha diseñado siguiendo una arquitectura cliente-servidor desacoplada, una práctica estándar en el desarrollo de software moderno que garantiza la escalabilidad y mantenibilidad.

-   **Frontend (`client/`)**: Una Single-Page Application (SPA) desarrollada con **React** y **Vite**, estilizada con **Tailwind CSS**. Es la cara visible de la aplicación, responsable de la interacción con el usuario y de la comunicación con el backend.

-   **Backend (`server/`)**: Una API RESTful robusta construida con **FastAPI** (Python). Orquesta toda la lógica de negocio: recibe peticiones del frontend, carga y ejecuta los modelos de IA, interactúa con la API de YouTube y se comunica con la base de datos.

-   **Base de Datos**: Se ha utilizado **Supabase**, una plataforma de Backend-as-a-Service que proporciona una base de datos PostgreSQL escalable y una API de acceso sencilla.

-   **Modelo de IA**: El backend está diseñado para cargar y utilizar los modelos entrenados en las fases anteriores del proyecto (ej. `DeBERTa` o `MultinomialNB`), encapsulando la lógica de inferencia en un pipeline reutilizable.

![Arquitectura de la Aplicación](https://i.imgur.com/URL_de_tu_diagrama.png)  <!-- Reemplazar con una URL de un diagrama si se tiene -->

## 3. Análisis Detallado del Backend (`server/`)

El servidor es el cerebro de la aplicación. Su estructura modular distribuye las responsabilidades de forma clara.

-   **`main.py`**: Es el punto de entrada de la aplicación FastAPI. Configura el servidor, habilita CORS (Cross-Origin Resource Sharing) para permitir la comunicación con el frontend y registra los routers de la API.

-   **`api/endpoints.py`**: Define los endpoints o rutas de la API que el frontend consume.
    -   `POST /analyze_comment`: Recibe un comentario en formato JSON, lo procesa y devuelve su clasificación de toxicidad.
    -   `POST /analyze_video`: Recibe una URL de YouTube, orquesta la obtención y análisis de los comentarios y devuelve un resumen de los resultados.

-   **`pipeline.py`**: Este es un componente crucial. Contiene la lógica para:
    1.  Cargar el modelo de IA serializado (ej. `pipeline_multinomial_nb.pkl` o el modelo Transformer) desde la carpeta `models/`.
    2.  Implementar las funciones de preprocesamiento de texto necesarias para que el input del usuario coincida con el formato esperado por el modelo.
    3.  Ejecutar la inferencia (predicción) sobre el texto preprocesado.

-   **`database/db_connection.py`**: Gestiona la conexión con Supabase, inicializando el cliente con las credenciales necesarias (URL y API Key) obtenidas de variables de entorno.

-   **`database/save_comment.py`**: Contiene la lógica de negocio para insertar los resultados de los análisis (tanto de comentarios individuales como de vídeos) en las tablas correspondientes de la base de datos.

## 4. Análisis Detallado del Frontend (`client/`)

El frontend está construido para ser intuitivo, reactivo y eficiente, gracias al ecosistema de React y Vite.

-   **`src/main.jsx` y `src/App.jsx`**: Punto de entrada de la aplicación React. `App.jsx` define la estructura principal, el enrutamiento (si lo hubiera) y la disposición de los componentes visuales.

-   **`src/components/`**: El corazón de la interfaz de usuario, compuesto por componentes reutilizables.
    -   `AnilisisComentario.jsx`: Renderiza el formulario para que el usuario escriba un comentario. Gestiona el estado del input, el envío de los datos y la visualización del resultado (toxicidad y probabilidad).
    -   `AnilisisVideo.jsx`: Contiene el formulario para la URL del vídeo y muestra los resultados del análisis en una tabla o lista, indicando qué comentarios son tóxicos.
    -   `historial.jsx`: Componente diseñado para mostrar un historial de los análisis realizados, obteniendo los datos desde el backend, que a su vez los consulta de Supabase.
    -   `navbar.jsx` y `hero.jsx`: Componentes de presentación que conforman la estructura visual y la identidad de la página.

-   **`src/services/api.js`**: Centraliza toda la lógica de comunicación con el backend. Utiliza `fetch` o `axios` para realizar las llamadas a los endpoints de la API (`/analyze_comment`, `/analyze_video`). Separar esta lógica mejora la mantenibilidad y permite gestionar de forma centralizada la configuración de las peticiones y la gestión de errores.

## 5. Flujo de Datos y Casos de Uso

### 5.1. Análisis de un Comentario Individual

1.  **Usuario**: Escribe un comentario en el componente `AnilisisComentario.jsx` y pulsa "Analizar".
2.  **Frontend**: El componente llama a una función en `services/api.js`.
3.  **API Call**: El servicio envía una petición `POST` a `http://localhost:8000/analyze_comment` con el texto del comentario.
4.  **Backend**: FastAPI recibe la petición. El endpoint correspondiente invoca al `pipeline.py` para obtener una predicción del modelo.
5.  **Base de Datos**: El backend llama a `save_comment.py` para registrar el comentario y su resultado en Supabase.
6.  **Respuesta**: El backend devuelve un JSON con la predicción (ej. `{"prediction": "Tóxico", "probability": 0.95}`).
7.  **UI Update**: El frontend recibe la respuesta y actualiza el estado del componente para mostrar el resultado al usuario.

### 5.2. Análisis de un Vídeo de YouTube

1.  **Usuario**: Pega una URL de YouTube en `AnilisisVideo.jsx` y pulsa "Analizar".
2.  **Frontend**: Envía la URL al endpoint `/analyze_video` del backend.
3.  **Backend**: 
    a. Recibe la URL.
    b. Utiliza la API de YouTube para extraer los primeros ~200 comentarios del vídeo.
    c. Itera sobre cada comentario, realizando la predicción con el `pipeline.py`.
    d. Para cada comentario, guarda el resultado en Supabase.
4.  **Respuesta**: El backend devuelve una lista de los comentarios analizados con sus respectivas clasificaciones.
5.  **UI Update**: El frontend renderiza la lista de resultados, destacando visualmente los comentarios tóxicos.

## 6. Instrucciones para la Ejecución Local

Para ejecutar el proyecto en un entorno de desarrollo local, sigue estos pasos:

### Backend (`server/`)

```bash
# 1. Navega a la carpeta del servidor
cd server/

# 2. Crea y activa un entorno virtual
python -m venv venv
source venv/bin/activate

# 3. Instala las dependencias
pip install -r requirements.txt

# 4. Configura las variables de entorno (crea un archivo .env)
# SUPABASE_URL=tu_url_de_supabase
# SUPABASE_KEY=tu_api_key_de_supabase
# YOUTUBE_API_KEY=tu_api_key_de_youtube

# 5. Inicia el servidor
uvicorn main:app --reload --port 8000
```

### Frontend (`client/`)

```bash
# 1. Abre una nueva terminal y navega a la carpeta del cliente
cd client/

# 2. Instala las dependencias de Node.js
npm install

# 3. Inicia el servidor de desarrollo de Vite
npm run dev
```

Una vez completados los pasos, el frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:8000`.
