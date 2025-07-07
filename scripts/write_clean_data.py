import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from scripts.load_clean_data import load_comments_data_from_github, GITHUB_CLEAN_URL
from src.utils.csv_utils import write_csv

def main():
    df = load_comments_data_from_github(GITHUB_CLEAN_URL)
    if df is not None:
        print("📄 Saving data to CSV file...")
        write_csv(df, "comments_data_clean.csv")
        print("✅ Datos guardados en comments_data_clean.csv")
    else:
        print("❌ No se pudieron descargar los datos.")

if __name__ == "__main__":
    main()