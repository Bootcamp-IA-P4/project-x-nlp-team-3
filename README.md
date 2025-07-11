# 🚀 Project X: Detección de Toxicidad en YouTube con IA 🚀

[![Estado del Despliegue](https://api.netlify.com/api/v1/badges/d95d5a6b-c2a1-41e9-9599-88a5b8aa881a/deploy-status)](https://app.netlify.com/sites/project-x-nlp-team-3/deploys)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-20.10-blue.svg?logo=docker)](https://www.docker.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com/)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Transformers-orange)](https://huggingface.co/transformers/)

Una solución Full-Stack para el análisis y detección de toxicidad en comentarios de YouTube, utilizando un pipeline de MLOps desde la recolección de datos hasta el despliegue de modelos de Machine Learning y Deep Learning.

Este proyecto implementa un sistema robusto capaz de clasificar comentarios de YouTube como "Tóxicos" o "No Tóxicos". Utiliza un enfoque dual, combinando un modelo de Machine Learning clásico para una clasificación rápida y un modelo Transformer avanzado para un análisis de sentimiento más profundo. Todo el sistema se sirve a través de una API RESTful de alto rendimiento y está completamente contenerizado con Docker para garantizar la portabilidad y escalabilidad.

---

## 📖 Tabla de Contenidos

* [🌐 Demo en Vivo y Documentación](#-demo-en-vivo-y-documentación)
* [✨ Características Principales](#-características-principales)
* [🏗️ Arquitectura y Flujo del Proyecto](#️-arquitectura-y-flujo-del-proyecto)
* [🛠️ Stack Tecnológico](#️-stack-tecnológico)
* [⚙️ Instalación y Puesta en Marcha](#️-instalación-y-puesta-en-marcha)
  * [Prerrequisitos](#prerrequisitos)
  * [Configuración del Entorno](#configuración-del-entorno)
  * [Ejecución con Docker (Recomendado)](#ejecución-con-docker-recomendado)
  * [Ejecución Manual (Alternativa)](#ejecución-manual-alternativa)
* [▶️ Cómo Usar la Aplicación](#️-cómo-usar-la-aplicación)
* [📊 Modelos de Inteligencia Artificial](#-modelos-de-inteligencia-artificial)
  * [Enfoque 1: Machine Learning Supervisado (Clasificación Rápida)](#enfoque-1-machine-learning-supervisado-clasificación-rápida)
  * [Enfoque 2: Modelo Transformer (Análisis Profundo)](#enfoque-2-modelo-transformer-análisis-profundo)
* [🔌 Endpoints de la API](#-endpoints-de-la-api)
* [🔄 CI/CD y Automatización](#-cicd-y-automatización)
* [🤝 Contribuciones](#-contribuciones)
* [📜 Licencia](#-licencia)
* [🙏 Agradecimientos](#-agradecimientos)

---

## 🌐 Demo en Vivo y Documentación

¡Prueba la aplicación y explora la documentación técnica completa!

* 🌍 **Documentación en Vivo**: [project-x-nlp-team-3.netlify.app](https://project-x-nlp-team-3.netlify.app)
* 📖 **Encyclopédie Profonde (DeepWiki)**: Para búsquedas semánticas y profundas en la base de código del proyecto, visita nuestra DeepWiki: [https://deepwiki.com/Bootcamp-IA-P4/project-x-nlp-team-3](https://deepwiki.com/Bootcamp-IA-P4/project-x-nlp-team-3)

## ✨ Características Principales

* 🤖 **Enfoque de Modelo Dual**:
  * **Clasificación Rápida**: Un modelo de ML (Logistic Regression + TF-IDF) para una detección de toxicidad binaria y eficiente.
  * **Análisis Profundo**: Un modelo Transformer (DistilBERT) para un análisis de sentimiento contextual (Positivo/Negativo).
* ⚡ **API de Alto Rendimiento**: Construida con FastAPI, ofrece endpoints asíncronos para servir los modelos de IA.
* 🐳 **Totalmente Contenerizado**: Usa Docker y Docker Compose para empaquetar y ejecutar los servicios de backend y frontend, garantizando la consistencia y facilidad de despliegue.
* 🗣️ **Recolección de Datos Reales**: Integra la API de YouTube v3 para obtener y analizar comentarios de cualquier video.
* 💾 **Persistencia de Datos**: Utiliza Supabase (PostgreSQL) para el almacenamiento de datos, gestionado a través del ORM SQLAlchemy.
* 🔄 **CI/CD para Documentación**: Un flujo de trabajo de GitHub Actions construye y despliega automáticamente la documentación en GitHub Pages.
* 📚 **Documentación Exhaustiva**: Sitio de documentación creado con MkDocs y Material for MkDocs, que detalla cada aspecto del proyecto.

## 🏗️ Arquitectura y Flujo del Proyecto

El sistema está diseñado con componentes desacoplados que interactúan a través de APIs, siguiendo las mejores prácticas de la ingeniería de software y MLOps.

```mermaid
graph TD
    subgraph "Usuario Final & Desarrollador"
        U[👨‍💻 Usuario/Cliente API]
    end
    
    subgraph "Capa de Presentación (Frontend)"
        F[🌐 Cliente Web/UI]
    end
    
    subgraph "Contenedores de Servicios (Docker Compose)"
        subgraph "Servicio Backend"
            B[🐳 Contenedor Backend] --> API[⚡ FastAPI Server] ;
        end
        subgraph "Servicio Frontend"
            C[🐳 Contenedor Frontend] --> F;
        end
    end
    
    subgraph "Lógica de Aplicación (Dentro del Contenedor Backend)"
        API --> RT[🔄 Enrutador de API];
        RT --> P[📝 Preprocesamiento de Texto];
        RT --> DB[💾 Lógica de Base de Datos];
        RT --> YT[🎬 API de YouTube];
        P --> M1[🤖 Modelo ML Supervisado];
        P --> M2[🧠 Modelo Transformer];
        DB --> SUPA[🐘 Supabase/PostgreSQL];
        YT --> GAPI[<-- Google API -->];
    end
    
    subgraph "CI/CD & Infraestructura de Código (GitHub)"
        REPO[🐙 Repositorio GitHub];
        REPO -- Push en 'main' --> GHA[🔄 GitHub Actions];
        GHA -- Construye y Despliega --> DOCS[📚 Sitio de Documentación];
    end
    
    U --> F;
    U -- Petición API --> B;
    F -- Petición HTTP --> B;
    B -- Respuesta JSON --> F;
    B -- Respuesta JSON --> U;
    
    style F fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#add,stroke:#333,stroke-width:2px
    style C fill:#add,stroke:#333,stroke-width:2px
    style GHA fill:#f0ad4e,stroke:#333,stroke-width:2px
```

## 🛠️ Stack Tecnológico

| Área                  | Tecnología                         | Propósito                                                                 |
|-----------------------|------------------------------------|---------------------------------------------------------------------------|
| **Backend**           | `Python`, `FastAPI`, `Uvicorn`     | Creación de la API RESTful de alto rendimiento.                           |
| **Frontend**          | `HTML5`, `CSS3`, `JavaScript`      | Interfaz de usuario para la interacción con el sistema.                   |
| **Contenerización**   | `Docker`, `Docker Compose`         | Empaquetar y orquestar los servicios de la aplicación.                    |
| **Machine Learning**  | `Scikit-learn`, `Joblib`           | Entrenamiento y servicio del modelo de clasificación rápida.              |
| **Deep Learning**     | `PyTorch`, `Transformers (Hugging Face)` | Carga y servicio del modelo de análisis de sentimiento profundo.          |
| **Base de Datos**     | `Supabase (PostgreSQL)`, `SQLAlchemy` | Almacenamiento y gestión de los comentarios.                              |
| **Procesamiento de Texto** | `Pandas`, `NumPy`, `NLTK`, `Emoji` | Limpieza, preprocesamiento y manipulación de datos de texto.              |
| **APIs Externas**     | `Google API Python Client`         | Interacción con la API de datos de YouTube.                               |
| **Documentación**     | `MkDocs`, `Material for MkDocs`    | Creación del sitio de documentación técnica.                              |
| **CI/CD**             | `GitHub Actions`                   | Automatización del despliegue de la documentación.                        |
| **Experimentación**   | `MLflow`                           | Seguimiento de experimentos, métricas y modelos.                          |

## ⚙️ Instalación y Puesta en Marcha

Sigue estos pasos para tener el proyecto funcionando en tu entorno local.

### Prerrequisitos
* Git
* Python 3.12+
* Docker & Docker Compose
* Node.js & npm (solo para la ejecución manual del frontend)

### Configuración del Entorno
1. Clona el repositorio:

```bash
git clone https://github.com/jdomdev/project-x-nlp-team-3.git
cd project-x-nlp-team-3
```

2. Crea el archivo de entorno:
   Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales. Debe contener, como mínimo:

```bash
SUPABASE_URL="tu_url_de_supabase"
SUPABASE_KEY="tu_api_key_de_supabase"
YOUTUBE_API_KEY="tu_api_key_de_youtube"
DATABASE_URL="postgresql://usuario:password@host:puerto/basededatos"
```

### Ejecución con Docker (Recomendado)
Este es el método más sencillo y fiable. Levanta toda la aplicación con un solo comando:

```bash
docker-compose up --build
```

* El Backend API estará disponible en http://localhost:8000.
* El Frontend estará disponible en http://localhost:5173.

### Ejecución Manual (Alternativa)
#### Backend

```bash
# Activa el entorno virtual (si lo usas)
# source .venv/bin/activate

# Instala dependencias
pip install -r requirements.txt

# Inicia el servidor
uvicorn server.api.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
# Navega a la carpeta del cliente
cd client

# Instala dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

## ▶️ Cómo Usar la Aplicación
Una vez en marcha, puedes interactuar con el sistema de dos maneras:
1. **Interfaz Web**: Abre http://localhost:5173 en tu navegador para usar la interfaz gráfica.
2. **API Directa**: Envía peticiones HTTP a los endpoints del backend en http://localhost:8000. Consulta la [documentación de la API](https://project-x-nlp-team-3.netlify.app/api/endpoints) para más detalles.

## 📊 Modelos de Inteligencia Artificial
Este proyecto utiliza un enfoque híbrido para ofrecer flexibilidad y rendimiento.

### Enfoque 1: Machine Learning Supervisado (Clasificación Rápida)
* **Endpoint**: `/predict`
* **Tecnología**: Scikit-learn (ej. LogisticRegression) + TF-IDF.
* **Proceso**: El texto se convierte en un vector numérico usando TF-IDF, que mide la importancia de cada palabra. Luego, un modelo de ML clásico, ligero y rápido, realiza una clasificación binaria (Tóxico/No Tóxico).
* **Ideal para**: Clasificación masiva y rápida donde solo se necesita una respuesta binaria.

### Enfoque 2: Modelo Transformer (Análisis Profundo)
* **Endpoint**: `/analyze`
* **Tecnología**: DistilBERT desde Hugging Face.
* **Proceso**: Utiliza un modelo de Deep Learning pre-entrenado que entiende el contexto y los matices del lenguaje. Proporciona una clasificación de sentimiento más detallada (Positivo/Negativo) con un puntaje de confianza.
* **Ideal para**: Un análisis más profundo y preciso de comentarios individuales.

## 🔌 Endpoints de la API
La API expone varios endpoints para la interacción. Aquí están los principales:

| Método | Endpoint                       | Descripción                                                                 |
|--------|--------------------------------|-----------------------------------------------------------------------------|
| `POST` | `/predict`                     | Realiza una predicción de toxicidad rápida (Tóxico/No Tóxico).              |
| `POST` | `/analyze`                     | Realiza un análisis de sentimiento profundo (Positivo/Negativo).            |
| `GET`  | `/comments/{video_id}`         | Obtiene comentarios de un video desde la base de datos.                     |
| `GET`  | `/youtube_comments/{video_id}` | Obtiene comentarios frescos directamente desde la API de YouTube.           |

Para una descripción completa de los cuerpos de las peticiones y las respuestas, visita la [Referencia de la API](https://project-x-nlp-team-3.netlify.app/api/endpoints).

## 🔄 CI/CD y Automatización
* **Generación de Documentación**: Cada vez que se hace un push a la rama main, una GitHub Action se activa, instala MkDocs, construye el sitio de documentación y lo despliega en GitHub Pages.
* **Gestión de Proyectos**: Se utiliza una Action para convertir automáticamente las "Draft Issues" de un tablero de proyecto de GitHub en issues formales, agilizando la gestión de tareas.

## 🤝 Contribuciones
Las contribuciones son el corazón del código abierto. Si deseas mejorar este proyecto, por favor sigue estos pasos:
1. Haz un Fork del repositorio.
2. Crea una rama para tu nueva funcionalidad (`git checkout -b feature/AmazingFeature`).
3. Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Haz Push a tu rama (`git push origin feature/AmazingFeature`).
5. Abre una Pull Request.

## 📜 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## 🙏 Agradecimientos
* Al equipo del Bootcamp de IA por su invaluable guía y apoyo.
* A la comunidad de Hugging Face por democratizar el acceso a los modelos Transformer.
* A los creadores de todas las librerías y herramientas de código abierto que han hecho posible este proyecto.
