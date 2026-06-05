import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """
You are ThinkVault, a smart AI study assistant for university students. 

RESPONSE FORMATTING RULES - ALWAYS FOLLOW THESE: 
- Use proper markdown formatting in every response 
- Use ## for main headings, ### for subheadings 
- Use **bold** for important terms and key concepts 
- Use bullet points (- ) for lists 
- Use numbered lists (1. 2. 3.) for steps or sequences 
- Use code blocks for formulas or technical content 
- Keep responses clean, structured and easy to read 
- Never write in ALL CAPS 
- Never write long unbroken paragraphs 
- Always add a blank line between sections 
- Keep a friendly, encouraging and conversational tone 

BEHAVIOR RULES: 
- For general questions: give a short friendly answer with bullet points 
- When asked to SUMMARIZE: use ## headings for each topic, bullet points for key points 
- When asked to QUIZ: number each question clearly, show answers in a separate ## Answers section 
- When asked for FLASHCARDS: format strictly as: 
  **Q:** [question] 
  **A:** [answer] 
  (one blank line between each flashcard) 
- When asked to EXPLAIN: use simple language, real examples, and analogies 
- When asked for a STUDY PLAN: break into days with ### Day 1, ### Day 2 format 
- Always refer to uploaded notes when files are provided 
- End every response with a short motivational tip on a new line starting with 💡 Tip: 

IMPORTANT: Never respond in plain unformatted text. Always use markdown structure.
"""

class ThinkVaultServiceError(Exception):
    def __init__(self, user_message: str, status_code: int = 500):
        super().__init__(user_message)
        self.user_message = user_message
        self.status_code = status_code

def get_response(message: str, history: list, files_context: str = None) -> str:
    api_key = os.getenv("NVIDIA_API_KEY", "").strip()
    if not api_key:
        raise ThinkVaultServiceError(
            "Add a valid NVIDIA_API_KEY in backend/.env and restart the server.",
            status_code=503
        )
    client = OpenAI(
        api_key=api_key,
        base_url="https://integrate.api.nvidia.com/v1"
    )
    full_system_prompt = SYSTEM_PROMPT
    if files_context:
        print(f"DEBUG: Attaching file context to prompt ({len(files_context)} characters)")
        full_system_prompt += "\n\nUPLOADED NOTES:\n" + files_context
    else:
        print("DEBUG: No file context provided for this request")
    formatted_history = []
    for msg in history:
        role = getattr(msg, "role", None) or msg.get("role")
        content = getattr(msg, "content", None) or msg.get("content")
        formatted_history.append({"role": role, "content": content})
    formatted_history.append({"role": "user", "content": message})
    try:
        print(f"Sending request to AI with model: meta/llama-3.1-8b-instruct")
        response = client.chat.completions.create(
            model="meta/llama-3.1-8b-instruct",
            messages=[{"role": "system", "content": full_system_prompt}] + formatted_history,
            max_tokens=1024,
            temperature=0.7,
            timeout=30.0
        )
        reply = response.choices[0].message.content
        print(f"AI Response received: {reply[:50]}...")
        return reply
    except ThinkVaultServiceError:
        raise
    except Exception as exc:
        print(f"AI Service Error: {str(exc)}")
        raise ThinkVaultServiceError(
            "ThinkVault encountered an error: " + str(exc),
            status_code=500
        ) from exc