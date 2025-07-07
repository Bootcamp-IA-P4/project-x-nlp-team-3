# Comparativa de Modelos Transformer para Detección de Comentarios Tóxicos

Este directorio contiene los archivos necesarios para realizar una comparativa entre diferentes modelos Transformer (BERT, RoBERTa, DistilBERT y XLNet) para la tarea de detección de comentarios tóxicos, utilizando como referencia la implementación de BERT en el archivo `bert_fit.ipynb`.

## Archivos Incluidos

- `transformer_comparison.ipynb`: Notebook Jupyter que implementa y compara los cuatro modelos Transformer.
- `run_transformer_comparison.py`: Script Python para ejecutar la comparativa de modelos de forma más eficiente desde la línea de comandos.
- `visualize_transformer_results.py`: Script Python para visualizar y generar informes detallados de los resultados de la comparativa.

## Requisitos

Asegúrate de tener instaladas todas las dependencias necesarias ejecutando:

```bash
pip install -r ../requirements.txt
```

## Uso del Notebook

Para utilizar el notebook `transformer_comparison.ipynb`:

1. Abre el notebook en Jupyter o en un entorno compatible.
2. Ejecuta las celdas secuencialmente para:
   - Cargar y preprocesar los datos
   - Implementar y entrenar cada modelo Transformer
   - Evaluar y comparar los resultados

Ten en cuenta que el entrenamiento de todos los modelos puede llevar bastante tiempo, especialmente si no dispones de una GPU.

## Uso del Script

Para mayor flexibilidad, puedes utilizar el script `run_transformer_comparison.py` desde la línea de comandos:

```bash
python run_transformer_comparison.py --model [modelo] --epochs [épocas] --batch_size [tamaño_batch]
```

Donde:
- `[modelo]` puede ser 'bert', 'roberta', 'distilbert', 'xlnet' o 'all' (para entrenar todos los modelos)
- `[épocas]` es el número de épocas de entrenamiento (por defecto: 4)
- `[tamaño_batch]` es el tamaño del batch (por defecto: 16)

Ejemplos:

```bash
# Entrenar solo el modelo RoBERTa con 3 épocas
python run_transformer_comparison.py --model roberta --epochs 3

# Entrenar todos los modelos con configuración personalizada
python run_transformer_comparison.py --model all --epochs 4 --batch_size 8 --max_len 128 --learning_rate 2e-5
```

## Parámetros Adicionales

El script acepta los siguientes parámetros adicionales:

- `--max_len`: Longitud máxima de secuencia (por defecto: 128)
- `--learning_rate`: Tasa de aprendizaje (por defecto: 2e-5)
- `--warmup_steps`: Pasos de calentamiento para el scheduler (por defecto: 0)
- `--output_file`: Archivo para guardar los resultados en formato JSON (por defecto: 'transformer_results.json')

## Resultados

Los resultados de la comparativa incluyen:

- Métricas de rendimiento (accuracy, F1-score, precision, recall)
- Tiempo de entrenamiento
- Matrices de confusión

Los modelos entrenados se guardan en el directorio `../Models/[nombre_modelo]_toxic_comments/` para su uso posterior.

## Visualización de Resultados

Para visualizar los resultados de la comparativa de forma detallada, puedes utilizar el script `visualize_transformer_results.py`:

```bash
python visualize_transformer_results.py --input_file transformer_results.json --output_report transformer_comparison_report.html
```

Donde:
- `--input_file`: Archivo JSON con los resultados de la comparativa (generado por `run_transformer_comparison.py`)
- `--output_report`: Archivo HTML donde se guardará el informe detallado

Este script generará:

1. Gráficos comparativos de las métricas de rendimiento
2. Gráfico de tiempo de entrenamiento
3. Visualización de matrices de confusión
4. Gráfico de radar para comparación multidimensional
5. Análisis de eficiencia (rendimiento vs. tiempo)
6. Un informe HTML completo con todas las visualizaciones y conclusiones

## Análisis Comparativo

Cada modelo Transformer tiene sus propias características:

1. **BERT**: Modelo base con codificación bidireccional.
2. **RoBERTa**: Versión optimizada de BERT con entrenamiento más robusto.
3. **DistilBERT**: Versión comprimida de BERT, más rápida y ligera.
4. **XLNet**: Combina modelación autorregresiva y bidireccional con permutación de tokens.

La comparativa te permitirá identificar qué modelo ofrece el mejor equilibrio entre rendimiento y eficiencia para la tarea de detección de comentarios tóxicos según tus necesidades específicas.