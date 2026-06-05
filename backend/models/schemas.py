from pydantic import BaseModel
from typing import List, Optional

class FileInfo(BaseModel):
    name: str
    content: str
    size: int

class UploadResponse(BaseModel):
    files: List[FileInfo]

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]
    files_context: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
