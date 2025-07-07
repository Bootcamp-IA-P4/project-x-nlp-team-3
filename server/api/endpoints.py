
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import joblib
from server.database.save_comment import save_comment
from server.database.db_connection import supabase

router = APIRouter()


try:
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'pipeline_multinomial_nb_new.pkl')
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

        data_to_save = {
            "text": input_text,
            "label": str(prediction)
        }

        save_result = save_comment(data_to_save)
        if save_result is None:
            print("❌ Error al guardar el comentario en la base de datos")

        return PredictionResponse(
            prediction=str(prediction),
            input_text=input_text
        )
    
    except Exception as e:
        print(f"❌ Error en predicción NLP: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
    


@router.get("/historial")
async def get_historial():
    try:
        response = supabase.table("predict_toxic").select("*").order("created_at", desc=True).execute()
        if response.data is None:
            return []
        return response.data
    except Exception as e:
        print(f"❌ Error al obtener historial: {e}")
        raise HTTPException(status_code=500, detail="Error fetching historial")



@router.get("/")
def read_root():
    return {
        "message": "Welcome to the NLP FastAPI server!",
        "model_loaded": clf is not None
    }