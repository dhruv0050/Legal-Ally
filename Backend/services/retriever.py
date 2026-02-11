from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone
import os
from dotenv import load_dotenv

load_dotenv()

class LegalRetriever:
    def __init__(self):
        self.api_key = os.getenv("PINECONE_API_KEY")
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.index_name = "legal-bot"
        
        if not self.api_key:
            raise ValueError("PINECONE_API_KEY not found in .env")
        
        if not self.google_api_key:
            raise ValueError("GOOGLE_API_KEY not found in .env")

        # Switch to Google Embeddings (Model: gemini-embedding-001)
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=self.google_api_key
        )
        
        # Initialize Pinecone (v3+ API)
        self.pc = Pinecone(api_key=self.api_key)
        self.index = self.pc.Index(self.index_name)
        
        # Use langchain-pinecone package for proper v3+ support
        self.vectorstore = PineconeVectorStore(
            index=self.index,
            embedding=self.embeddings,
            text_key="text"
        )

    def get_relevant_documents(self, query, k=2, metadata_filter=None):
        search_kwargs = {"k": k}
        if metadata_filter:
            search_kwargs["filter"] = metadata_filter
            
        return self.vectorstore.similarity_search(query, **search_kwargs)

def get_retriever():
    return LegalRetriever()
