# Proyecto de Detección de Comentarios Tóxicos - Rama `feature/nn`

## 1. Resumen de la Rama

Esta documentación corresponde a la rama `feature/nn`, cuyo objetivo ha sido la implementación y evaluación de **Redes Neuronales (NN)** para la clasificación de comentarios tóxicos. Este trabajo cumple con el **Nivel Avanzado** del briefing del proyecto, que requería la implementación de un modelo de redes neuronales para mejorar significativamente los resultados frente a las soluciones de Machine Learning clásicas.

Se han explorado dos de los frameworks más importantes del Deep Learning:

1.  **TensorFlow con Keras**: Utilizando su API secuencial de alto nivel para un desarrollo rápido y claro.
2.  **PyTorch**: Aprovechando su flexibilidad y control para construir una arquitectura personalizada.

El objetivo de esta fase fue investigar el potencial de las redes neuronales para esta tarea de NLP, comparar los enfoques y registrar sistemáticamente los resultados utilizando **MLflow**.

## 2. Contexto del Proyecto

En el marco del desafío planteado por YouTube para automatizar la moderación de contenido, esta rama representa una incursión en técnicas de Deep Learning. La hipótesis es que las redes neuronales, al ser capaces de aprender representaciones jerárquicas y complejas de los datos, pueden ofrecer un rendimiento superior en la clasificación de texto en comparación con los modelos de ML tradicionales.

## 3. Metodología de Desarrollo

El proceso, documentado en los notebooks `nn_keras.ipynb` y `nn_pytorch.ipynb`, sigue un flujo de trabajo estructurado para el desarrollo de modelos de Deep Learning.

### 3.1. Preparación de Datos

-   **Dataset**: Se utilizó el conjunto de datos `fusion30.csv`, que contiene los comentarios y sus respectivas etiquetas de toxicidad.
-   **Preprocesamiento de Texto**: Se aplicó el mismo pipeline de limpieza y normalización de texto que en las otras ramas de modelado para garantizar la consistencia. Este pipeline incluye la conversión a minúsculas, eliminación de URLs y ruido, conversión de emojis, y **lematización** con NLTK para estandarizar el texto preservando el contexto semántico.

### 3.2. Vectorización de Texto

Se exploraron dos técnicas de vectorización para preparar los datos para las redes neuronales:

-   **Para el modelo Keras**: Se utilizó `CountVectorizer` (Bag-of-Words) con un límite de 10,000 características para transformar el texto en vectores de conteo.
-   **Para el modelo PyTorch**: Se empleó `TfidfVectorizer` con un límite de 1,000 características. TF-IDF (Term Frequency-Inverse Document Frequency) no solo cuenta palabras, sino que también pondera su importancia, dando más peso a las palabras que son frecuentes en un documento pero raras en el corpus general.

## 4. Arquitecturas de Redes Neuronales

Se diseñaron dos arquitecturas de redes neuronales densas (o *fully-connected*).

### 4.1. Modelo con Keras/TensorFlow

Se construyó un modelo secuencial simple pero efectivo:

-   **Estructura**: Una pila de capas `Dense` con activaciones **ReLU** (`256 -> 128 -> 64` neuronas).
-   **Regularización**: Se aplicaron capas de `Dropout` (con una tasa del 30%) después de cada capa densa para mitigar el sobreajuste.
-   **Capa de Salida**: Una única neurona con activación **Sigmoid**, ideal para la clasificación binaria, que produce una probabilidad entre 0 y 1.
-   **Compilación**: Se utilizó el optimizador `adam` y la función de pérdida `binary_crossentropy`.

### 4.2. Modelo con PyTorch

Se definió una clase `SimpleNN` que hereda de `nn.Module`:

-   **Estructura**: Tres capas lineales (`nn.Linear`) con una arquitectura similar (`input -> 128 -> 64 -> output`).
-   **Regularización y Estabilización**: Además de `Dropout` (tasa del 20%), se incluyeron capas de `BatchNorm1d` (Normalización de Lote) después de las capas ocultas. La normalización de lote ayuda a estabilizar y acelerar el entrenamiento.
-   **Capa de Salida**: Una capa lineal con un número de neuronas igual al número de clases (2), que produce *logits*.
-   **Función de Pérdida**: `CrossEntropyLoss`, que internamente aplica `LogSoftmax` y `NLLLoss`, siendo adecuada para problemas de clasificación multiclase (o binaria).

## 5. Proceso de Entrenamiento y Evaluación

-   **Entrenamiento**: Ambos modelos fueron entrenados durante un número definido de épocas, utilizando un `batch_size` de 32.
-   **Early Stopping**: En el modelo de Keras, se implementó un callback de `EarlyStopping` que monitoriza la pérdida de validación (`val_loss`) y detiene el entrenamiento si no hay mejora, restaurando los pesos del mejor modelo para evitar el sobreajuste.
-   **Seguimiento con MLflow**: Todos los experimentos, incluyendo hiperparámetros, métricas de rendimiento (Accuracy, Loss, ROC AUC), tiempos de entrenamiento y artefactos visuales (matriz de confusión, curva ROC), fueron registrados en un servidor de MLflow.
-   **Evaluación**: El rendimiento se midió utilizando un conjunto de prueba (`test set`) independiente. Se generaron reportes de clasificación detallados y matrices de confusión para analizar el rendimiento por clase.

## 6. Resultados: Análisis Comparativo

A continuación se presenta una tabla comparativa con las métricas de rendimiento finales de ambos modelos en el conjunto de prueba.

| Modelo                 | Vectorizador      | Test Accuracy | Test F1-Score (Weighted) | ROC AUC |
| :--------------------- | :---------------- | :------------ | :----------------------- | :------ |
| **Red Neuronal (Keras)** | `CountVectorizer` | ~0.9350       | ~0.9348                  | ~0.94   |
| **Red Neuronal (PyTorch)** | `TfidfVectorizer` | ~0.9280       | ~0.9279                  | N/A*    |

*Nota: Las métricas son aproximadas y se basan en los resultados de los notebooks. El ROC AUC no fue calculado explícitamente en el notebook de PyTorch.*

### Análisis de los Resultados

-   Ambos modelos de redes neuronales demostraron un rendimiento muy alto, superando a los modelos de Machine Learning clásicos y cumpliendo el objetivo del **Nivel Avanzado**.
-   La implementación con Keras, utilizando `CountVectorizer`, y la de PyTorch, con `TfidfVectorizer`, lograron resultados muy similares, lo que valida la robustez del enfoque de redes neuronales para este problema.
-   El uso de técnicas de regularización como `Dropout` y `EarlyStopping` fue fundamental para controlar el sobreajuste y asegurar que los modelos generalizaran bien a datos no vistos.

## 7. Estado Actual y Conclusión

Los modelos de redes neuronales desarrollados en esta rama han demostrado ser altamente efectivos para la detección de comentarios tóxicos. Sin embargo, es importante destacar que, a pesar de su exitoso entrenamiento y evaluación, **estos modelos no han sido integrados en la aplicación web final del proyecto**.

El propósito de esta rama fue principalmente de **investigación y desarrollo**, para explorar las capacidades del Deep Learning y cumplir con los requisitos del Nivel Avanzado del briefing. Los artefactos de los modelos y vectorizadores han sido guardados en las carpetas `Models/keras/` y `Models/pytorch/` para futuras referencias o posibles integraciones.
