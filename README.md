# ThinkVault | Your Knowledge. Unlocked.

ThinkVault is a smart AI study assistant designed for university students. It allows students to upload their course materials (PDF, DOCX, PPTX) and interact with them using a Claude-powered AI interface.

## Features

- **Smart Document Parsing**: Extracts text from PDFs, Word documents, and PowerPoint presentations.
- **AI Chat**: Ask questions, request summaries, or seek explanations based directly on your uploaded notes.
- **Flashcard Generation**: Automatically turns your notes into interactive, flippable flashcards.
- **Study Planning**: Get personalized study schedules based on your course material.
- **Dark Mode**: Beautiful, easy-on-the-eyes interface for late-night study sessions.
- **Interactive UI**: Modern, responsive design built with React, Tailwind CSS, and Framer Motion.

## Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework.
- **Anthropic SDK**: Integration with Claude 3.5 Sonnet.
- **PyMuPDF / python-docx / python-pptx**: Document text extraction.
- **Uvicorn**: ASGI server for running the backend.

### Frontend
- **React**: Modern UI library.
- **Vite**: Ultra-fast build tool.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Smooth animations and transitions.
- **Lucide React**: Beautiful icon set.
- **Axios**: API communication.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- Anthropic API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file and add your Anthropic API Key:
   ```env
   ANTHROPIC_API_KEY=your_key_here
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (optional, defaults to http://localhost:8000):
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Upload**: Drag and drop your course materials into the sidebar.
2. **Chat**: Ask ThinkVault to summarize, explain, or quiz you.
3. **Study**: Use the "Make Flashcards" button to enter study mode.
4. **Master**: Conquer your exams with deep understanding!

---
*Built with ❤️ for students everywhere.*
