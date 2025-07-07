import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from youtube.api_client import get_all_videos_metadata_from_channel
from src.utils.csv_utils import append_csv
from src.utils.logger import get_logger
import pandas as pd

logger = get_logger()

channel_id = "UCVEKr1uiurERtPiRR7mME4Q"  # Cambia por el canal que quieras
metadata = get_all_videos_metadata_from_channel(channel_id, total_max=120)
df = pd.DataFrame(metadata)
append_csv(df, "videos_metadata.csv")
logger.info(f"Metadatos de vídeos añadidos a videos_metadata.csv")
print(df.head())