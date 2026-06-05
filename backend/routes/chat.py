from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.claude_service import ThinkVaultServiceError, get_response

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Handles chat messages and returns responses from Claude."""
    print(f"Received chat request: {request.message}")
    try:
        reply = get_response(
            message=request.message,
            history=request.history,
            files_context=request.files_context
        )
        return ChatResponse(reply=reply)
    except ThinkVaultServiceError as e:
        raise HTTPException(status_code=e.status_code, detail=e.user_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chat service: {str(e)}")
