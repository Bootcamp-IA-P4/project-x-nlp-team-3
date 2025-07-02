# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api import endpoints

app = FastAPI(title="YouToxic Toxicity Classifier")

# CORS para frontends locales o deploy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(endpoints.router)

