
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import joblib
from server.database.save_comment import save_comment
from server.database.db_connection import supabase
from googleapiclient.discovery import build
from urllib.parse import urlparse, parse_qs
from transformers import AutoTokenizer, AutoModelForSequenceClassification

router = APIRouter()


try:
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'model_transformer.safetensors')
    model_path = os.path.abspath(model_path)  # Resuelve path relativo a absoluto
    # clf = joblib.load(model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    print(f"✅ Modelo NLP cargado exitosamente desde {model_path}")
except Exception as e:
    print(f"❌ Error cargando modelo NLP: {e}")
    clf = None
    tokenizer = None
    model = None

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

class YouTubeRequest(BaseModel):
    url: str

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

@router.post("/predict/youtube_comments")
async def predict_youtube_comments(data: YouTubeRequest):
    if clf is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        video_id = extract_video_id(data.url)
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        comments = get_comments(youtube, video_id)

        results = []
        for comment in comments:
            pred = clf.predict([comment])[0]
            results.append({
                "text": comment,
                "prediction": str(pred)
            })

            # Guardar en DB si deseas
            # data_to_save = {
            #     "text": comment,
            #     "label": str(pred)
            # }
            # save_result = save_comment(data_to_save)
            # if save_result is None:
            #     print("❌ Error al guardar el comentario en la base de datos")

        return {
            "video_id": video_id,
            "results": results
        }

    except Exception as e:
        print(f"❌ Error en predict_youtube_comments: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")



def extract_video_id(url):
    try:
        parsed_url = urlparse(url)
        if parsed_url.hostname in ['www.youtube.com', 'youtube.com']:
            qs = parse_qs(parsed_url.query)
            return qs.get('v', [None])[0]
        elif parsed_url.hostname == 'youtu.be':
            return parsed_url.path[1:]
        else:
            return None
    except Exception as e:
        print(f"❌ Error extrayendo video_id: {e}")
        return None


def get_comments(youtube, video_id, max_results=500):
    comments = []
    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=100,
        textFormat="plainText"
    )
    while request and len(comments) < max_results:
        response = request.execute()
        for item in response['items']:
            comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
            comments.append(comment)
            if len(comments) >= max_results:
                break
        request = youtube.commentThreads().list_next(request, response)
    return comments