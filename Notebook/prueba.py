import joblib

# Cargar el pipeline que incluye el vectorizador y el modelo
pipeline = joblib.load('pipeline_multinomial_nb.pkl')

def predict_hate_speech(text):
    # Hacer la predicción y obtener probabilidades
    prediction = pipeline.predict([text])[0]
    probabilities = pipeline.predict_proba([text])[0]
    # Obtener el porcentaje de la clase predicha
    confidence = probabilities[1] if prediction else probabilities[0]
    return prediction, confidence * 100

def main():
    print("Detector de Discurso de Odio")
    print("----------------------------")
    while True:
        # Solicitar texto al usuario
        text = input("\nIntroduce un texto en inglés (o 'q' para salir): ")
        
        if text.lower() == 'q':
            break
        
        # Obtener la predicción y confianza
        result, confidence = predict_hate_speech(text)
        
        # Mostrar el resultado
        if result:
            print(f"⚠️ Este texto se ha clasificado como discurso de odio con un {confidence:.1f}% de probabilidad.")
        else:
            print(f"✅ Este texto se ha clasificado como no ofensivo con un {confidence:.1f}% de probabilidad.")

if __name__ == "__main__":
    main()