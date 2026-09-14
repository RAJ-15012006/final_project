"""
rag_service.py
--------------
RAG (Retrieval-Augmented Generation) service.
Loads the curated competitive-programming knowledge base into a
ChromaDB vector database, then retrieves relevant context for
user queries before passing them to the LLM.

Architecture:
    knowledge_base.json → Chunking → Embeddings → ChromaDB
    User Query → Embed → Query ChromaDB → Retrieved Context → LLM
"""

import json
import os
import chromadb
from chromadb.utils import embedding_functions

# ── Embedding Function ────────────────────────────────────────────────────────
# We use SentenceTransformers (local, free, no API key needed)
# Model 'all-MiniLM-L6-v2' is small (80 MB) and accurate enough for this use case.
try:
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    print("[RAG] SentenceTransformer embedding function loaded.")
except Exception as e:
    print(f"[RAG Warning] Could not load SentenceTransformer: {e}. Using default embeddings.")
    sentence_transformer_ef = None


class RAGService:
    """
    Manages the ChromaDB vector database for competitive programming knowledge.
    """

    def __init__(self, db_path: str = "./chroma_db"):
        """
        Initializes a persistent ChromaDB client and gets/creates a collection.
        """
        self.client = chromadb.PersistentClient(path=db_path)
        self.collection_name = "leetcode_knowledge"
        self._collection_loaded = False

        try:
            if sentence_transformer_ef:
                self.collection = self.client.get_or_create_collection(
                    name=self.collection_name,
                    embedding_function=sentence_transformer_ef,
                    metadata={"hnsw:space": "cosine"},  # cosine similarity
                )
            else:
                self.collection = self.client.get_or_create_collection(
                    name=self.collection_name,
                    metadata={"hnsw:space": "cosine"},
                )
            print(f"[RAG] Collection '{self.collection_name}' ready.")
        except Exception as e:
            print(f"[RAG Error] Could not initialize ChromaDB collection: {e}")
            self.collection = None

    def _build_document(self, prob: dict) -> str:
        """
        Converts a problem dict into a rich text document for embedding.
        The richer the document, the better the semantic search results.
        """
        parts = [
            f"Problem: {prob.get('title', '')}",
            f"Category: {prob.get('category', '')}",
            f"Difficulty: {prob.get('difficulty', '')}",
            f"Understanding: {prob.get('understanding', '')}",
            f"Key Observation: {prob.get('key_observation', '')}",
            f"Brute Force: {prob.get('brute_force', '')}",
            f"Optimized Approach: {prob.get('optimized_approach', '')}",
            f"Time Complexity: {prob.get('time_complexity', '')}",
            f"Space Complexity: {prob.get('space_complexity', '')}",
            f"Common Mistakes: {prob.get('common_mistakes', '')}",
        ]
        return "\n".join(parts)

    def populate_knowledge_base(self, json_file_path: str):
        """
        Loads structured problem data from JSON into the vector database.
        Uses upsert so re-running on startup does not create duplicates.
        """
        if self.collection is None:
            print("[RAG] Collection not available. Skipping population.")
            return

        if not os.path.exists(json_file_path):
            print(f"[RAG] Knowledge base file not found: {json_file_path}")
            return

        with open(json_file_path, "r", encoding="utf-8") as f:
            problems = json.load(f)

        if not problems:
            print("[RAG] Knowledge base is empty.")
            return

        documents, metadatas, ids = [], [], []

        for prob in problems:
            title = prob.get("title", "Unknown")
            doc_id = title.lower().replace(" ", "-").replace("/", "-")

            documents.append(self._build_document(prob))
            metadatas.append({
                "title": title,
                "difficulty": prob.get("difficulty", "Unknown"),
                "category": prob.get("category", "Unknown"),
            })
            ids.append(doc_id)

        try:
            self.collection.upsert(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            self._collection_loaded = True
            print(f"[RAG] Upserted {len(documents)} problem(s) into vector DB.")
        except Exception as e:
            print(f"[RAG Error] Failed to upsert documents: {e}")

    def retrieve_context(self, query: str, n_results: int = 2) -> str:
        """
        Retrieves the most relevant problem context(s) for a given query.

        Args:
            query: The user's question or the problem title.
            n_results: How many relevant documents to retrieve.

        Returns:
            A concatenated string of the most relevant knowledge base entries.
        """
        if self.collection is None or not self._collection_loaded:
            return ""

        try:
            count = self.collection.count()
            if count == 0:
                return ""

            # Cap n_results at the number of documents available
            actual_n = min(n_results, count)

            results = self.collection.query(
                query_texts=[query],
                n_results=actual_n,
            )

            docs = results.get("documents", [[]])[0]
            if not docs:
                return ""

            return "\n\n---\n\n".join(docs)

        except Exception as e:
            print(f"[RAG Retrieval Error] {e}")
            return ""


# ── Singleton ─────────────────────────────────────────────────────────────────
rag_service = RAGService()
