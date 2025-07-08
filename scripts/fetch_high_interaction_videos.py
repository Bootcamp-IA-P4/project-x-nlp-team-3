import os
import pandas as pd
from googleapiclient.discovery import build
from src.utils.csv_utils import append_csv
from src.utils.logger import get_logger
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")  # Asegúrate de tener YOUTUBE_API_KEY en tu .env

# Lista de regiones angloparlantes
REGIONS = ["US", "GB", "AU", "CA", "IE", "NZ"]  # Puedes añadir más si lo deseas
MIN_RATIO = 0.01  # 1% comentarios/views
MAX_RESULTS = 50
OUTPUT_CSV = "data/videos/videos_metadata.csv"

logger = get_logger()

def get_high_interaction_videos(region):
    youtube = build("youtube", "v3", developerKey=API_KEY)
    request = youtube.videos().list(
        part="snippet,statistics",
        chart="mostPopular",
        regionCode=region,
        maxResults=MAX_RESULTS
    )
    response = request.execute()
    rows = []
    for item in response['items']:
        stats = item['statistics']
        views = int(stats.get('viewCount', 0))
        comments = int(stats.get('commentCount', 0))
        if views > 0 and (comments / views) > MIN_RATIO:
            row = {
                "video_id": item['id'],
                "title": item['snippet']['title'],
                "publishedAt": item['snippet']['publishedAt'],
                "channelTitle": item['snippet']['channelTitle'],
                "region": region,
                "viewCount": views,
                "commentCount": comments,
                "likeCount": stats.get('likeCount', 0)
            }
            rows.append(row)
    df = pd.DataFrame(rows)
    append_csv(df, OUTPUT_CSV)
    logger.info(f"Guardados {len(df)} vídeos de la región {region} en {OUTPUT_CSV}")
    print(f"Guardados {len(df)} vídeos de la región {region} en {OUTPUT_CSV}")

if __name__ == "__main__":
    for region in REGIONS:
        get_high_interaction_videos(region)