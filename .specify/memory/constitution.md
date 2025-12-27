<!--
Sync Impact Report:
- Version change: N/A → 1.0.0 (initial constitution)
- Added sections: Core Principles (6), Technology Stack, Functional Requirements, Constraints, Quality & Validation
- Templates requiring updates: N/A (initial creation)
- Modified principles: N/A
- Removed sections: N/A
- Follow-up TODOs: None
-->

# AI-Native Book Platform Constitution

## Core Principles

### I. Accuracy
All claims must be traceable to reliable sources. No hallucinated APIs or features are allowed. All content must be fact-checked and verified before inclusion.

### II. Clarity
Content must be written for a Computer Science and software engineering audience with a writing level of Flesch-Kincaid Grade 10–12. Technical concepts should be explained clearly and concisely.

### III. AI-Native Design
Content must be structured for retrieval and embeddings. All book content should be optimized for semantic chunking and retrieval by the RAG system.

### IV. Personalization
User background and preferences must influence content delivery and chatbot responses. The system should adapt to user's software and hardware experience levels.

### V. Reproducibility
Architecture and pipelines must be fully explainable and reproducible. All processes should be documented with clear steps for others to follow.

### VI. Source Integration
All content must be properly cited using APA citation style. External sources should be official documentation and trusted technical sources.

## Technology Stack

- Docs: Docusaurus
- Backend: FastAPI
- Auth: Better Auth
- RAG:
  - OpenAI Agents / ChatKit SDKs
  - Qdrant Cloud (Free Tier)
  - Neon Serverless Postgres

## Functional Requirements

### Book
- Modular chapters that can be retrieved independently
- Content optimized for semantic chunking
- Each section retrievable independently for the RAG system

### RAG Chatbot
- Embedded in book UI
- Answers from entire book or from user-selected text only
- No answers outside retrieved context
- Tested against predefined queries

### Authentication & Personalization
- Signup/Signin via Better Auth
- Collect user experience levels at signup (software and hardware)
- Use profile data to personalize chatbot responses
- Secure auth flows required

### Translation (Urdu)
- Translate to Urdu button at start of each chapter
- Available for logged-in users only
- Original English content remains unchanged
- Translation does not alter embeddings

## Constraints
- Use free tiers where specified (Qdrant Cloud, Neon Serverless Postgres)
- Target low-latency retrieval (<2s)
- Avoid vendor lock-in beyond defined stack
- Clearly indicate uncertainty when context is missing
- No hallucinated APIs or features

## Quality & Validation
- All claims must be fact-checked
- RAG system tested against predefined queries
- Secure auth flows implemented
- Clean, accessible UI required
- Architecture and implementation must follow documentation requirements

## Documentation Required
- Architecture diagram
- Folder structure documentation
- RAG pipeline explanation
- Environment variables documentation
- Deployment notes

## Success Criteria
- Fully functional Docusaurus book
- Accurate RAG chatbot responses
- Personalized user experience
- Working Urdu translation per chapter
- No critical security or factual issues

## Governance

This constitution supersedes all other development practices. All amendments must be documented with approval and migration plans. All PRs and reviews must verify compliance with these principles. All development must follow the documented architecture and technology stack.

**Version**: 1.0.0 | **Ratified**: 2025-12-27 | **Last Amended**: 2025-12-27
