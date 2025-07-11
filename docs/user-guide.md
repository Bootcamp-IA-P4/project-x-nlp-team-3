# Guía de Uso de la Aplicación

Esta guía describe cómo utilizar las funcionalidades principales de la aplicación web para la detección de comentarios tóxicos.

## 1. Analizar un Comentario Individual

Esta funcionalidad te permite obtener una clasificación de toxicidad para cualquier texto que desees analizar.

1.  **Navega a la sección "Análisis de Comentario"** en la página principal.
2.  **Introduce el texto** que deseas analizar en el área de texto.
3.  **Haz clic en el botón "Analizar"**.
4.  **Espera unos segundos**. La aplicación enviará el texto al backend, donde el modelo de IA lo procesará.
5.  **Visualiza el resultado**. Debajo del área de texto, aparecerá una tarjeta con la clasificación (`Tóxico` o `No Tóxico`) y el nivel de confianza (probabilidad) de la predicción.

## 2. Analizar los Comentarios de un Vídeo de YouTube

Esta funcionalidad te permite evaluar la toxicidad de los comentarios de un vídeo de YouTube completo.

1.  **Navega a la sección "Análisis de Vídeo"**.
2.  **Copia la URL completa** del vídeo de YouTube que quieres analizar.
3.  **Pega la URL** en el campo de entrada.
4.  **Haz clic en el botón "Analizar Vídeo"**.
5.  **El proceso puede tardar un poco más**, ya que el backend necesita:
    a. Conectarse a la API de YouTube.
    b. Descargar los primeros ~200 comentarios.
    c. Analizar cada uno de ellos individualmente.
6.  **Visualiza los resultados**. Aparecerá una tabla o lista con los comentarios del vídeo. Cada comentario estará acompañado de su clasificación de toxicidad, permitiéndote identificar rápidamente el contenido problemático.

## 3. Historial de Análisis

La aplicación guarda un registro de todos los análisis realizados.

1.  **Navega a la sección "Historial"** (si está disponible en la interfaz).
2.  Aquí podrás ver una lista de los análisis previos, tanto de comentarios individuales como de vídeos, con sus respectivos resultados. Esta información se obtiene directamente de la base de datos Supabase.
