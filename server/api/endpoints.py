
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import joblib

router = APIRouter()


try:
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'pipeline_multinomial_nb.pkl')
    model_path = os.path.abspath(model_path)  # Resuelve path relativo a absoluto
    clf = joblib.load(model_path)
    print(f"✅ Modelo NLP cargado exitosamente desde {model_path}")
except Exception as e:
    print(f"❌ Error cargando modelo NLP: {e}")
    clf = None



class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    prediction: str
    input_text: str



@router.post("/predict", response_model=PredictionResponse)
async def predict_toxicity(data: PredictionRequest):
    if clf is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        input_text = data.text
        prediction = clf.predict([input_text])[0]

        return PredictionResponse(
            prediction=str(prediction),
            input_text=input_text
        )
    
    except Exception as e:
        print(f"❌ Error en predicción NLP: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")



@router.get("/")
def read_root():
    return {
        "message": "Welcome to the NLP FastAPI server!",
        "model_loaded": clf is not None
    }