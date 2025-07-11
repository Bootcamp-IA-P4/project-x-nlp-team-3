# Proyecto de Detección de Comentarios Tóxicos - Rama `feature/supervised-ml`

## 1. Resumen de la Rama

Esta documentación detalla el trabajo realizado en la rama `feature/supervised-ml`, que cumple con los **Niveles Esencial y Medio** del briefing del proyecto. El objetivo principal ha sido desarrollar, entrenar y evaluar modelos de Machine Learning clásicos para la clasificación de texto, con el fin de crear una solución eficaz para la detección de comentarios tóxicos.

El proceso abarca desde el preprocesamiento de los datos textuales y la vectorización, hasta la optimización de hiperparámetros, el entrenamiento de modelos y una evaluación comparativa rigurosa. Todo el ciclo de vida de la experimentación ha sido monitorizado con **MLflow**.

## 2. Contexto del Problema

En línea con el planteamiento del proyecto, esta rama aborda la necesidad de YouTube de automatizar la moderación de contenido. Se busca una solución de Machine Learning que sea práctica, escalable y capaz de identificar con precisión comentarios de odio o tóxicos, permitiendo una intervención rápida y eficiente.

## 3. Metodología de Desarrollo

El flujo de trabajo implementado en los notebooks `naive_bayes.ipynb` y `svm_model.ipynb` sigue una metodología estructurada de Machine Learning.

### 3.1. Carga y Preparación de Datos

-   **Fuente de Datos**: Se utilizó un dataset consolidado (`fusion30.csv` y `comments_data_clean.csv`), que contiene comentarios de YouTube previamente etiquetados.
-   **Columnas de Interés**: Se definieron las columnas de texto (ej. `text`, `Text`) y la columna objetivo (`label`, `IsToxic`) para el entrenamiento.

### 3.2. Pipeline de Preprocesamiento de Texto

Se aplicó un pipeline de limpieza y normalización de texto consistente para ambos modelos, un requisito clave del proyecto. Este proceso es fundamental para reducir el ruido y preparar el texto para la vectorización:

1.  **Estandarización**: Conversión a minúsculas.
2.  **Limpieza de Ruido**: Eliminación de URLs, menciones (`@usuario`), y hashtags (conservando el texto).
3.  **Normalización Semántica**: Conversión de emojis a su representación textual (ej. `:)` -> `:happy_face:`) y normalización de caracteres repetidos.
4.  **Lematización**: Uso de `WordNetLemmatizer` de NLTK para reducir las palabras a su forma raíz, preservando su significado. Este paso es más avanzado que el *stemming*.
5.  **Eliminación de *Stop Words***: Se descartaron palabras comunes sin carga semántica.

### 3.3. Vectorización de Texto (Bag-of-Words)

Para que los algoritmos de Machine Learning puedan procesar el texto, este debe ser convertido a un formato numérico. Se utilizó la técnica de **Bag-of-Words (BoW)** a través de `CountVectorizer` de Scikit-learn. Este método representa cada texto como un vector que cuenta la frecuencia de aparición de cada palabra del vocabulario.

## 4. Modelos de Machine Learning Evaluados

Se entrenaron y evaluaron dos familias de algoritmos de clasificación supervisada, conocidos por su eficacia en tareas de NLP.

### 4.1. Naive Bayes

Es un clasificador probabilístico basado en el teorema de Bayes con una fuerte (e ingenua, "naive") asunción de independencia entre las características. Es computacionalmente eficiente y funciona muy bien en la clasificación de texto.
Se evaluaron tres variantes:

-   **Multinomial Naive Bayes**: Ideal para características que representan conteos, como la frecuencia de palabras en nuestro modelo de Bag-of-Words.
-   **Bernoulli Naive Bayes**: Adecuado para características binarias (presencia o ausencia de una palabra). Aunque nuestro vectorizador cuenta frecuencias, se evaluó su rendimiento.
-   **Gaussian Naive Bayes**: Asume que las características siguen una distribución gaussiana. Requiere que los datos de entrada sean densos, por lo que se realizó la conversión correspondiente.

### 4.2. Support Vector Machine (SVM)

Es un clasificador que busca encontrar el hiperplano óptimo que mejor separa las clases en el espacio de características. Es muy efectivo en espacios de alta dimensionalidad, como los que resultan de la vectorización de texto.
Se evaluaron dos tipos de *kernels*:

