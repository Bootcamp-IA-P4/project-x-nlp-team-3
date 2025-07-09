# Script para probar el modelo cuantizado

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import time
import argparse
import os

def load_model(model_path, model_type="standard"):
    """
    Carga un modelo según el tipo especificado
    
    Args:
        model_path: Ruta al directorio del modelo
        model_type: Tipo de modelo a cargar ("standard", "fp16", "int8")
    
    Returns:
        Modelo cargado
    """
    print(f"Cargando modelo {model_type} desde {model_path}...")
    
    if model_type == "int8":
        # Cargar modelo cuantizado desde archivo PT
        int8_path = os.path.join(model_path, "model_int8.pt")
        if os.path.exists(int8_path):
            # Primero cargar el modelo base para obtener la arquitectura
            model = AutoModelForSequenceClassification.from_pretrained(model_path)
            # Luego cargar los pesos cuantizados
            model.load_state_dict(torch.load(int8_path))
            print("Modelo INT8 cargado correctamente")
            return model
        else:
            print(f"No se encontró el modelo INT8 en {int8_path}, cargando modelo estándar")
            return AutoModelForSequenceClassification.from_pretrained(model_path)
    
    elif model_type == "fp16":
        # Cargar modelo y convertir a float16
        model = AutoModelForSequenceClassification.from_pretrained(model_path)
        model = model.half()
        print("Modelo FP16 cargado correctamente")
        return model
    
    else:  # standard
        # Cargar modelo normal
        model = AutoModelForSequenceClassification.from_pretrained(model_path)
        print("Modelo estándar cargado correctamente")
        return model

def predict_toxicity(text, model, tokenizer, device="cuda" if torch.cuda.is_available() else "cpu"):
    """
    Predice si un texto es tóxico o no
    
    Args:
        text: Texto a clasificar
        model: Modelo cargado
        tokenizer: Tokenizador correspondiente al modelo
        device: Dispositivo donde ejecutar la inferencia
    
    Returns:
        Diccionario con la predicción y probabilidades
    """
    # Mover modelo al dispositivo adecuado
    model = model.to(device)
    model.eval()
    
    # Tokenizar el texto
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding="max_length")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    
    # Medir tiempo de inferencia
    start_time = time.time()
    
    # Realizar predicción
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Calcular tiempo de inferencia
    inference_time = time.time() - start_time
    
    # Obtener probabilidades con softmax
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    
    # Obtener la clase predicha
    predicted_class = torch.argmax(probs, dim=-1).item()
    
    # Convertir a numpy para facilitar el manejo
    probs = probs.cpu().numpy()[0]
    
    # Crear diccionario de resultados
    result = {
        "prediction": "Tóxico" if predicted_class == 1 else "No Tóxico",
        "confidence": float(probs[predicted_class]),
        "probabilities": {
            "No Tóxico": float(probs[0]),
            "Tóxico": float(probs[1])
        },
        "inference_time": inference_time
    }
    
    return result

def compare_models(texts, model_paths, tokenizer_path=None):
    """
    Compara diferentes versiones del modelo (estándar, fp16, int8)
    
    Args:
        texts: Lista de textos para probar
        model_paths: Diccionario con rutas a los diferentes modelos
        tokenizer_path: Ruta al tokenizador (si es None, se usa la ruta del modelo estándar)
    """
    # Determinar dispositivo
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Usando dispositivo: {device}")
    
    # Cargar tokenizador
    if tokenizer_path is None:
        tokenizer_path = model_paths.get("standard", list(model_paths.values())[0])
    
    tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)
    print(f"Tokenizador cargado desde {tokenizer_path}")
    
    # Cargar modelos
    models = {}
    for model_type, path in model_paths.items():
        models[model_type] = load_model(path, model_type)
    
    # Comparar tamaños de modelo
    print("\nComparación de tamaños de modelo:")
    for model_type, model in models.items():
        size_mb = sum(p.numel() * p.element_size() for p in model.parameters()) / (1024 * 1024)
        print(f"Modelo {model_type}: {size_mb:.2f} MB")
    
    # Realizar predicciones
    print("\nComparación de predicciones:")
    for i, text in enumerate(texts):
        print(f"\nTexto {i+1}: {text}")
        
        for model_type, model in models.items():
            result = predict_toxicity(text, model, tokenizer, device)
            print(f"  Modelo {model_type}:")
            print(f"    Predicción: {result['prediction']}")
            print(f"    Confianza: {result['confidence']:.4f}")
            print(f"    Tiempo de inferencia: {result['inference_time']*1000:.2f} ms")

def main():
    parser = argparse.ArgumentParser(description='Probar y comparar modelos cuantizados')
    parser.add_argument('--standard_model', type=str, required=True, 
                        help='Ruta al modelo estándar (FP32)')
    parser.add_argument('--fp16_model', type=str, default=None,
                        help='Ruta al modelo FP16 (opcional)')
    parser.add_argument('--int8_model', type=str, default=None,
                        help='Ruta al modelo INT8 (opcional)')
    parser.add_argument('--tokenizer', type=str, default=None,
                        help='Ruta al tokenizador (opcional, por defecto usa la ruta del modelo estándar)')
    
    args = parser.parse_args()
    
    # Configurar rutas de modelos
    model_paths = {"standard": args.standard_model}
    if args.fp16_model:
        model_paths["fp16"] = args.fp16_model
    if args.int8_model:
        model_paths["int8"] = args.int8_model
    
    # Textos de ejemplo para probar
    texts = [
        "Me encantó esta película, los actores son excelentes.",
        "Eres un idiota, no sabes nada de nada.",
        "Este producto es de muy buena calidad, lo recomiendo.",
        "Voy a matarte si sigues molestándome, eres un imbécil.",
        "La atención al cliente fue excelente, muy amables todos."
    ]
    
    # Comparar modelos
    compare_models(texts, model_paths, args.tokenizer)

if __name__ == "__main__":
    main()

# Ejemplo de uso:
# python test_quantized_model.py --standard_model ../Models/deberta_toxic_comments/ --int8_model ../Models/deberta_toxic_comments_quantized/