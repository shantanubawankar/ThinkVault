from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, chat

app = FastAPI(title="ThinkVault API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.get("/")
async def health_check():
    """Health check endpoint."""
    return {"status": "ThinkVault is running"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8002))
    uvicorn.run(app, host="0.0.0.0", port=port)
