# quantization_code.py

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import os
import argparse
import gc
import gzip
import pickle  # Añade esta importación al inicio si no está

# Intentar importar bibliotecas opcionales
try:
    import bitsandbytes as bnb
    HAVE_BNB = True
except ImportError:
    HAVE_BNB = False
    print("bitsandbytes no está instalado. Instálalo con: pip install bitsandbytes")

try:
    from torch.quantization import quantize_dynamic
    HAVE_QUANTIZATION = True
except ImportError:
    HAVE_QUANTIZATION = False
    print("La API de cuantización de PyTorch no está disponible")

try:
    import torch.nn.utils.prune as prune
    HAVE_PRUNE = True
except ImportError:
    HAVE_PRUNE = False
    print("La API de pruning de PyTorch no está disponible")

# --- Funciones de optimización ---

def apply_pruning(model, amount=0.3):
    if not HAVE_PRUNE:
        print("Saltando pruning: no disponible")
        return model
    
    print(f"Aplicando pruning (amount={amount*100:.1f}%)...")
    for name, module in model.named_modules():
        if isinstance(module, torch.nn.Linear):
            prune.l1_unstructured(module, name='weight', amount=amount)
            prune.remove(module, 'weight')
    gc.collect()
    torch.cuda.empty_cache() if torch.cuda.is_available() else None
    return model

def apply_bnb_quantization(model, bits=8):
    if not HAVE_BNB:
        print("Saltando bitsandbytes: no disponible")
        return model

    print(f"Aplicando cuantización BNB {bits}-bit...")
    for name, module in model.named_modules():
        if isinstance(module, torch.nn.Linear):
            new_layer = bnb.nn.Linear8bitLt(
                module.in_features, 
                module.out_features, 
                bias=module.bias is not None,
                has_fp16_weights=False
            )
            new_layer.weight.data = module.weight.data
            if module.bias is not None:
                new_layer.bias.data = module.bias.data
            parent_name, child_name = name.rsplit('.', 1) if '.' in name else ('', name)
            parent = model
            if parent_name != '':
                for attr in parent_name.split('.'):
                    parent = getattr(parent, attr)
            setattr(parent, child_name, new_layer)
    return model

def apply_dynamic_int8_quantization(model):
    if not HAVE_QUANTIZATION:
        print("Saltando cuantización INT8: no disponible")
        return model

    print("Aplicando cuantización dinámica INT8...")
    model.cpu()
    return quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)

def compress_weights(model, threshold=1e-3):
    print(f"Comprimiendo pesos (threshold={threshold})...")
    for name, param in model.named_parameters():
        if 'weight' in name:
            mask = torch.abs(param.data) < threshold
            param.data[mask] = 0.0
    return model

# --- Pipeline principal ---

def apply_quantization(model_path, output_path=None, 
                       pruning=True, pruning_amount=0.3,
                       use_bnb=False, use_int8=False,
                       compress=True, threshold=1e-3):
    
    if output_path is None:
        output_path = model_path

    print(f"Cargando modelo desde {model_path}")
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    original_size = sum(p.numel() * p.element_size() for p in model.parameters()) / (1024 * 1024)
    print(f"Tamaño original: {original_size:.2f} MB")

    if use_int8:
        model = apply_dynamic_int8_quantization(model)
        int8_size = sum(p.numel() * p.element_size() for p in model.parameters()) / (1024 * 1024)
        print(f"Tamaño después de INT8: {int8_size:.2f} MB")
    else:
        print("Convirtiendo modelo a float16...")
        model = model.half()
        fp16_size = sum(p.numel() * p.element_size() for p in model.parameters()) / (1024 * 1024)
        print(f"Tamaño después de float16: {fp16_size:.2f} MB")
    
        if pruning:
            model = apply_pruning(model, amount=pruning_amount)
            pruned_size = sum(p.numel() * p.element_size() for p in model.parameters()) / (1024 * 1024)
            print(f"Tamaño después de pruning: {pruned_size:.2f} MB")

        if compress:
            model = compress_weights(model, threshold=threshold)
            compressed_size = sum(p.numel() * p.element_size() for p in model.parameters()) / (1024 * 1024)
            print(f"Tamaño después de compresión: {compressed_size:.2f} MB")

        if use_bnb:
            model = apply_bnb_quantization(model, bits=8)

    # Crear directorio si no existe
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    # Guardar modelo
    try:
        if use_int8:
            print("Guardando modelo INT8 en formato .pt.gz...")
            int8_path = os.path.join(output_path, "model_int8.pt.gz")
            with gzip.open(int8_path, "wb") as f:
                torch.save(model.state_dict(), f)
            print(f"Modelo INT8 guardado como {int8_path}")
        else:
            print(f"Guardando modelo en {output_path} (safetensors si es posible)...")
            try:
                model.save_pretrained(output_path, save_format="safetensors")
                print("Modelo guardado en formato safetensors")
            except Exception as e:
                print(f"No se pudo guardar como safetensors: {e}")
                model.save_pretrained(output_path)
                print("Modelo guardado en formato estándar")

            # Guardar también en .pt.gz por portabilidad
            print("Guardando también como .pt.gz...")
            ptgz_path = os.path.join(output_path, "model_optimized.pt.gz")
            with gzip.open(ptgz_path, "wb") as f:
                torch.save(model.state_dict(), f)
            print(f"Modelo guardado como {ptgz_path}")

    except Exception as e:
        print(f"No se pudo guardar el modelo: {e}")


    # Guardar tokenizador
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        tokenizer.save_pretrained(output_path)
        print("Tokenizador guardado")
    except Exception as e:
        print(f"No se pudo guardar el tokenizador: {e}")

    final_size = sum(p.numel() * p.element_size() for p in model.parameters()) / (1024 * 1024)
    print(f"\nResumen de la optimización:")
    print(f"Tamaño original: {original_size:.2f} MB")
    print(f"Tamaño final:    {final_size:.2f} MB")
    print(f"Reducción total: {(1 - final_size/original_size) * 100:.2f}%")

    return model

# --- CLI ---

def main():
    parser = argparse.ArgumentParser(description='Optimizar y cuantizar modelos Transformer')
    parser.add_argument('--model_path', type=str, required=True)
    parser.add_argument('--output_path', type=str, default=None)
    parser.add_argument('--pruning', action='store_true', default=False)
    parser.add_argument('--pruning_amount', type=float, default=0.3)
    parser.add_argument('--compress', action='store_true', default=False)
    parser.add_argument('--threshold', type=float, default=1e-3)
    parser.add_argument('--use_bnb', action='store_true', default=False)
    parser.add_argument('--int8', action='store_true', default=False, help='Usar cuantización INT8 (PyTorch)')

    args = parser.parse_args()
    apply_quantization(
        model_path=args.model_path,
        output_path=args.output_path,
        pruning=args.pruning,
        pruning_amount=args.pruning_amount,
        use_bnb=args.use_bnb,
        use_int8=args.int8,
        compress=args.compress,
        threshold=args.threshold
    )

if __name__ == "__main__":
    main()
