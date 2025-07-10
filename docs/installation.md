# Guía de Instalación

Esta guía proporciona los pasos necesarios para configurar y ejecutar el proyecto completo (backend y frontend) en un entorno de desarrollo local.

## Prerrequisitos

-   Python 3.9+
-   Node.js 16+ y npm
-   Git

## 1. Clonar el Repositorio

```bash
git clone https://github.com/Bootcamp-IA-P4/project-x-nlp-team-3.git
cd project-x-nlp-team-3
```

## 2. Configuración del Backend (`server/`)

El backend es una API de FastAPI que sirve el modelo de IA.

```bash
# 1. Navega a la carpeta del servidor
cd server/

# 2. Crea y activa un entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# 3. Instala las dependencias de Python
pip install -r requirements.txt

# 4. Configura las variables de entorno
# Crea un archivo llamado .env en la carpeta server/ y añade las siguientes claves:
# SUPABASE_URL=tu_url_de_supabase
# SUPABASE_KEY=tu_api_key_de_supabase
# YOUTUBE_API_KEY=tu_api_key_de_youtube

# 5. Inicia el servidor de desarrollo
uvicorn main:app --reload --port 8000
```

El backend estará ahora corriendo en `http://localhost:8000`.

## 3. Configuración del Frontend (`client/`)

El frontend es una aplicación de React construida con Vite.

```bash
# 1. Abre una nueva terminal y navega a la carpeta del cliente
cd client/

# 2. Instala las dependencias de Node.js
npm install

# 3. Inicia el servidor de desarrollo de Vite
npm run dev
```

El frontend estará ahora accesible en `http://localhost:5173` (o el puerto que indique Vite).

## 4. (Opcional) Docker

El proyecto también puede ser levantado utilizando Docker y Docker Compose para una configuración más aislada y reproducible.

```bash
# Desde la raíz del proyecto
docker-compose up --build
```