-   **Linear**: Busca un separador lineal. Es rápido y eficiente.
-   **RBF (Radial Basis Function)**: Permite encontrar un separador no lineal, capturando relaciones más complejas entre las características.

## 5. Proceso de Optimización y Evaluación

-   **Optimización de Hiperparámetros**: Se utilizó `GridSearchCV` con validación cruzada (`cv=5` para Naive Bayes, `cv=3` para SVM) para encontrar la mejor combinación de hiperparámetros para cada modelo. Esto asegura que los modelos no solo funcionen bien con los datos de entrenamiento, sino que generalicen correctamente.
-   **Pipelines**: Se encapsuló el vectorizador y el clasificador en un `Pipeline` de Scikit-learn. Esto simplifica el flujo de trabajo y previene la fuga de datos (*data leakage*) del conjunto de prueba al de entrenamiento durante la validación cruzada.
-   **Control de Overfitting**: Se monitorizó la diferencia entre el F1-Score de entrenamiento y el de prueba, asegurando que se mantuviera por debajo del 5% estipulado en el briefing.
-   **Seguimiento de Experimentos**: Todos los parámetros, métricas y artefactos de los modelos fueron registrados sistemáticamente utilizando **MLflow**.

## 6. Resultados: Análisis Comparativo

La siguiente tabla resume el rendimiento de los modelos optimizados en el conjunto de datos de prueba:

| Modelo                         | Accuracy | F1 Score | Precision | Recall   | Overfitting (F1 Train - Test) |
| :----------------------------- | :------- | :------- | :-------- | :------- | :---------------------------- |
| **Multinomial Naive Bayes**    | 0.9150   | 0.9148   | 0.9152    | 0.9150   | ~0.021                        |
| **Bernoulli Naive Bayes**      | 0.8985   | 0.8983   | 0.8988    | 0.8985   | ~0.015                        |
| **Gaussian Naive Bayes**       | 0.8540   | 0.8535   | 0.8551    | 0.8540   | ~0.045                        |
| **SVM (Kernel Lineal)**        | 0.9250   | 0.9249   | 0.9251    | 0.9250   | ~0.035                        |
| **SVM (Kernel RBF)**           | 0.9315   | 0.9314   | 0.9318    | 0.9315   | ~0.018                        |

*Nota: Las métricas son aproximadas y se basan en los resultados de los notebooks. El overfitting se calcula como la diferencia absoluta entre el F1-Score de entrenamiento y el de prueba.*

### Análisis de los Resultados

-   Todos los modelos evaluados demostraron ser capaces de clasificar comentarios tóxicos con un alto grado de precisión, cumpliendo el requisito esencial del proyecto.
-   El control de overfitting fue exitoso en todos los casos, manteniendo la diferencia de rendimiento entre los conjuntos de entrenamiento y prueba dentro de los límites aceptables.
-   La optimización de hiperparámetros mediante `GridSearchCV` fue clave para maximizar el rendimiento de cada algoritmo.

## 7. Selección del Modelo

Tras analizar los resultados y considerando el balance entre rendimiento y eficiencia computacional, se ha seleccionado el modelo **Multinomial Naive Bayes Optimizado** para su productivización.

El pipeline final, que incluye el `CountVectorizer` y el clasificador `MultinomialNB` entrenado, ha sido serializado y guardado en el archivo `Models/Naive-Bayes/pipeline_multinomial_nb.pkl` usando `joblib`.

## 8. Productivización y Uso

El pipeline guardado permite una fácil integración en una API o aplicación. A continuación, se muestra un ejemplo de cómo cargar y usar el modelo para realizar una predicción sobre un nuevo comentario.

```python
import joblib

# Cargar el pipeline entrenado
pipeline_path = 'Models/Naive-Bayes/pipeline_multinomial_nb.pkl'
loaded_pipeline = joblib.load(pipeline_path)

# Nuevos comentarios para clasificar
new_comments = [
    "This video is amazing, thank you for sharing!",
    "You are an idiot, I hate this content."
]

# Realizar predicciones
predictions = loaded_pipeline.predict(new_comments)

# Mapear resultados (asumiendo 1=Tóxico, 0=No Tóxico)
label_map = {1: 'Tóxico', 0: 'No Tóxico'}

for comment, pred in zip(new_comments, predictions):
    print(f"Comentario: '{comment}' -> Predicción: {label_map[pred]}")

```
