import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.youtube.api_client import get_comments, get_videos_metadata
from src.utils.csv_utils import read_csv, append_csv
from src.utils import csv_utils
from src.utils.logger import get_logger
import pandas as pd
import requests

logger = get_logger()
PROCESSED_FILE = "data/processed/processed_videos.csv"

# def load_processed_videos(filepath):
#     if not os.path.exists(filepath):
#         return set()
#     with open(filepath, "r") as f:
#         return set(line.strip() for line in f.readlines() if line.strip())

def load_processed_videos_csv(filepath):
    if not os.path.exists(filepath):
        return set()
    try:
        df = pd.read_csv(filepath)
        return set(df['video_id'].astype(str).str.strip())
    except Exception as e:
        logger.error(f"Error leyendo {filepath}: {e}")
        return set()

# def save_processed_videos(video_ids, filepath):
#     with open(filepath, "a") as f:
#         for vid in video_ids:
#             f.write(f"{vid.strip()}\n")

def save_processed_videos_csv(video_ids, filepath):
    if not video_ids:
        return
    df = pd.DataFrame({'video_id': list(video_ids)})
    # Debug: mostramos las primeras filas del DataFrame
    print(f"DataFrame de vídeos procesados:\n{df.head()}")
    append_csv(df, filepath)

def fetch_comments_from_csv(metadata_csv, output_csv, processed_file):
    df = read_csv(metadata_csv)
    print(f"DataFrame de metadatos:\n{df.head()}")
    df.columns = df.columns.str.strip()
    df = df.drop_duplicates(subset=['video_id'])
    print(f"DataFrame sin duplicados:\n{df.head()}")
    processed_video_ids = load_processed_videos_csv(processed_file)
    all_comments = []
    new_video_ids = []
    total_comments = 0
    for idx, row in df.iterrows():
        video_id = str(row['video_id']).strip()
        print(f"Video ID: {video_id}")
        if video_id in processed_video_ids:
            logger.info(f"Saltando vídeo ya procesado: {video_id}")
            continue
        logger.info(f"Extrayendo comentarios de vídeo: {video_id}")
        meta = row.to_dict()
        comments = get_comments(video_id, max_results=10000)
        logger.info(f"{len(comments)} comentarios extraídos para vídeo {video_id}")
        total_comments += len(comments)
        for c in comments:
            all_comments.append({**meta, **c})
        print(f"Comentarios extraídos para {video_id}: {len(comments)}")
        new_video_ids.append(video_id)
    if all_comments:
        comments_df = pd.DataFrame(all_comments)
        append_csv(comments_df, output_csv)
        logger.info(f"{len(comments_df)} comentarios añadidos a {output_csv}")
    else:
        logger.warning("No se extrajeron comentarios para ningún vídeo nuevo.")
    if new_video_ids:
        save_processed_videos_csv(new_video_ids, processed_file)
        logger.info(f"IDs de vídeos procesados añadidos a {processed_file}")
    logger.info(f"Total de comentarios extraídos en esta ejecución: {total_comments}")

if __name__ == "__main__":
    fetch_comments_from_csv(
        "data/videos/videos_metadata.csv",
        "data/comments/all_comments.csv",
        PROCESSED_FILE
    )