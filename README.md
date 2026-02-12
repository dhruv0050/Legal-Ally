# Legal Ally - Advanced Indian Legal Assistant

![Legal Ally Logo](Frontend/public/logo.png)

## Overview

**Legal Ally** is a sophisticated AI-powered legal assistant designed to simplify Indian law for everyone. By leveraging Retrieval-Augmented Generation (RAG), it provides accurate, context-aware legal advice based on Indian Penal Code (IPC), CrPC, CPC and other specialized acts.

The system combines powerful vector search (Pinecone) with advanced reasoning models (Llama 3 via Groq) to deliver actionable legal insights, case references, and procedural guidance.

## Screenshots

### Landing Page
_A modern, clean interface welcoming users to the platform._
![Landing Page](Frontend/public/landing.png)

### Interactive Chat Interface
_Seamless conversation with the AI, capable of understanding complex legal queries._
![Chat Interface](Frontend/public/chat.png)

### Detailed Legal Analysis
_Structured responses citing specific sections, reasoning, and actionable next steps._
![AI Response](Frontend/public/response.png)

---

## Key Features

*   **RAG Architecture**: Retrieves the most relevant legal sections from a vast knowledge base of Indian laws before generating a response.
*   **High-Performance Reasoning**: Powered by **Llama 3** (via Groq) for deep legal analysis and logical structuring.
*   **Semantic Search**: Uses **Google Gemini Embeddings** and **Pinecone** vector database to understand the *meaning* behind user queries, not just keywords.
*   **Structured Output**: Every response is organized into "Offences Identified", "Detailed Analysis", "Next Steps", and "Punishment" for clarity.
*   **Modern UI**: A responsive, aesthetic frontend built with **React** and **Tailwind CSS**.

## System Architecture

The project follows a **Retrieval-Augmented Generation (RAG)** architecture, split into two main pipelines:

### 1. Data Ingestion Pipeline (Offline)
Before the app runs, legal data is processed and stored for efficient retrieval.

1.  **Raw Data Collection**: We started with diverse JSON files containing acts like IPC, CrPC, MVA, CPC etc., each with different structures.
2.  **Preprocessing & Cleaning**:
    *   A custom `preprocessing.py` script standardized these files.
    *   Handled complex nested CSV strings (e.g., in Hindu Marriage Act).
    *   Normalized fields into a consistent dictionary: `{id, text, metadata}`.
    *   Cleaned text artifacts and whitespace.
3.  **Vector Embedding**: The cleaned data (`processed_legal_data.json`) is passed through **Google's Gemini Embedding Model**.
4.  **Vector Storage**: The resulting 3072-dimensional vectors are upserted into a **Pinecone** index for semantic search.

### 2. Query Execution Pipeline (Online)
When a user asks a question, the system queries the prepared knowledge base.

```mermaid
graph TD
    %% Styling
    classDef user stroke:#333,stroke-width:2px,fill:#fff,color:#000
    classDef system stroke:#6366f1,stroke-width:2px,fill:#eef2ff,color:#1e1b4b
    classDef db stroke:#059669,stroke-width:2px,fill:#ecfdf5,color:#064e3b
    classDef ai stroke:#7c3aed,stroke-width:2px,fill:#f5f3ff,color:#4c1d95

    subgraph User Interaction
        U[User Query] ::: user
        UI[React Frontend] ::: user
    end

    subgraph Backend Processing
        API{FastAPI Server} ::: system
        Embed[Google Gemini API] ::: ai
        LLM[Groq Llama 3] ::: ai
    end

    subgraph Knowledge Base
        VectorDB[(Pinecone DB)] ::: db
    end

    %% Flow
    U -->|1. Input| UI
    UI -->|2. POST /chat| API
    API -->|3. Create Query Embedding| Embed
    Embed -.->|Vector| API
    API -->|4. Semantic Search| VectorDB
    VectorDB -.->|5. Return Relevant Context| API
    API -->|6. Context + Query| LLM
    LLM -.->|7. Structured Response| API
    API -->|8. JSON Result| UI
    UI -->|9. Display| U
```

## Tech Stack

### Frontend
*   **React.js**: Component-based UI library.
*   **Tailwind CSS**: Utility-first styling for a custom design.
*   **Framer Motion**: Smooth animations and transitions.
*   **Vite**: Fast build tool and development server.

### Backend
*   **FastAPI**: High-performance Python web framework.
*   **LangChain**: Orchestration framework for LLM chains.
*   **Pinecone**: Serverless vector database for knowledge retrieval.
*   **Groq API**: Ultra-low latency inference for Llama 3 models.
*   **Google Gemini API**: State-of-the-art embedding models (`text-embedding-001`).

---

## Installation & Setup

### Prerequisites
*   Node.js & npm
*   Python 3.10+
*   API Keys for:
    *   **Groq** (LLM)
    *   **Google Gemini** (Embeddings)
    *   **Pinecone** (Vector DB)

### 1. Clone the Repository
```bash
git clone https://github.com/dhruv0050/Legal-Ally
cd Legal-Ally
```

### 2. Backend Setup
Navigate to the `Backend` directory and set up the Python environment.

```bash
cd Backend

# Create a virtual environment
python -m venv venv
# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables**:
Create a `.env` file in the `Backend` directory:
```ini
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

**Run the Backend Server**:
```bash
python main.py
# Server runs on http://localhost:8000
```

### 3. Frontend Setup
Navigate to the `Frontend` directory and install dependencies.

```bash
cd ../Frontend

# Install libraries
npm install

# Start the development server
npm run dev
# App runs on http://localhost:5173
```

---

## How It Works

1.  **Ingestion**: Legal documents (JSON/PDFs) are processed, chunked, and embedded into vectors using Google's embedding models.
2.  **Storage**: These vectors are stored in a Pinecone index for fast retrieval.
3.  **Query**: When a user asks a question, the backend converts it into a vector and searches Pinecone for relevant legal sections.
4.  **Reasoning**: The retrieved context + user query are sent to the Llama 3 model via Groq.
5.  **Response**: The model generates a structured legal opinion, which is displayed on the frontend.

---
*Disclaimer: This is an AI assistant for informational purposes only and does not constitute professional legal advice. Always consult with a qualified advocate for legal matters.*
