
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import joblib
from server.database.save_comment import save_comment
from server.database.db_connection import supabase
from googleapiclient.discovery import build
from urllib.parse import urlparse, parse_qs
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from server.pipeline import preprocess_text

router = APIRouter()

try:
    clf_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'pipeline_multinomial_nb.pkl')
    clf_path = os.path.abspath(clf_path)
    clf = joblib.load(clf_path)
    print(f"✅ Modelo ML cargado exitosamente desde {clf_path}")
except Exception as e:
    print(f"❌ Error cargando modelo ML: {e}")
    clf = None


try:
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'model_transformer')
    model_path = os.path.abspath(model_path)  # Resuelve path relativo a absoluto
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model_transformer = AutoModelForSequenceClassification.from_pretrained(model_path)
    print(f"✅ Modelo NLP cargado exitosamente desde {model_path}")
except Exception as e:
    print(f"❌ Error cargando modelo NLP: {e}")
    tokenizer = None
    model_transformer = None

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

class YouTubeRequest(BaseModel):
    url: str

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    prediction: str
    input_text: str



@router.post("/predict_ml", response_model=PredictionResponse)
async def predict_toxicity(data: PredictionRequest):
    if clf is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        input_text = preprocess_text(data.text)
        prediction = clf.predict([input_text])[0]

        data_to_save = {
            "text": input_text,
            "label": str(prediction),
            "model": "MultinomialNB"
        }

        save_result = save_comment(data_to_save)
        if save_result is None:
            print("❌ Error al guardar el comentario en la base de datos")

        return PredictionResponse(
            prediction=str(prediction),
            input_text=input_text
        )
    
    except Exception as e:
        print(f"❌ Error en predicción ML: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

@router.post("/predict_nlp", response_model=PredictionResponse)
async def predict_toxicity_nlp(data: PredictionRequest):
    if model_transformer is None or tokenizer is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        input_text = preprocess_text(data.text)

        inputs = tokenizer(
            input_text,
            return_tensors="pt",
            truncation=True,
            padding=True
        )

        with torch.no_grad():
            outputs = model_transformer(**inputs)
            logits = outputs.logits
            predicted_class_id = logits.argmax().item()

        data_to_save = {
            "text": input_text,
            "label": str(predicted_class_id),
            "model": "transformer"
        }

        save_result = save_comment(data_to_save)
        if save_result is None:
            print("❌ Error al guardar el comentario en la base de datos")

        return PredictionResponse(
            prediction=str(predicted_class_id),
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
        "model_loaded": clf is not None or model_transformer is not None or tokenizer is not None
    }

@router.post("/predict/youtube_comments")
async def predict_youtube_comments(data: YouTubeRequest):
    if clf is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        video_id = extract_video_id(data.url)
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
        preprocess_text(comments)
        comments = get_comments(youtube, video_id)
        video_info = get_video_info(youtube, video_id)

        results = []
        for comment in comments:
            pred = clf.predict([comment])[0]
            results.append({
                "text": comment,
                "prediction": str(pred)
            })

            # Guardar en DB si deseas
            data_to_save = {
                "text": comment,
                "label": str(pred),
                "model": "MultinomialNB"
            }
            save_result = save_comment(data_to_save)
            if save_result is None:
                print("❌ Error al guardar el comentario en la base de datos")

        return {
            "video_id": video_id,
            "video_info": video_info,
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


def get_comments(youtube, video_id, max_results=100):
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


@router.post("/predict/youtube_comments_transformer")
async def predict_youtube_comments_nlp(data: YouTubeRequest):
    if model_transformer is None or tokenizer is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        video_id = extract_video_id(data.url)
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
        preprocess_text(comments)
        comments = get_comments(youtube, video_id)
        video_info = get_video_info(youtube, video_id)

        results = []
        for comment in comments:
            inputs = tokenizer(
                comment,
                return_tensors="pt",
                truncation=True,
                max_length=128,
                padding="max_length"
            )

            with torch.no_grad():
                outputs = model_transformer(**inputs)
                logits = outputs.logits
                predicted_class_id = logits.argmax().item()

            results.append({
                "text": comment,
                "prediction": str(predicted_class_id)
            })

            data_to_save = {
                "text": comment,
                "label": str(predicted_class_id),
                "model": "transformer"
            }
            save_result = save_comment(data_to_save)
            if save_result is None:
                print("❌ Error al guardar el comentario en la base de datos")

        return {
            "video_id": video_id,
            "video_info": video_info,
            "results": results
        }

    except Exception as e:
        print(f"❌ Error en predict_youtube_comments: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
    
    
def get_video_info(youtube, video_id):
    try:
        request = youtube.videos().list(
            part="snippet,statistics",
            id=video_id
        )
        response = request.execute()
        if "items" in response and len(response["items"]) > 0:
            item = response["items"][0]
            title = item["snippet"]["title"]
            channel = item["snippet"]["channelTitle"]
            views = int(item["statistics"]["viewCount"])
            return {
                "title": title,
                "channel": channel,
                "views": views
            }
        else:
            return {
                "title": "Video procesado",
                "channel": "Canal desconocido",
                "views": 0
            }
    except Exception as e:
        print(f"❌ Error obteniendo información del video: {e}")
        return {
            "title": "Video procesado",
            "channel": "Canal desconocido",
            "views": 0
        }



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


def get_comments(youtube, video_id, max_results=200):
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