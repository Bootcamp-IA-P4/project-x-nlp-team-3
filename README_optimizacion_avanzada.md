# Optimización Avanzada de Modelos Transformer

Este documento explica las técnicas avanzadas implementadas en `quantization_code.py` para reducir significativamente el tamaño de los modelos Transformer como DeBERTa, sin comprometer demasiado su rendimiento.

## Técnicas de Reducción de Tamaño Implementadas

### 1. Conversión a Float16 (FP16)
- **Reducción esperada**: ~50%
- **Impacto en precisión**: Mínimo
- **Compatibilidad**: Alta
- **Descripción**: Reduce la precisión de los pesos del modelo de 32 bits a 16 bits, disminuyendo el tamaño a la mitad.

### 2. Pruning (Poda de Pesos)
- **Reducción esperada**: ~20-30% adicional
- **Impacto en precisión**: Bajo a moderado (dependiendo del porcentaje)
- **Compatibilidad**: Alta
- **Descripción**: Elimina los pesos menos importantes del modelo según un criterio (por defecto L1), reemplazándolos con ceros.

### 3. Compresión de Pesos
- **Reducción esperada**: ~5-15% adicional
- **Impacto en precisión**: Bajo
- **Compatibilidad**: Alta
- **Descripción**: Establece a cero todos los pesos cuyo valor absoluto esté por debajo de un umbral, aumentando la esparsidad del modelo.

### 4. Cuantización con BitsAndBytes
- **Reducción esperada**: ~60-75% (desde el original)
- **Impacto en precisión**: Moderado
- **Compatibilidad**: Requiere la biblioteca bitsandbytes
- **Descripción**: Convierte las capas lineales a representaciones de 8 bits, reduciendo significativamente el tamaño.

## Requisitos

```bash
pip install torch transformers safetensors numpy tqdm
```

Para técnicas avanzadas (opcionales pero recomendadas):
```bash
pip install bitsandbytes
```

## Uso del Script

### Desde Línea de Comandos

```bash
# Uso básico
python quantization_code.py --model_path Models/deberta_toxic_comments/ --output_path Models/deberta_toxic_comments_optimized/

# Personalización de parámetros
python quantization_code.py --model_path Models/deberta_toxic_comments/ \
                          --output_path Models/deberta_toxic_comments_optimized/ \
                          --pruning_amount 0.5 \
                          --threshold 1e-4
```

### Parámetros Disponibles

| Parámetro | Descripción | Valor por defecto |
|-----------|-------------|-------------------|
| `--model_path` | Ruta al modelo original | (Requerido) |
| `--output_path` | Ruta donde guardar el modelo optimizado | Igual que model_path |
| `--pruning` | Activar/desactivar pruning | True |
| `--pruning_amount` | Porcentaje de pesos a eliminar (0.0-0.9) | 0.3 |
| `--use_bnb` | Usar bitsandbytes para cuantización | True |
| `--compress` | Comprimir pesos cercanos a cero | True |
| `--threshold` | Umbral para compresión de pesos | 1e-3 |

### Desde Python

```python
from quantization_code import apply_quantization

model_path = 'Models/deberta_toxic_comments/'
optimized_model = apply_quantization(
    model_path, 
    'Models/deberta_toxic_comments_optimized/',
    pruning=True,
    pruning_amount=0.4,  # Eliminar 40% de los pesos menos importantes
    use_bnb=True,        # Usar cuantización de 8-bit con bitsandbytes
    compress=True,       # Comprimir pesos cercanos a cero
    threshold=1e-3       # Umbral para considerar un peso como cercano a cero
)
```

## Archivos Generados

El script genera los siguientes archivos en la carpeta de salida:

1. **Modelo en formato safetensors**: Formato seguro y eficiente para almacenar los pesos del modelo.
2. **model_optimized.pt**: Modelo en formato PyTorch para mayor compatibilidad.
3. **Archivos del tokenizador**: Copiados del modelo original.

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

### Error al cargar el modelo optimizado

Si utilizó cuantización BNB, asegúrese de instalar bitsandbytes antes de cargar el modelo:
```python
import bitsandbytes as bnb
from transformers import AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained('ruta/al/modelo/optimizado')
```

### Pérdida significativa de precisión

Reduzca los valores de `pruning_amount` y `threshold` para preservar más información del modelo original.

## Resultados Esperados

Con la configuración predeterminada, puede esperar:
- Reducción de tamaño: 60-75% del tamaño original
- Impacto en precisión: 1-3% de pérdida en métricas de evaluación
- Aceleración de inferencia: 1.5-2x más rápido en hardware compatible

## Comparación con el Modelo Original

Para evaluar el impacto de la optimización, utilice el script `test_quantized_model.py` para comparar:
- Tamaño en disco
- Tiempo de inferencia
- Precisión en las predicciones