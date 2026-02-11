from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_chain import LegalLLMChain
from typing import List, Optional

router = APIRouter()
# Lazy initialization to allow startup without hitting API limits immediately
llm_chain = None

class ChatRequest(BaseModel):
    query: str
    metadata_filter: Optional[dict] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]

@router.on_event("startup")
async def startup_event():
    global llm_chain
    try:
        llm_chain = LegalLLMChain()
        print("Backend initialized successfully")
    except Exception as e:
        print(f"Failed to initialize LLM Chain: {e}")

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    global llm_chain
    if not llm_chain:
        try:
             llm_chain = LegalLLMChain()
        except Exception as e:
             raise HTTPException(status_code=500, detail=f"Service not initialized: {str(e)}")
             
    try:
        result = llm_chain.get_response(request.query)
        return ChatResponse(
            answer=result["answer"],
            sources=result["source_documents"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
