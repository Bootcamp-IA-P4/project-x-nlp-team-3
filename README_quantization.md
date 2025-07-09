# Guía de Optimización Avanzada de Modelos Transformer

Este documento explica cómo utilizar el script `quantization_code.py` para reducir significativamente el tamaño de los modelos Transformer entrenados (como DeBERTa, BERT, RoBERTa, etc.) mediante múltiples técnicas de optimización.

## Técnicas de Reducción de Tamaño Implementadas

El script implementa varias técnicas para reducir el tamaño del modelo:

1. **Conversión a float16**: Reduce el tamaño de los pesos a la mitad (de 32 bits a 16 bits)
2. **Pruning (Poda de Pesos)**: Elimina los pesos menos importantes del modelo
3. **Compresión de Pesos**: Establece a cero los pesos con valores cercanos a cero
4. **Cuantización con BitsAndBytes**: Convierte las capas lineales a representaciones de 8 bits

## Beneficios

- **Reducción de tamaño**: Hasta un 75-80% de reducción en el tamaño del modelo
- **Inferencia más rápida**: Los modelos optimizados pueden ejecutarse más rápido en hardware compatible
- **Menor consumo de memoria**: Ideal para despliegues en dispositivos con recursos limitados
- **Formato SafeTensors**: Mayor seguridad y compatibilidad

## Requisitos

- Python 3.6+
- PyTorch 1.10+
- Transformers 4.15+
- NumPy
- tqdm
- (Opcional pero recomendado) bitsandbytes: `pip install bitsandbytes`
- (Opcional) Safetensors

## Uso del Script

### Desde la línea de comandos (Uso básico)

```bash
python quantization_code.py --model_path RUTA_DEL_MODELO [--output_path RUTA_DE_SALIDA]
```

Donde:
- `RUTA_DEL_MODELO`: Directorio donde está guardado el modelo entrenado
- `RUTA_DE_SALIDA` (opcional): Directorio donde guardar el modelo optimizado. Si no se especifica, se sobrescribirá el modelo original.

### Uso avanzado con parámetros personalizados

```bash
python quantization_code.py --model_path RUTA_DEL_MODELO \
                          --output_path RUTA_DE_SALIDA \
                          --pruning_amount 0.5 \
                          --threshold 1e-4 \
                          --no-use_bnb \
                          --no-compress
```

### Parámetros disponibles

| Parámetro | Descripción | Valor por defecto |
|-----------|-------------|-------------------|
| `--model_path` | Ruta al modelo original | (Requerido) |
| `--output_path` | Ruta donde guardar el modelo optimizado | Igual que model_path |
| `--pruning` | Activar pruning | True |
| `--no-pruning` | Desactivar pruning | - |
| `--pruning_amount` | Porcentaje de pesos a eliminar (0.0-0.9) | 0.3 |
| `--use_bnb` | Usar bitsandbytes para cuantización | True |
| `--no-use_bnb` | No usar bitsandbytes | - |
| `--compress` | Comprimir pesos cercanos a cero | True |
| `--no-compress` | No comprimir pesos | - |
| `--threshold` | Umbral para compresión de pesos | 1e-3 |

### Ejemplos

```bash
# Uso básico
python quantization_code.py --model_path "Models/deberta_toxic_comments/" --output_path "Models/deberta_toxic_comments_optimized/"

# Pruning más agresivo (50% de pesos eliminados)
python quantization_code.py --model_path "Models/deberta_toxic_comments/" --output_path "Models/deberta_toxic_comments_optimized/" --pruning_amount 0.5

# Solo conversión a float16 (sin otras optimizaciones)
python quantization_code.py --model_path "Models/deberta_toxic_comments/" --output_path "Models/deberta_toxic_comments_fp16/" --no-pruning --no-use_bnb --no-compress
```

### Desde otro script Python

```python
from quantization_code import apply_quantization

# Uso básico
model_path = 'Models/deberta_toxic_comments/'
optimized_model = apply_quantization(
    model_path, 
    'Models/deberta_toxic_comments_optimized/'
)

# Uso avanzado con parámetros personalizados
optimized_model = apply_quantization(
    model_path, 
    'Models/deberta_toxic_comments_optimized/',
    pruning=True,
    pruning_amount=0.4,  # Eliminar 40% de los pesos menos importantes
    use_bnb=True,        # Usar cuantización de 8-bit con bitsandbytes
    compress=True,       # Comprimir pesos cercanos a cero
    threshold=1e-3       # Umbral para considerar un peso como cercano a cero
)

# El modelo optimizado ya está listo para usar
# predictions = optimized_model(inputs)
```

## Archivos Generados

El script generará los siguientes archivos en la ruta de salida:

1. **Modelo en formato SafeTensors**: Archivos con extensión `.safetensors` (si está disponible)
2. **Modelo en formato PT**: Archivo `model_optimized.pt` con el modelo optimizado
3. **Archivos de configuración**: Configuración del modelo y tokenizador

## Evaluación del Modelo Optimizado

Para evaluar el impacto de las optimizaciones, utilice el script `test_optimized_model.py`:

```bash
python test_optimized_model.py --original "Models/deberta_toxic_comments/" \
                              --optimized fp16:"Models/deberta_toxic_comments_fp16/" \
                                         full:"Models/deberta_toxic_comments_optimized/"
```

Este script comparará:
- Tamaño en disco de cada versión
- Tiempo de inferencia
- Diferencias en las predicciones

## Consideraciones Importantes

1. **Equilibrio entre tamaño y precisión**: A mayor reducción de tamaño, mayor posibilidad de pérdida de precisión. Ajuste los parámetros según sus necesidades.

2. **Pruning**: Valores recomendados entre 0.2 y 0.5. Valores superiores pueden degradar significativamente el rendimiento.

3. **Compatibilidad**: El modelo optimizado puede requerir bibliotecas específicas para su carga (como bitsandbytes si se usa cuantización BNB).

4. **Memoria**: El proceso de optimización puede requerir temporalmente más memoria que el tamaño del modelo original.

## Solución de Problemas

### Error: "No module named 'bitsandbytes'"

Instale la biblioteca bitsandbytes:
```bash
pip install bitsandbytes
```

### Error al cargar el modelo optimizado con BNB

Si utilizó cuantización BNB, asegúrese de instalar bitsandbytes antes de cargar el modelo:
```python
import bitsandbytes as bnb
from transformers import AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained('ruta/al/modelo/optimizado')
```

### Pérdida significativa de precisión

Reduzca los valores de `pruning_amount` y `threshold` para preservar más información del modelo original. Por ejemplo:
```bash
python quantization_code.py --model_path "Models/deberta_toxic_comments/" --pruning_amount 0.2 --threshold 1e-4
```

## Comparación de Tamaños

En general, puedes esperar las siguientes reducciones aproximadas:

- Modelo original (float32): 100% (tamaño base)
- Modelo en float16: ~50% del tamaño original
- Modelo con pruning (30%): ~35% del tamaño original
- Modelo con todas las optimizaciones: ~20-25% del tamaño original

## Recomendaciones

1. **Enfoque gradual**: Comience con la conversión a float16, luego añada pruning con valores conservadores (0.2-0.3).

2. **Evaluación**: Siempre evalúe el modelo optimizado para asegurarse de que mantiene un rendimiento aceptable para su caso de uso.

3. **Respaldo**: Mantenga una copia del modelo original antes de aplicar optimizaciones irreversibles.

4. **Hardware**: Para máximo rendimiento, utilice hardware compatible con operaciones en float16 o int8 (GPUs recientes, procesadores con instrucciones AVX2/AVX512).