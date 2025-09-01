require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { openai } = require('@ai-sdk/openai');
const { streamText } = require('ai');
const pdfParse = require('pdf-parse');

const app = express();
const PORT = 3000;

// Configure multer for file uploads (in-memory)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Simple in-memory document storage
const documents = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// PDF Upload endpoint
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file' });
    }

    // Parse PDF from memory buffer
    const pdfData = await pdfParse(req.file.buffer);
    
    // Split text into pages (rough estimation)
    const fullText = pdfData.text;
    const totalPages = pdfData.numpages;
    const charsPerPage = Math.ceil(fullText.length / totalPages);
    
    // Create page-wise content
    let pageContent = '';
    for (let i = 1; i <= totalPages; i++) {
      const startPos = (i - 1) * charsPerPage;
      const endPos = Math.min(i * charsPerPage, fullText.length);
      const pageText = fullText.substring(startPos, endPos);
      pageContent += `\n--- PAGE ${i} ---\n${pageText}\n`;
    }
    
    // Create document (no file storage)
    const doc = {
      id: generateId(),
      name: req.file.originalname,
      totalPages: pdfData.numpages,
      textContent: pageContent,
      uploadedAt: new Date(),
    };

    documents.set(doc.id, doc);

    res.json({
      success: true,
      pdfId: doc.id,
      name: doc.name,
      totalPages: doc.totalPages,
      textContent: doc.textContent,
    });

  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ error: 'Failed to process PDF file' });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, pdfId, textContent } = req.body; // Accept textContent from client

    // System prompt
    let systemPrompt = 'You are an AI tutor. Ask the user to upload a PDF first.';
    
    if (pdfId && textContent) {
      
      systemPrompt = `You are an AI tutor for the uploaded PDF document.

🚨 MANDATORY CITATION REQUIREMENT 🚨
EVERY SINGLE RESPONSE MUST include [Page X] citations when referencing PDF content.
NO EXCEPTIONS. NO RESPONSES WITHOUT CITATIONS.

PDF Content:
${textContent}

CITATION RULES:
1. ALWAYS use [Page X] format when referencing any information from the PDF
2. Look for "--- PAGE X ---" markers to determine page numbers
3. Every fact, quote, or reference MUST have a citation
4. Examples:
   - "According to [Page 1], Newton's first law states..."
   - "The definition of force [Page 3] explains..."
   - "As mentioned on [Page 5], acceleration is..."

REMEMBER: If you don't include citations, the user cannot navigate to the referenced content. This is a CRITICAL feature.

Help the student understand this content and ALWAYS cite your sources using [Page X] format.`;
      
    }

    // Messages with system prompt
    const finalMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    // Stream AI response
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: finalMessages,
      temperature: 0.7,
    });

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders?.();

    let totalText = '';
    let chunkCount = 0;

    try {
      // Stream text chunks using SSE format
      for await (const textPart of result.textStream) {
        chunkCount++;
        totalText += textPart;
        
        // Write SSE formatted data
        res.write(`data: ${JSON.stringify({ type: 'token', value: textPart })}\n\n`);
        res.flush?.();
      }
      
      // Send completion event
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
      
    } catch (streamError) {
      res.write(`data: ${JSON.stringify({ type: 'error', value: streamError.message })}\n\n`);
      res.end();
    }

  } catch (error) {
    console.error('Chat endpoint error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI chat service unavailable' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🤖 PDFBot server running on http://localhost:${PORT}`);
});