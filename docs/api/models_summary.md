# Modelos de IA en la Aplicación

La aplicación está diseñada para ser flexible y permitir el uso de diferentes modelos de IA entrenados. La selección del modelo se gestiona en el backend y puede ser configurada para utilizar la mejor opción disponible según los requisitos de rendimiento y precisión.

Actualmente, la aplicación integra y da soporte a dos modelos principales que representan diferentes niveles de complejidad y enfoques tecnológicos.

## 1. Modelo de Machine Learning Supervisado

-   **Nombre del Modelo**: **Multinomial Naive Bayes Optimizado**
-   **Descripción**: Este es un modelo de Machine Learning clásico, altamente eficiente y efectivo para la clasificación de texto. Se basa en el teorema de Bayes y es particularmente bueno con características de conteo, como las generadas por `CountVectorizer`.
-   **Uso en la App**: Este modelo representa una solución **ligera y rápida**. Es ideal para entornos con recursos limitados o cuando la velocidad de inferencia es una prioridad. Ofrece un excelente punto de partida con un rendimiento sólido.
-   **Artefacto**: El modelo se carga desde el archivo `pipeline_multinomial_nb.pkl`, que contiene tanto el vectorizador como el clasificador entrenado.

## 2. Modelo Transformer

-   **Nombre del Modelo**: **DeBERTa (Decoding-enhanced BERT with disentangled attention)**
-   **Descripción**: DeBERTa es un modelo Transformer de última generación que mejora a arquitecturas como BERT y RoBERTa. Su mecanismo de atención desvinculada le permite capturar de manera más efectiva las dependencias semánticas entre las palabras, resultando en una mayor precisión.
-   **Uso en la App**: Este modelo representa la solución de **máximo rendimiento**. Se utiliza cuando la precisión de la clasificación es el factor más importante, incluso si ello implica un mayor coste computacional y un tiempo de inferencia ligeramente superior.
-   **Artefacto**: El modelo se carga desde la carpeta `models/model_transformer/`, que contiene todos los archivos necesarios (configuración, pesos, tokenizador) para su funcionamiento.

## Selección del Modelo Activo

La lógica para seleccionar qué modelo se utiliza en las predicciones se encuentra en el archivo `server/pipeline.py`. Modificando este archivo, se puede cambiar fácilmente entre el modelo Naive Bayes y el modelo DeBERTa, permitiendo al equipo de desarrollo elegir el balance adecuado entre velocidad y precisión para el entorno de producción.
