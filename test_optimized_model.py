# Script para probar y comparar modelos optimizados

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import os
import time
import numpy as np
import matplotlib.pyplot as plt
import argparse
from tqdm import tqdm

# Intentar importar bibliotecas opcionales
try:
    import bitsandbytes as bnb
    HAVE_BNB = True
except ImportError:
    HAVE_BNB = False
    print("bitsandbytes no está instalado. Algunos modelos optimizados podrían no cargarse correctamente.")

def get_model_size_mb(model_path):
    """Calcula el tamaño en MB de los archivos del modelo"""
    total_size = 0
    for root, dirs, files in os.walk(model_path):
        for file in files:
            file_path = os.path.join(root, file)
            total_size += os.path.getsize(file_path)
    return total_size / (1024 * 1024)

def load_model(model_path, device='cpu'):
    """Carga un modelo desde la ruta especificada"""
    print(f"Cargando modelo desde {model_path}...")
    try:
        model = AutoModelForSequenceClassification.from_pretrained(model_path)
        model = model.to(device)
        model.eval()
        return model
    except Exception as e:
        print(f"Error al cargar el modelo: {e}")
        return None

def load_tokenizer(model_path):
    """Carga el tokenizador desde la ruta especificada"""
    print(f"Cargando tokenizador desde {model_path}...")
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        return tokenizer
    except Exception as e:
        print(f"Error al cargar el tokenizador: {e}")
        return None

def predict_toxicity(model, tokenizer, text, device='cpu'):
    """Realiza una predicción de toxicidad con el modelo"""
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    
    with torch.no_grad():
        start_time = time.time()
        outputs = model(**inputs)
        inference_time = time.time() - start_time
    
    # Obtener probabilidades con softmax
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    
    # Asumiendo que la etiqueta 1 corresponde a "tóxico"
    toxic_prob = probs[0, 1].item()
    
    return {
        "toxic_probability": toxic_prob,
        "inference_time": inference_time
    }

def benchmark_model(model, tokenizer, texts, device='cpu', num_runs=5):
    """Realiza un benchmark del modelo con varios textos"""
    results = []
    
    for text in tqdm(texts, desc="Evaluando textos"):
        # Realizar múltiples ejecuciones para obtener tiempos más estables
        text_results = []
        for _ in range(num_runs):
            result = predict_toxicity(model, tokenizer, text, device)
            text_results.append(result)
        
        # Calcular promedio de tiempos e inferencias
        avg_time = np.mean([r["inference_time"] for r in text_results])
        avg_prob = np.mean([r["toxic_probability"] for r in text_results])
        
        results.append({
            "text": text,
            "toxic_probability": avg_prob,
            "inference_time": avg_time
        })
    
    return results

def compare_models(original_path, optimized_paths, test_texts, device='cpu'):
    """Compara el rendimiento entre el modelo original y los optimizados"""
    results = {}
    model_sizes = {}
    
    # Cargar tokenizador (usamos el mismo para todos los modelos)
    tokenizer = load_tokenizer(original_path)
    if tokenizer is None:
        print("No se pudo cargar el tokenizador. Abortando comparación.")
        return
    
    # Evaluar modelo original
    print("\n=== Evaluando modelo original ===")
    model_sizes["original"] = get_model_size_mb(original_path)
    print(f"Tamaño del modelo original: {model_sizes['original']:.2f} MB")
    
    original_model = load_model(original_path, device)
    if original_model is not None:
        results["original"] = benchmark_model(original_model, tokenizer, test_texts, device)
        # Liberar memoria
        del original_model
        torch.cuda.empty_cache() if torch.cuda.is_available() else None
    
    # Evaluar modelos optimizados
    for name, path in optimized_paths.items():
        print(f"\n=== Evaluando modelo {name} ===")
        model_sizes[name] = get_model_size_mb(path)
        print(f"Tamaño del modelo {name}: {model_sizes[name]:.2f} MB")
        print(f"Reducción de tamaño: {(1 - model_sizes[name]/model_sizes['original']) * 100:.2f}%")
        
        optimized_model = load_model(path, device)
        if optimized_model is not None:
            results[name] = benchmark_model(optimized_model, tokenizer, test_texts, device)
            # Liberar memoria
            del optimized_model
            torch.cuda.empty_cache() if torch.cuda.is_available() else None
    
    return results, model_sizes

