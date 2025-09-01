# PDFBot

A React Native mobile app that transforms PDF documents into interactive AI-powered conversations. Upload any PDF and chat with PDFBot - your AI companion that provides real-time streaming responses with clickable page citations.

## Features

- **PDF Upload & Processing** - Upload and parse any PDF document
- **AI Chat with Streaming** - Real-time conversation with OpenAI GPT-4
- **Smart Citations** - Click [Page X] citations to navigate to specific PDF pages
- **Persistent Storage** - Chat history and documents saved locally
- **Mobile-First** - Optimized React Native UI with smooth interactions

## Tech Stack

- **Frontend**: React Native, Expo Router, TypeScript
- **Backend**: Express.js with Server-Sent Events
- **AI**: OpenAI GPT-4 with streaming responses
- **Storage**: AsyncStorage, Expo FileSystem
- **PDF**: pdf-parse for server-side text extraction

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure OpenAI API**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your OpenAI API key:
   # OPENAI_API_KEY=sk-your-actual-api-key-here
   # API_URL is already set to http://localhost:3000 for local development
   ```

3. **Start the backend server** (Terminal 1)
   ```bash
   npm run server
   # Or directly: node server.js
   # Server will run on http://localhost:3000
   ```

4. **Start the mobile app** (Terminal 2 - new window)
   
   **For full functionality (includes PDF viewer):**
   ```bash
   npx expo run:ios    # For iOS Simulator
   # or
   npx expo run:android  # For Android Emulator
   ```
   
   **For quick testing (no PDF viewer):**
   ```bash
   npm start
   # Then scan QR code with Expo Go app
   ```

**Important**: 
- You need TWO terminal windows - one for the server, one for Expo
- PDF viewer requires development build (`expo run:ios`), not Expo Go

## Usage

1. **Upload PDF** - Tap "Upload PDF Document" and select a file
2. **Chat** - Ask questions about your PDF content
3. **Navigate** - Click citation links like [Page 5] to view specific pages
4. **Library** - Access previously uploaded documents from the home screen

## Architecture

- **Client**: React Native app handles UI, file storage, and chat interface
- **Server**: Express.js processes PDFs and streams AI responses
- **Storage**: PDFs stored locally, chat history in AsyncStorage
- **Streaming**: EventSource for real-time AI response delivery

PDFBot: Your intelligent PDF companion powered by modern React Native, TypeScript, and production-ready optimizations.