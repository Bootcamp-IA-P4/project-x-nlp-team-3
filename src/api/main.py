from fastapi import FastAPI, Query
from typing import List
import requests
import pandas as pd

app = FastAPI()
# Usamos dotenv para traer la clave de API de YouTube
import os
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

def get_video_metadata(video_id):
    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet,statistics",
        "id": video_id,
        "key": API_KEY
    }
    resp = requests.get(url, params=params)
    items = resp.json().get("items", [])
    if not items:
        return {}
    item = items[0]
    snippet = item.get("snippet", {})
    stats = item.get("statistics", {})
    return {
        "video_id": video_id,
        "video_title": snippet.get("title"),
        "video_published": snippet.get("publishedAt"),
        "channel_id": snippet.get("channelId"),
        "channel_title": snippet.get("channelTitle"),
        "view_count": stats.get("viewCount"),
        "like_count": stats.get("likeCount"),
        "comment_count": stats.get("commentCount"),
    }

def get_comments(video_id, max_results=100):
    url = "https://www.googleapis.com/youtube/v3/commentThreads"
    params = {
        "part": "snippet",
        "videoId": video_id,
        "key": API_KEY,
        "maxResults": 100,
        "textFormat": "plainText"
    }
    comments = []
    while len(comments) < max_results:
        resp = requests.get(url, params=params)
        data = resp.json()
        for item in data.get("items", []):
            snippet = item["snippet"]["topLevelComment"]["snippet"]
            comments.append({
                "comment_id": item["id"],
                "author": snippet.get("authorDisplayName"),
                "comment": snippet.get("textDisplay"),
                "published_at": snippet.get("publishedAt"),
                "like_count": snippet.get("likeCount"),
            })
            if len(comments) >= max_results:
                break
        if "nextPageToken" in data and len(comments) < max_results:
            params["pageToken"] = data["nextPageToken"]
        else:
            break
    return comments

@app.get("/fetch_comments/")
def fetch_comments(video_ids: List[str] = Query(...), max_results: int = 100):
    rows = []
    for video_id in video_ids:
        meta = get_video_metadata(video_id)
        if not meta:
            continue
        comments = get_comments(video_id, max_results=max_results)
        for c in comments:
            row = {**meta, **c}
            rows.append(row)
    df = pd.DataFrame(rows)
    df.to_csv("youtube_comments.csv", index=False)
    return {"message": f"Guardados {len(rows)} comentarios en youtube_comments.csv"}
