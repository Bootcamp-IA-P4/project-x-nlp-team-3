import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.youtube.main import get_comments, get_videos_metadata
from src.utils.csv_utils import read_csv, write_csv
import pandas as pd

def fetch_comments_from_csv(metadata_csv, output_csv):
    df = read_csv(metadata_csv)
    all_comments = []
    for idx, row in df.iterrows():
        video_id = row['video_id']
        print(f"Extrayendo comentarios de vídeo: {video_id}")
        meta = row.to_dict()
        comments = get_comments(video_id, max_results=10000)
        for c in comments:
            all_comments.append({**meta, **c})
    comments_df = pd.DataFrame(all_comments)
    write_csv(comments_df, output_csv)
    print(f"Comentarios guardados en {output_csv}")

if __name__ == "__main__":
    fetch_comments_from_csv("videos_metadata.csv", "all_comments.csv")