# Gestión y Estructura de Datos

El éxito de cualquier proyecto de Machine Learning depende fundamentalmente de la calidad y la correcta gestión de los datos. En este proyecto, se ha prestado especial atención a la recolección, limpieza y estructuración de los datos de comentarios de YouTube.

## Estructura de Carpetas

Los datos del proyecto se organizan en dos directorios principales dentro de la raíz:

-   **`data/`**: Contiene los datos brutos y procesados utilizados durante la fase de análisis y entrenamiento.
    -   `data/comments/all_comments.csv`: Datos brutos extraídos.
    -   `data/processed/comments_data_clean.csv`: Datos limpios después del preprocesamiento inicial.
    -   `data/videos/videos_metadata.csv`: Metadatos de los vídeos de los que se extrajeron comentarios.

-   **`Data/`**: Este directorio contiene los datasets finales y curados, listos para ser consumidos por los notebooks de entrenamiento.
    -   `Data/fusion30.csv`: El dataset principal utilizado para el entrenamiento de la mayoría de los modelos. Es una fusión de varias fuentes de datos para crear un conjunto de datos balanceado y representativo.
    -   `Data/comments_data_clean.csv`: Una versión limpia y preparada del dataset.
    -   `Data/nationalist_comments.csv`: Un subconjunto de datos específico que podría ser utilizado para análisis más detallados sobre ciertos tipos de toxicidad.

## Descripción de los Archivos CSV Clave

### `fusion30.csv`

Este es el dataset más importante para el modelado. Contiene las siguientes columnas relevantes:

-   **`text`**: El contenido textual del comentario de YouTube.
-   **`label`** (o `result`): La etiqueta de clasificación, donde `1` representa un comentario tóxico y `0` uno no tóxico.

### `comments_data_clean.csv`

Similar a `fusion30.csv`, este archivo es el resultado de uno de los pipelines de limpieza y contiene texto listo para ser vectorizado.

-   **`Text`**: El texto del comentario.
-   **`IsToxic`**: La etiqueta de toxicidad.

## Proceso de Obtención y Limpieza

1.  **Recolección**: Los datos fueron recolectados utilizando la API de YouTube y scripts personalizados (`scripts/fetch_*.py`) para obtener comentarios de una variedad de vídeos.
2.  **Limpieza y Preprocesamiento**: Se aplicaron extensas técnicas de limpieza (descritas en las secciones de los modelos) para normalizar el texto, eliminar ruido y prepararlo para el entrenamiento.
3.  **Fusión y Balanceo**: Se combinaron diferentes fuentes de datos y se aplicaron técnicas de aumento de datos para asegurar que los modelos fueran entrenados con un dataset lo más balanceado y robusto posible.
