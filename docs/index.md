# Visión General del Proyecto: Detección de Comentarios Tóxicos con IA

## El Problema

YouTube, como una de las plataformas de contenido más grandes del mundo, enfrenta un desafío monumental: el crecimiento exponencial de comentarios de odio, spam y toxicidad. La moderación manual es ineficaz a esta escala, resultando costosa, lenta y psicológicamente agotadora para los moderadores. La necesidad de una solución automatizada, precisa y escalable es imperativa.

## Nuestra Solución

Este proyecto aborda directamente este problema mediante el diseño, desarrollo y despliegue de una **solución integral de Inteligencia Artificial** para la detección automática de comentarios tóxicos. Hemos construido una aplicación web full-stack que no solo sirve como una herramienta de demostración, sino como un prototipo funcional y práctico que productiviza modelos avanzados de Procesamiento del Lenguaje Natural (NLP).

## Objetivos Clave Alcanzados

-   **Análisis y Preprocesamiento de Datos**: Se ha realizado un análisis exhaustivo de los datos de comentarios de YouTube, seguido de la implementación de un robusto pipeline de limpieza y normalización de texto.
-   **Entrenamiento de Modelos Diversos**: Se han entrenado y evaluado rigurosamente tres familias de modelos, cubriendo diferentes niveles de complejidad y rendimiento:
    1.  **Machine Learning Clásico** (Naive Bayes, SVM).
    2.  **Redes Neuronales Densas** (Keras y PyTorch).
    3.  **Modelos Transformer de Vanguardia** (BERT, RoBERTa, DeBERTa).
-   **Productivización en una Aplicación Web**: Se ha desarrollado una aplicación con un frontend en **React** y un backend en **FastAPI** que permite:
    -   Analizar comentarios individuales en tiempo real.
    -   Analizar los comentarios de un vídeo de YouTube a partir de su URL.
-   **Persistencia de Datos**: Todos los resultados de los análisis se almacenan en una base de datos **Supabase** para su seguimiento y futura explotación.
-   **Documentación Exhaustiva**: Creación de una documentación técnica completa y navegable utilizando **MkDocs**.

## Navegación de la Documentación

Esta documentación está estructurada para guiarte a través de todos los aspectos del proyecto. Utiliza el menú de navegación para explorar las diferentes secciones:

-   **Guía de Instalación**: Instrucciones para configurar y ejecutar el proyecto en tu entorno local.
-   **Guía de Uso**: Cómo interactuar con la aplicación web.
-   **Arquitectura**: Un desglose detallado del frontend y el backend.
-   **API Endpoints**: Documentación técnica de la API del servidor.
-   **Modelos de IA**: Un análisis profundo de cada modelo entrenado.
-   **Gestión de Datos y Experimentación**: Información sobre los datasets y los notebooks de Jupyter utilizados.