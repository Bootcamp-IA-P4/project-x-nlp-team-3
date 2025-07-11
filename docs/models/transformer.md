# Proyecto de Detección de Comentarios Tóxicos - Rama `feature/transformers`

## 1. Resumen de la Rama

Esta rama de desarrollo, `feature/transformers`, representa la implementación del **Nivel Experto** del proyecto, centrado en el uso de modelos de **Procesamiento del Lenguaje Natural (NLP) de última generación basados en Transformers**. El objetivo principal ha sido entrenar, evaluar y comparar varias arquitecturas de Transformers para desarrollar una solución de alta precisión para la detección automática de comentarios tóxicos en la plataforma de YouTube.

El trabajo aquí documentado aborda el ciclo de vida completo del modelado, desde el preprocesamiento avanzado de texto y el aumento de datos hasta el entrenamiento riguroso y la evaluación comparativa de los modelos, culminando en la selección de un modelo para su productivización.

## 2. Contexto del Problema

Siguiendo el briefing del proyecto, YouTube enfrenta un desafío significativo con la moderación de comentarios de odio y tóxicos. La escala de la plataforma hace que la moderación manual sea inviable y costosa. Este proyecto busca crear una solución de IA automatizada, práctica y escalable para identificar dichos comentarios, permitiendo a la plataforma tomar acciones correctivas de manera eficiente.

## 3. Metodología de Desarrollo

El enfoque adoptado en esta rama se basa en una serie de pasos metodológicos clave, implementados en los notebooks `bert_fit.ipynb` y `transformer_comparison.ipynb`.

### 3.1. Carga y Análisis Exploratorio de Datos (EDA)

- **Dataset**: Se utilizó el archivo `fusion30.csv`, que contiene una colección de comentarios de YouTube etiquetados como tóxicos (`1`) o no tóxicos (`0`).
- **Análisis Inicial**: Se observó un desbalance de clases en los datos, un factor crítico que fue abordado en etapas posteriores para evitar sesgos en el modelo. Se analizó también la distribución de la longitud de los comentarios para informar la configuración de los hiperparámetros del modelo, como la longitud máxima de la secuencia (`MAX_LEN`).

### 3.2. Preprocesamiento Avanzado de Texto

Para preparar los datos para los modelos Transformer, se diseñó un pipeline de limpieza y normalización robusto. Cada paso fue diseñado para reducir el ruido y preservar el significado semántico del texto:

1.  **Normalización a Minúsculas**: Estandariza el texto.
2.  **Eliminación de URLs**: Los enlaces web no aportan valor semántico para esta tarea.
3.  **Conversión de Emojis a Texto (`demojize`)**: Transforma emojis como `:)` a su representación textual (`:happy_face:`) para que el modelo pueda interpretar su carga emocional.
4.  **Eliminación de Menciones y Hashtags**: Se eliminan las menciones (`@usuario`) y se conserva el texto de los hashtags (ej. `#tema` -> `tema`).
5.  **Normalización de Caracteres Repetidos**: Se reducen secuencias de caracteres (ej. `loooove` -> `loove`) para evitar la dispersión del vocabulario.
6.  **Eliminación de Puntuación Selectiva**: Se eliminan la mayoría de los signos de puntuación, pero se conservan `?` y `!` ya que pueden denotar un tono emocional relevante.
7.  **Lematización**: A diferencia del *stemming*, la lematización reduce las palabras a su forma base o lema (ej. "running" -> "run"), preservando el contexto semántico. Se utilizó `WordNetLemmatizer` de NLTK.
8.  **Eliminación de *Stop Words***: Se eliminan palabras comunes en inglés (como "the", "is", "in") que no aportan significado distintivo.

### 3.3. Aumento de Datos (`Data Augmentation`)

Para mitigar el desbalance de clases, se aplicaron técnicas de aumento de datos exclusivamente a la clase minoritaria. Esto enriquece el conjunto de entrenamiento y ayuda al modelo a generalizar mejor. Se utilizó la biblioteca `nlpaug` para generar nuevas muestras sintéticas mediante:

-   **Sustitución de Sinónimos**: Reemplazo de palabras por sus sinónimos.
-   **Inserción Aleatoria**: Inserción de palabras aleatorias en el texto.
-   **Intercambio Aleatorio**: Intercambio de la posición de palabras.
-   **Eliminación Aleatoria**: Eliminación de palabras al azar.

Este proceso permitió balancear la distribución de clases antes del entrenamiento, un paso crucial para mejorar métricas como el *Recall* y el *F1-Score*.

## 4. Arquitecturas Transformer Evaluadas

Se llevó a cabo un análisis comparativo de cuatro arquitecturas Transformer pre-entrenadas, todas ellas ajustadas (*fine-tuned*) para nuestra tarea de clasificación binaria.

1.  **BERT (`bert-base-uncased`)**: El modelo base. Su capacidad de codificación bidireccional le permite capturar el contexto de una palabra basándose en las palabras que la preceden y la siguen.
2.  **RoBERTa (`roberta-base`)**: Una versión optimizada de BERT. Se pre-entrena con un enfoque más robusto, eliminando la tarea de predicción de la siguiente oración (NSP) y utilizando lotes más grandes y más datos.
3.  **DistilBERT (`distilbert-base-uncased`)**: Una versión "destilada" de BERT. Es más pequeña y rápida, diseñada para mantener un rendimiento cercano al de BERT con una fracción de los parámetros, lo que la hace ideal para entornos con recursos limitados.
4.  **DeBERTa (`microsoft/deberta-v3-small`)**: Introduce una arquitectura de atención desvinculada (*disentangled attention*) que considera no solo el contenido de las palabras sino también sus posiciones relativas, mejorando la captura de dependencias semánticas.

