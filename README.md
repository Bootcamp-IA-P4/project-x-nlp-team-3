# 🚀 Project X: Detección de Toxicidad en YouTube con IA 

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-20.10-blue.svg?logo=docker)](https://www.docker.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com/)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Transformers-orange)](https://huggingface.co/transformers/)

Una solución Full-Stack para el análisis y detección de toxicidad en comentarios de YouTube, utilizando un pipeline de MLOps desde la recolección de datos hasta el despliegue de modelos de Machine Learning y Deep Learning.

Este proyecto implementa un sistema robusto capaz de clasificar comentarios de YouTube como "Tóxicos" o "No Tóxicos". Utiliza un enfoque dual, combinando un modelo de Machine Learning clásico para una clasificación rápida y un modelo Transformer avanzado para un análisis de sentimiento más profundo. Todo el sistema se sirve a través de una API RESTful de alto rendimiento y está completamente contenerizado con Docker para garantizar la portabilidad y escalabilidad.

---

##  Tabla de Contenidos

* [ Demo en Vivo y Documentación](#-demo-en-vivo-y-documentación)
* [✨ Características Principales](#-características-principales)
* [️ Arquitectura y Flujo del Proyecto](#️-arquitectura-y-flujo-del-proyecto)
* [️ Stack Tecnológico](#️-stack-tecnológico)
* [⚙️ Instalación y Puesta en Marcha](#️-instalación-y-puesta-en-marcha)
  * [Prerrequisitos](#prerrequisitos)
  * [Configuración del Entorno](#configuración-del-entorno)
  * [Ejecución con Docker (Recomendado)](#ejecución-con-docker-recomendado)
  * [Ejecución Manual (Alternativa)](#ejecución-manual-alternativa)
* [▶️ Cómo Usar la Aplicación](#️-cómo-usar-la-aplicación)
* [ Modelos de Inteligencia Artificial](#-modelos-de-inteligencia-artificial)
  * [Enfoque 1: Machine Learning Supervisado (Clasificación Rápida)](#enfoque-1-machine-learning-supervisado-clasificación-rápida)
  * [Enfoque 2: Modelo Transformer (Análisis Profundo)](#enfoque-2-modelo-transformer-análisis-profundo)
* [ MLOps y Despliegue de Modelos](#-mlops-y-despliegue-de-modelos)
* [ Endpoints de la API](#-endpoints-de-la-api)
* [ CI/CD y Automatización](#-cicd-y-automatización)
* [ Contribuciones](#-contribuciones)
* [ Licencia](#-licencia)
* [ Agradecimientos](#-agradecimientos)

---

##  🌐 Demo en Vivo y Documentación

¡Prueba la aplicación y explora la documentación técnica completa!

* 🌍 **Documentación en Vivo**: [(https://project-x-nlp-team-3.netlify.app)](https://resonant-hotteok-331ed1.netlify.app/)
* 📖 **Encyclopédie Profonde (DeepWiki)**: Para búsquedas semánticas y profundas en la base de código del proyecto, visita nuestra DeepWiki: [https://deepwiki.com/Bootcamp-IA-P4/project-x-nlp-team-3](https://deepwiki.com/Bootcamp-IA-P4/project-x-nlp-team-3)

## ✨ Características Principales

* 🤖 **Enfoque de Modelo Dual**:
  * **Clasificación Rápida**: Un modelo de ML (Naive Bayes + TF-IDF) para una detección de toxicidad binaria y eficiente.
  * **Análisis Profundo**: Un modelo Transformer (DeBERTa) para un análisis de sentimiento contextual (Positivo/Negativo).
* ⚡ **API de Alto Rendimiento**: Construida con FastAPI, ofrece endpoints asíncronos para servir los modelos de IA.
* 🐳 **Totalmente Contenerizado**: Usa Docker y Docker Compose para empaquetar y ejecutar los servicios de backend y frontend, garantizando la consistencia y facilidad de despliegue.
* 🗣**Recolección de Datos Reales**: Integra la API de YouTube v3 para obtener y analizar comentarios de cualquier video.
* 💾 **Persistencia de Datos**: Utiliza Supabase (PostgreSQL) para el almacenamiento de datos, gestionado a través del ORM SQLAlchemy.
* 🔄 **CI/CD para Documentación**: Un flujo de trabajo de GitHub Actions construye y despliega automáticamente la documentación en GitHub Pages.
* 📚 **Documentación Exhaustiva**: Sitio de documentación creado con MkDocs y Material for MkDocs, que detalla cada aspecto del proyecto.

## ️🏗️ Arquitectura y Flujo del Proyecto

El sistema está diseñado con componentes desacoplados que interactúan a través de APIs, siguiendo las mejores prácticas de la ingeniería de software y MLOps.


```mermaid
graph TD
    subgraph "Usuario Final & Desarrollador"
        U[‍ Usuario/Cliente API]
    end
    
    subgraph "Capa de Presentación (Frontend)"
        F[ Cliente Web/UI]
    end
    
    subgraph "Contenedores de Servicios (Docker Compose)<img width="512" height="512" alt="social_15466088" src="https://github.com/user-attachments/assets/93ea1f02-3b69-4c3f-a95d-9376b97bca99" />
"
        %% Espacio para evitar que el título del subgráfico padre sea tapado
        
        subgraph "Servicio Backend"
            B[ Contenedor Backend] --> API[⚡ FastAPI Server] ;
        end
        
        %% Más espacio para empujar el subgráfico de Frontend hacia abajo
        
        subgraph "Servicio Frontend"
            C[ Contenedor Frontend] --> F;
        end
    end
    
    subgraph "Lógica de Aplicación (Dentro del Contenedor Backend)<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/225086fa-1839-4247-ac11-dec5b9e16d7c" />"
        %% Espacio para empujar los nodos hacia abajo y evitar que el título del subgráfico sea tapado
        
        API --> RT[🔄 Enrutador de API];
        RT --> P[📝 Preprocesamiento de Texto];
        RT --> DB[💾 Lógica de Base de Datos];
        RT --> YT[🎬 API de YouTube];
        P --> M1[🤖 Modelo ML Supervisado];
        P --> M2[🧠 Modelo Transformer];
        DB --> SUPA[🐘 Supabase/PostgreSQL];
        YT --> GAPI[<-- Google API -->];
    end
    
    
    subgraph "CI/CD & Infraestructura de Código (GitHub)<img width="512" height="512" alt="image" src="https://github.com/user-attachments/assets/de8cc36c-f755-4852-82e3-e856d85f4852" />"
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
----
## ️ Stack Tecnológico

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

##  📊 Modelos de Inteligencia Artificial
Este proyecto utiliza un enfoque híbrido para ofrecer flexibilidad y rendimiento.

### Enfoque 1: Machine Learning Supervisado (Clasificación Rápida)
*   **Modelo**: `Multinomial Naive Bayes` optimizado.
*   **Tecnología**: `Scikit-learn` y `Joblib` para la serialización.
*   **Preprocesamiento**: Se aplica un pipeline que incluye `CountVectorizer` para la vectorización del texto, transformando los comentarios en una representación numérica basada en la frecuencia de las palabras. El texto pasa por una limpieza exhaustiva (eliminación de URLs, emojis, menciones, hashtags, puntuación irrelevante) y lematización para normalizar las palabras a su forma base.
*   **Proceso**: Este modelo, ligero y eficiente, realiza una clasificación binaria (`Tóxico`/`No Tóxico`). Es ideal para escenarios que requieren una respuesta rápida y un bajo consumo de recursos.
*   **Endpoint**: `/predict_ml`

### Enfoque 2: Modelo Transformer (Análisis Profundo)
*   **Modelo**: `DeBERTa` (Decoupled Attention Mechanism for Transformers) de Hugging Face.
*   **Tecnología**: `PyTorch` y la librería `Transformers` de Hugging Face.
*   **Preprocesamiento**: Similar al modelo de ML, el texto se limpia y lematiza. Luego, se tokeniza utilizando `AutoTokenizer` (compatible con DeBERTa) para preparar la entrada para el modelo Transformer, asegurando que se manejen adecuadamente los matices contextuales del lenguaje.
*   **Proceso**: Este modelo de Deep Learning pre-entrenado es capaz de capturar relaciones contextuales complejas y matices semánticos en el texto. Proporciona un análisis de sentimiento más detallado, ofreciendo una clasificación (`Positivo`/`Negativo`) junto con un puntaje de confianza. Es adecuado para un análisis más profundo y preciso de comentarios individuales.
*   **Endpoint**: `/predict_nlp`

##  MLOps y Despliegue de Modelos
La integración de los modelos en la API se realiza de manera robusta y escalable:
*   **Carga de Modelos**: Ambos modelos (`pipeline_multinomial_nb.pkl` y el modelo `DeBERTa` guardado en `model_transformer`) se cargan al iniciar la aplicación FastAPI, asegurando que estén listos para la inferencia.
*   **Servicio de Predicciones**: FastAPI expone endpoints asíncronos (`/predict_ml` y `/predict_nlp`) que permiten a los clientes interactuar con los modelos de manera eficiente.
*   **Contenerización**: La aplicación completa, incluyendo los modelos y sus dependencias, se empaqueta en contenedores Docker. Esto garantiza un entorno de ejecución consistente y facilita el despliegue en cualquier infraestructura compatible con Docker.

##  🔌 Endpoints de la API
La API expone varios endpoints para la interacción. Aquí están los principales:

| Método | Endpoint                       | Descripción                                                                 |
|--------|--------------------------------|-----------------------------------------------------------------------------|
| `POST` | `/predict_ml`                  | Realiza una predicción de toxicidad rápida (Tóxico/No Tóxico) usando el modelo Naive Bayes. |
| `POST` | `/predict_nlp`                 | Realiza un análisis de sentimiento profundo (Positivo/Negativo) usando el modelo DeBERTa. |
| `GET`  | `/comments/{video_id}`         | Obtiene comentarios de un video desde la base de datos.                     |
| `GET`  | `/youtube_comments/{video_id}` | Obtiene comentarios frescos directamente desde la API de YouTube.           |

Para una descripción completa de los cuerpos de las peticiones y las respuestas, visita la [Referencia de la API](https://project-x-nlp-team-3.netlify.app/api/endpoints).

##  🔄 CI/CD y Automatización
* **Generación de Documentación**: Cada vez que se hace un push a la rama main, una GitHub Action se activa, instala MkDocs, construye el sitio de documentación y lo despliega en GitHub Pages.
* **Gestión de Proyectos**: Se utiliza una Action para convertir automáticamente las "Draft Issues" de un tablero de proyecto de GitHub en issues formales, agilizando la gestión de tareas.

##  Contribuciones
Las contribuciones son el corazón del código abierto. Si deseas mejorar este proyecto, por favor sigue estos pasos:
1. Haz un Fork del repositorio.
2. Crea una rama para tu nueva funcionalidad (`git checkout -b feature/AmazingFeature`).
3. Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Haz Push a tu rama (`git push origin feature/AmazingFeature`).
5. Abre una Pull Request.

##  Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

##  Agradecimientos
* Al equipo del Bootcamp de IA por su invaluable guía y apoyo.
* A la comunidad de Hugging Face por democratizar el acceso a los modelos Transformer.
* A los creadores de todas las librerías y herramientas de código abierto que han hecho posible este proyecto.


## 📊 Retrospectiva Final de Proyecto 🚀

¡Felicidades por finalizar el proyecto de detección de mensajes de odio en YouTube\! Es momento de reflexionar sobre todo el camino recorrido, aprender de nuestras experiencias y crecer como equipo.

**Objetivo:** Identificar qué funcionó muy bien, qué podríamos mejorar y qué aprendizajes clave nos llevamos para futuros proyectos.



| 🧑‍💻 **Miembro del Equipo** | 🟢 **Lo que Funcionó Bien** (¡Éxitos y Acerdos\!) 🥳 | 🟡 **Lo que Podríamos Mejorar** (Oportunidades de Crecimiento) 🤔 | 🔴 **Aprendizajes Clave & Acciones a Futuro** (Lecciones Aprendidas) 🧠 |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [mikewig](https://github.com/mikewig) (Fullstack Dev, DevOps) | Me ha gustado mucho la química con el equipo, todo ha ido de maravilla en cuanto al proyecto | Diría que seleccionar bien el rol de cada uno, ya que al principio escogí un rol pero termine haciendo otras cosas además de eso | Aprendí un poco de front-end y back-end, lo cual me alegra ya que sobre todo en front no tenia mucho conocimiento acerca de esto |
| [Jorgeluuu](https://github.com/Jorgeluuu) (ML Engineer) | Me ha sorprendido gratamente la sinergia de todo el equipo, la coordinación que hemos tenido en todo momento para completar cada objetivo. | Siento que nos hemos compenetrado muy bien entre todos, abarcando todos los puntos claves del proyecto gracias a la definición de roles que hemos tenido. Por lo que no siento nada en lo que hacer hincapié | Me quedo con las Pull Request, ya no solo para saber lo que ha ido haciendo cada uno, sino a la hora de realizar los mergeos de ramas, ya sea de una misma rama o a distintas ramas. |
| [abbyenredes](https://github.com/abbyenredes) (Data Analyst, DevOps) | Buena sinergia en el equipo, completamos la mayoría de objetivos | No siento que haya nada relevante, me parece que abarcamos bien cada uno el proyecto con roles muy bien definidos | Las PR, son una maravilla a la hora de hacer merge|
| [mr-melenas](https://github.com/mr-melenas) (ML Engineer, DevOps) |la velocidad para conseguir los objetivos de forma continuada |un poco mas de tiempo para haber experimentado con trnasformers mas complejos | |
| [jdomdev](https://github.com/jdomdev) (Scrum Master, BackendDev) | La implementación de módulos del proyecto y su integración | Haber llevado un registro más detallado de los Sprints | Uso e implementación de Tranformers, despliegue documentación y Pipeline |