def plot_comparison(results, model_sizes):
    """Genera gráficos comparativos entre los modelos"""
    if not results:
        print("No hay resultados para graficar.")
        return
    
    # Preparar datos para gráficos
    models = list(results.keys())
    
    # 1. Comparación de tamaños
    plt.figure(figsize=(10, 6))
    sizes = [model_sizes[model] for model in models]
    plt.bar(models, sizes)
    plt.title('Comparación de Tamaño de Modelos')
    plt.ylabel('Tamaño (MB)')
    plt.xticks(rotation=45)
    for i, v in enumerate(sizes):
        plt.text(i, v + 5, f"{v:.1f} MB", ha='center')
    plt.tight_layout()
    plt.savefig('model_size_comparison.png')
    plt.close()
    
    # 2. Comparación de tiempos de inferencia
    plt.figure(figsize=(10, 6))
    avg_times = [np.mean([r["inference_time"] for r in results[model]]) * 1000 for model in models]  # ms
    plt.bar(models, avg_times)
    plt.title('Tiempo Promedio de Inferencia')
    plt.ylabel('Tiempo (ms)')
    plt.xticks(rotation=45)
    for i, v in enumerate(avg_times):
        plt.text(i, v + 0.5, f"{v:.1f} ms", ha='center')
    plt.tight_layout()
    plt.savefig('inference_time_comparison.png')
    plt.close()
    
    # 3. Comparación de predicciones
    plt.figure(figsize=(12, 8))
    
    # Para cada texto, comparar las predicciones de cada modelo
    num_texts = len(results[models[0]])
    x = np.arange(num_texts)
    width = 0.8 / len(models)  # Ancho de las barras
    
    for i, model in enumerate(models):
        probs = [r["toxic_probability"] for r in results[model]]
        plt.bar(x + i*width - 0.4 + width/2, probs, width, label=model)
    
    plt.title('Comparación de Predicciones de Toxicidad')
    plt.xlabel('Texto de Prueba')
    plt.ylabel('Probabilidad de Toxicidad')
    plt.xticks(x, [f"Texto {i+1}" for i in range(num_texts)])
    plt.legend()
    plt.tight_layout()
    plt.savefig('prediction_comparison.png')
    plt.close()
    
    print("\nGráficos guardados: model_size_comparison.png, inference_time_comparison.png, prediction_comparison.png")

def print_comparison_table(results, model_sizes):
    """Imprime una tabla comparativa de los resultados"""
    if not results:
        print("No hay resultados para mostrar.")
        return
    
    models = list(results.keys())
    
    # Calcular métricas promedio
    avg_times = {model: np.mean([r["inference_time"] for r in results[model]]) * 1000 for model in models}  # ms
    
    # Imprimir tabla de comparación
    print("\n" + "="*80)
    print(f"{'Modelo':<20} {'Tamaño (MB)':<15} {'Reducción (%)':<15} {'Tiempo (ms)':<15} {'Aceleración (%)':<15}")
    print("-"*80)
    
    # Modelo original (referencia)
    original_size = model_sizes["original"]
    original_time = avg_times["original"]
    print(f"{'original':<20} {original_size:<15.2f} {'-':<15} {original_time:<15.2f} {'-':<15}")
    
    # Modelos optimizados
    for model in models:
        if model == "original":
            continue
        
        size = model_sizes[model]
        time = avg_times[model]
        
        size_reduction = (1 - size/original_size) * 100
        time_reduction = (1 - time/original_time) * 100
        
        print(f"{model:<20} {size:<15.2f} {size_reduction:<15.2f} {time:<15.2f} {time_reduction:<15.2f}")
    
    print("="*80)

def main():
    parser = argparse.ArgumentParser(description='Comparar modelos originales y optimizados')
    parser.add_argument('--original', type=str, required=True, 
                        help='Ruta al modelo original')
    parser.add_argument('--optimized', type=str, nargs='+', required=True,
                        help='Rutas a los modelos optimizados (formato: nombre:ruta)')
    parser.add_argument('--device', type=str, default='cpu',
                        help='Dispositivo para inferencia (cpu o cuda)')
    parser.add_argument('--plot', action='store_true', default=True,
                        help='Generar gráficos comparativos')
    
    args = parser.parse_args()
    
    # Verificar disponibilidad de GPU si se solicita
    if args.device == 'cuda' and not torch.cuda.is_available():
        print("CUDA no está disponible. Usando CPU.")
        args.device = 'cpu'
    
    # Textos de prueba
    test_texts = [
        "Me encantó esta película, el director hizo un trabajo excepcional.",
        "Este producto es una basura, no funciona para nada y el servicio al cliente es pésimo.",
        "No estoy de acuerdo con tu opinión, pero respeto tu punto de vista.",
        "Eres un completo idiota si crees que eso va a funcionar.",
        "La calidad de este servicio ha disminuido considerablemente en los últimos meses."
    ]
    
    # Procesar rutas de modelos optimizados
    optimized_paths = {}
    for opt in args.optimized:
        parts = opt.split(':', 1)
        if len(parts) == 2:
            name, path = parts
        else:
            name = f"optimized_{len(optimized_paths)+1}"
            path = parts[0]
        optimized_paths[name] = path
    
    # Comparar modelos
    results, model_sizes = compare_models(args.original, optimized_paths, test_texts, args.device)
    
    # Mostrar resultados
    if results:
        print_comparison_table(results, model_sizes)
        
        if args.plot:
            plot_comparison(results, model_sizes)

if __name__ == "__main__":
    main()

# Ejemplo de uso:
# python test_optimized_model.py --original Models/deberta_toxic_comments/ \
#                              --optimized fp16:Models/deberta_toxic_comments_fp16/ \
#                                         pruned:Models/deberta_toxic_comments_pruned/ \
#                                         full:Models/deberta_toxic_comments_optimized/