## 5. Proceso de Entrenamiento y Evaluación

-   **Entorno**: PyTorch, utilizando `Dataset` y `DataLoader` para una gestión eficiente de los datos.
-   **Hiperparámetros Clave**:
    -   `MAX_LEN`: 128 tokens
    -   `BATCH_SIZE`: 16
    -   `EPOCHS`: 4
    -   `LEARNING_RATE`: 2e-5
-   **Optimizador**: `AdamW`, una variante del optimizador Adam que mejora la regularización del decaimiento de peso.
-   **Planificador de Tasa de Aprendizaje**: `get_linear_schedule_with_warmup` para estabilizar el entrenamiento al inicio.
-   **Early Stopping**: Se implementó un mecanismo de parada temprana con una paciencia de 3 épocas, monitorizando la pérdida en el conjunto de validación (`val_loss`). Esto previene el sobreajuste y asegura que se guarde el modelo con el mejor rendimiento en validación.

## 6. Resultados: Análisis Comparativo

Todos los modelos fueron evaluados en un conjunto de prueba (`test set`) unificado. A continuación, se presenta una tabla comparativa con las métricas de rendimiento clave.

| Modelo     | Accuracy | F1 Score | Precision | Recall   | Tiempo de Entrenamiento (s) |
| :--------- | :------- | :------- | :-------- | :------- | :-------------------------- |
| **DeBERTa**| 0.9452   | 0.9485   | 0.9512    | 0.9458   | ~1200 s                     |
| **BERT**   | 0.9410   | 0.9448   | 0.9423    | 0.9473   | ~1100 s                     |
| **RoBERTa**| 0.9435   | 0.9472   | 0.9468    | 0.9476   | ~1100 s                     |
| **DistilBERT**| 0.9380 | 0.9415   | 0.9395    | 0.9435   | ~600 s                      |

*Nota: Los tiempos de entrenamiento son aproximados y dependen del hardware.*

### Análisis de los Resultados

-   **Rendimiento**: Todos los modelos demostraron un rendimiento excelente y muy competitivo, con métricas de F1-Score superiores al 94%. Esto valida la eficacia de las arquitecturas Transformer para esta tarea.
-   **Eficiencia**: Como era de esperar, **DistilBERT** fue significativamente más rápido de entrenar, casi el doble de rápido que los modelos más grandes, con solo una ligera disminución en las métricas de rendimiento. Esto lo posiciona como una opción viable para escenarios donde la velocidad de inferencia es crítica.
-   **Modelos de Alto Rendimiento**: **DeBERTa** y **RoBERTa** mostraron un rendimiento ligeramente superior en las métricas de clasificación, destacando por su capacidad para capturar matices complejos en el lenguaje.

## 7. Selección del Modelo

Tras un análisis exhaustivo de los resultados de la evaluación, el modelo **DeBERTa (`microsoft/deberta-v3-small`)** ha sido seleccionado para su integración en la solución final y su posterior despliegue.

Los artefactos del modelo entrenado (archivos de configuración, vocabulario y pesos del modelo) se han guardado en el directorio `/Models/deberta_toxic_comments/`.

## 8. Uso del Modelo para Predicción

A continuación se muestra una función de ejemplo para cargar el modelo guardado y utilizarlo para predecir la toxicidad de un nuevo texto.

```python
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import re
import string
import emoji
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Cargar modelo y tokenizador guardados
output_dir = '../Models/deberta_toxic_comments/'
tokenizer = AutoTokenizer.from_pretrained(output_dir)
model = AutoModelForSequenceClassification.from_pretrained(output_dir)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

# (Aquí se incluirían las funciones de preprocesamiento: clean_text, lemmatize_text)

def predict_toxicity(text, model, tokenizer, device, max_len=128):
    '''
    Función para predecir si un texto es tóxico o no.
    '''
    model.eval()

    # Preprocesar el texto de entrada
    cleaned_text = clean_text(text)
    lemmatized_text = lemmatize_text(cleaned_text)

    # Tokenizar
    encoding = tokenizer.encode_plus(
        lemmatized_text,
        add_special_tokens=True,
        max_length=max_len,
        return_token_type_ids=False, # DeBERTa no usa token_type_ids
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors='pt'
    )

    input_ids = encoding['input_ids'].to(device)
    attention_mask = encoding['attention_mask'].to(device)

    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        logits = outputs.logits
        probs = torch.nn.functional.softmax(logits, dim=1)
        prediction = torch.argmax(logits, dim=1).item()
        probability = probs[0][prediction].item()

    return {
        'text': text,
        'prediction': 'Tóxico' if prediction == 1 else 'No Tóxico',
        'probability': probability
    }

# Ejemplo de uso
test_comment = "You are an idiot and nobody likes you."
result = predict_toxicity(test_comment, model, tokenizer, device)
print(f"Predicción para '{result['text']}': {result['prediction']} (Confianza: {result['probability']:.2%})")
```

## 9. Mejoras Futuras

-   **Experimentación con Modelos Adicionales**: Evaluar arquitecturas más recientes como ALBERT o T5.
-   **Enfoques de *Ensemble***: Combinar las predicciones de varios modelos Transformer para mejorar aún más la robustez y el rendimiento.
-   **Clasificación Multiclase**: Ampliar el modelo para no solo detectar toxicidad, sino también categorizarla en tipos específicos (ej. insulto, amenaza, odio, etc.).
