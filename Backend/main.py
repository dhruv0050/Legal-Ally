from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat
import uvicorn
import os

app = FastAPI(title="Legal GPT Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(chat.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Legal GPT Backend Running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
