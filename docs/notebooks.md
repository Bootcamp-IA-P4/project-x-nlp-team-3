# Experimentación y Modelado en Notebooks

La carpeta `Notebook/` es el corazón de la fase de investigación y desarrollo (I+D) de este proyecto. Contiene una serie de Jupyter Notebooks donde se llevó a cabo todo el proceso de experimentación: desde el Análisis Exploratorio de Datos (EDA) hasta el entrenamiento y la evaluación de los diferentes modelos de IA.

El uso de MLflow fue un pilar en esta fase, permitiendo un seguimiento riguroso de cada experimento.

## Descripción de los Notebooks Clave

-   **`EDA_.ipynb`**:
    -   **Propósito**: Realizar un análisis exploratorio profundo de los datos. Se investigó la distribución de las clases (toxicidad), la longitud de los comentarios, las palabras más frecuentes, y se visualizaron estos insights para informar las decisiones de preprocesamiento y modelado.

-   **`naive_bayes.ipynb` y `svm_model.ipynb`**:
    -   **Propósito**: Implementar, entrenar y evaluar los modelos de Machine Learning clásicos. Se utilizó `GridSearchCV` para la optimización de hiperparámetros y se registraron los resultados con MLflow.

-   **`nn_keras.ipynb` y `nn_pytorch.ipynb`**:
    -   **Propósito**: Desarrollar y entrenar los modelos de Redes Neuronales. Estos notebooks contienen la definición de las arquitecturas, los bucles de entrenamiento y la evaluación detallada, incluyendo la generación de matrices de confusión y curvas ROC.

-   **`bert_fit.ipynb`**:
    -   **Propósito**: Realizar el *fine-tuning* de un modelo BERT base. Este notebook fue el primer paso en el mundo de los Transformers, estableciendo un pipeline de entrenamiento que incluye un preprocesamiento más avanzado y el uso de la biblioteca `transformers` de Hugging Face.

-   **`transformer_comparison.ipynb`**:
    -   **Propósito**: Llevar la experimentación un paso más allá, comparando de manera sistemática el rendimiento de cuatro arquitecturas Transformer diferentes (BERT, RoBERTa, DistilBERT y DeBERTa). Este notebook es la culminación del esfuerzo de modelado, proporcionando una base sólida para la selección del mejor modelo.

## Seguimiento de Experimentos con MLflow

Todos los notebooks de entrenamiento están integrados con **MLflow**, una plataforma de código abierto para gestionar el ciclo de vida del Machine Learning.

-   **Registro de Parámetros**: Cada hiperparámetro utilizado en un experimento (ej. `learning_rate`, `batch_size`, `dropout_rate`) fue registrado.
-   **Registro de Métricas**: Las métricas de rendimiento clave (Accuracy, F1-Score, Precision, Recall, Loss) se registraron en cada época y al final del entrenamiento.
-   **Registro de Artefactos**: Se guardaron artefactos importantes generados durante el entrenamiento, como:
    -   Los propios modelos entrenados.
    -   Visualizaciones (matrices de confusión, curvas ROC).
    -   Archivos de configuración y reportes de clasificación.

Esta práctica asegura la **reproducibilidad** de los experimentos y facilita la comparación objetiva entre diferentes modelos y configuraciones.
