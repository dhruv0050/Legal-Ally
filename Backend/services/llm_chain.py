from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from services.retriever import LegalRetriever
from prompts.legal_prompts import legal_prompt
import os
from dotenv import load_dotenv

load_dotenv()

class LegalLLMChain:
    def __init__(self):
        self.retriever = LegalRetriever()
        
        # Initialize Groq
        # Ensure GROQ_API_KEY is in your .env file
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
             raise ValueError("GROQ_API_KEY not found in .env")
             
        # Using Llama-3.3-70b-versatile for high-quality reasoning
        self.llm = ChatGroq(
            temperature=0,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key
        )

    def get_response(self, query):
        # 1. Retrieve relevant documents
        # Note: retriever uses Google Embeddings internally
        docs = self.retriever.get_relevant_documents(query)
        context = "\n\n".join([d.page_content for d in docs])
        
        if not context:
            # Fallback if no relevant docs found?
            # Or just pass empty context - the prompt handles it
            pass

        # 2. Generate response using LLM (Groq)
        chain = legal_prompt | self.llm
        
        response = chain.invoke({"context": context, "question": query})
        
        return {
            "answer": response.content,
            "source_documents": [d.metadata for d in docs]
        }
