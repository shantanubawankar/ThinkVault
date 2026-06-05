from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from models.schemas import UploadResponse, FileInfo
from services.file_parser import extract_pdf_text, extract_docx_text, extract_pptx_text

router = APIRouter()

@router.post("/", response_model=UploadResponse)
async def upload_files(files: List[UploadFile] = File(...)):
    """Handles file uploads and extracts text from them."""
    extracted_files = []
    
    for file in files:
        try:
            content_bytes = await file.read()
            filename = file.filename
            extension = filename.split(".")[-1].lower()
            
            extracted_text = ""
            if extension == "pdf":
                extracted_text = extract_pdf_text(content_bytes)
            elif extension == "docx":
                extracted_text = extract_docx_text(content_bytes)
            elif extension == "pptx":
                extracted_text = extract_pptx_text(content_bytes)
            elif extension == "txt":
                extracted_text = content_bytes.decode("utf-8", errors="ignore")
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {extension}")
            
            extracted_files.append(FileInfo(
                name=filename,
                content=extracted_text,
                size=len(content_bytes)
            ))
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing file {file.filename}: {str(e)}")
            
    return UploadResponse(files=extracted_files)
