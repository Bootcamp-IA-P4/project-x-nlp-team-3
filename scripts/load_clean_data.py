import gzip
import requests
from io import BytesIO, StringIO
import pandas as pd
# URL to the cleaned comments data on GitHub
GITHUB_CLEAN_URL = "https://raw.githubusercontent.com/Bootcamp-IA-P4/Bootcamp-IA-P4-project-x-nlp-team-3/feature/eda/Data/comments_data_clean.csv"

def load_comments_data_from_github(url):
    """
    Downloading and processing comments data from GitHub repository.
    """
    print("🔗 Downloading data from GitHub...")

    try:
        response = requests.get(url)
        response.raise_for_status()

        print("📊 Reading CSV file...")

        df = pd.read_csv(StringIO(response.text))

        print("✅ Data downloaded successfully!")
        print(df.head())  # Display the first few rows of the dataframe
        return df

    except Exception as e:
        print(f"❌ Error while downloading data: {e}")
        return None

# Creating dataframe from GitHub URL
df = load_comments_data_from_github(GITHUB_CLEAN_URL)