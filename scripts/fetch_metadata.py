import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'api')))
from src.api.main import get_all_videos_metadata_from_channel
import pandas as pd

channel_id = "UCVEKr1uiurERtPiRR7mME4Q"  # Cambia por el canal que quieras
metadata = get_all_videos_metadata_from_channel(channel_id, total_max=120)
df = pd.DataFrame(metadata)
df.to_csv("videos_metadata.csv", index=False)
print(df.head())