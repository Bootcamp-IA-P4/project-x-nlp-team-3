import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.youtube.main import get_all_videos_metadata_from_channel
from src.utils.csv_utils import write_csv
import pandas as pd

channel_id = "UCVEKr1uiurERtPiRR7mME4Q"  # Cambia por el canal que quieras
metadata = get_all_videos_metadata_from_channel(channel_id, total_max=120)
df = pd.DataFrame(metadata)
write_csv(df, "videos_metadata.csv")
print(df.head())