import requests
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

def get_videos_metadata(video_ids):
    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet,statistics",
        "id": ",".join(video_ids),
        "key": API_KEY
    }
    resp = requests.get(url, params=params)
    items = resp.json().get("items", [])
    metadata = []
    for item in items:
        snippet = item.get("snippet", {})
        stats = item.get("statistics", {})
        metadata.append({
            "video_id": item.get("id"),
            "video_title": snippet.get("title"),
            "video_published": snippet.get("publishedAt"),
            "channel_id": snippet.get("channelId"),
            "channel_title": snippet.get("channelTitle"),
            "view_count": stats.get("viewCount"),
            "like_count": stats.get("likeCount"),
            "comment_count": stats.get("commentCount"),
        })
    return metadata

# def get_comments(video_id, max_results=10000):
#     url = "https://www.googleapis.com/youtube/v3/commentThreads"
#     params = {
#         "part": "snippet",
#         "videoId": video_id,
#         "key": API_KEY,
#         "maxResults": 100,
#         "textFormat": "plainText"
#     }
#     comments = []
#     while len(comments) < max_results:
#         resp = requests.get(url, params=params)
#         data = resp.json()
#         for item in data.get("items", []):
#             snippet = item["snippet"]["topLevelComment"]["snippet"]
#             comments.append({
#                 "comment_id": item["id"],
#                 "author": snippet.get("authorDisplayName"),
#                 "comment": snippet.get("textDisplay"),
#                 "published_at": snippet.get("publishedAt"),
#                 "like_count": snippet.get("likeCount"),
#             })
#             if len(comments) >= max_results:
#                 break
#         if "nextPageToken" in data and len(comments) < max_results:
#             params["pageToken"] = data["nextPageToken"]
#         else:
#             break
#     return comments

def get_comments(video_id, max_results=10000):
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
        print(f"URL: {resp.url}")
        print(f"Status code: {resp.status_code}")
        print(f"Response: {resp.text[:500]}")  # Solo los primeros 500 caracteres
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

def get_video_ids_from_channel(channel_id, max_results=50):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "key": API_KEY,
        "channelId": channel_id,
        "part": "id",
        "order": "date",
        "maxResults": max_results,
        "type": "video"
    }
    resp = requests.get(url, params=params)
    items = resp.json().get("items", [])
    video_ids = [item["id"]["videoId"] for item in items if item["id"]["kind"] == "youtube#video"]
    return video_ids

def get_all_videos_metadata_from_channel(channel_id, total_max=200):
    video_ids = []
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "key": API_KEY,
        "channelId": channel_id,
        "part": "id",
        "order": "date",
        "maxResults": 50,
        "type": "video"
    }
    while len(video_ids) < total_max:
        resp = requests.get(url, params=params)
        data = resp.json()
        items = data.get("items", [])
        ids = [item["id"]["videoId"] for item in items if item["id"]["kind"] == "youtube#video"]
        video_ids.extend(ids)
        if "nextPageToken" in data and len(video_ids) < total_max:
            params["pageToken"] = data["nextPageToken"]
        else:
            break
    video_ids = video_ids[:total_max]
    all_metadata = []
    for i in range(0, len(video_ids), 50):
        batch_ids = video_ids[i:i+50]
        all_metadata.extend(get_videos_metadata(batch_ids))
    return all_metadata
