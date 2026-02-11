import os
import json
import time
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Load environment variables
load_dotenv()

# Configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
INDEX_NAME = "legal-bot"
DATA_PATH = r"c:\Users\dhruv\OneDrive\Desktop\Legal GPT\Backend\data\processed_legal_data.json"
BATCH_SIZE = 100 

def init_pinecone():
    if not PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY not found in .env file")
    
    pc = Pinecone(api_key=PINECONE_API_KEY)
    
    # Check if index exists, if not create it
    existing_indexes = [i.name for i in pc.list_indexes()]
    if INDEX_NAME not in existing_indexes:
        print(f"Creating index: {INDEX_NAME}...")
        # Google Embeddings are 768 dimensions
        pc.create_index(
            name=INDEX_NAME,
            dimension=3072, 
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        # Wait for index to be ready
        while not pc.describe_index(INDEX_NAME).status['ready']:
            time.sleep(1)
            
    return pc.Index(INDEX_NAME)

def load_data():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Processed data not found at {DATA_PATH}. Run preprocessing.py first.")
    
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_embeddings_and_upsert(index, data):
    print("Initializing embedding model (Google gemini-embedding-001)...")
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in .env")

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=GOOGLE_API_KEY
    )
    
    total_docs = len(data)
    print(f"Starting ingestion of {total_docs} documents...")
    
    for i in range(0, total_docs, BATCH_SIZE):
        batch = data[i:i + BATCH_SIZE]
        
        # Prepare batch for formatting
        texts = [doc['text'] for doc in batch]
        ids = [doc['id'] for doc in batch]
        metadatas = [doc['metadata'] for doc in batch]
        
        # Add text to metadata so it can be retrieved later (Pinecone best practice for RAG)
        for j, meta in enumerate(metadatas):
            meta['text'] = texts[j]

        # Generate vectors
        print(f"Embedding batch {i//BATCH_SIZE + 1}/{(total_docs + BATCH_SIZE - 1)//BATCH_SIZE}...")
        try:
            vectors = embeddings.embed_documents(texts)
            
            # Zip into Pinecone format
            to_upsert = list(zip(ids, vectors, metadatas))
            
            # Upsert
            index.upsert(vectors=to_upsert)
            print(f"Upserted {len(batch)} vectors.")
        except Exception as e:
            print(f"Error embedding batch: {e}")
            continue

    print("Ingestion complete!")

if __name__ == "__main__":
    try:
        index = init_pinecone()
        data = load_data()
        generate_embeddings_and_upsert(index, data)
    except Exception as e:
        print(f"Error: {e}")
