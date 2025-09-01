import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventSource from 'react-native-event-source';
import { extractCitationsFromText } from '../lib/client-pdf-utils';
import { Message } from '../types/message';

const generateMessageId = (role: 'user' | 'assistant' | 'error') => 
  `${role}_${Date.now()}_${Math.random().toString(36).substring(2)}`;

interface UsePDFChatProps {
  pdfId?: string;
}

export function usePDFChat({ pdfId }: UsePDFChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!pdfId) return;
      
      try {
        const historyKey = `chat_history_${pdfId}`;
        const stored = await AsyncStorage.getItem(historyKey);
        setMessages(stored ? JSON.parse(stored) : []);
      } catch (error) {
        setMessages([]);
      }
    };

    loadChatHistory();
  }, [pdfId]);

  const saveChatHistory = async (newMessages: Message[]) => {
    if (!pdfId) return;
    
    try {
      const historyKey = `chat_history_${pdfId}`;
      await AsyncStorage.setItem(historyKey, JSON.stringify(newMessages));
    } catch (error) {
      // Silently fail
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || !pdfId) return;

    const userMessage: Message = {
      id: generateMessageId('user'),
      role: 'user',
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveChatHistory(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const textContentKey = `pdf_text_${pdfId}`;
      const textContent = await AsyncStorage.getItem(textContentKey);
      
      if (!textContent) {
        throw new Error('PDF text content not found in storage');
      }

      const API_URL = process.env.API_URL || 'http://localhost:3000';
      const eventSource = new EventSource(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage], 
          pdfId,
          textContent
        }),
      });

      let fullText = '';
      let tokenCount = 0;
      let assistantMessageId: string | null = null;

      eventSource.addEventListener('message', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'token') {
            tokenCount++;
            fullText += data.value;
            
            if (tokenCount === 1) {
              setIsLoading(false);
              assistantMessageId = generateMessageId('assistant');
              
              const assistantMessage: Message = {
                id: assistantMessageId,
                role: 'assistant',
                content: fullText,
              };
              
              const updatedMessages = [...newMessages, assistantMessage];
              setMessages(updatedMessages);
            } else {
              setMessages(prev => {
                const updated = prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: fullText }
                    : msg
                );
                saveChatHistory(updated);
                return updated;
              });
            }
          // Citations handled in message parsing
          } else if (data.type === 'done') {
            eventSource.close();
            
            // Parse citations and store with the message
            const finalCitations = extractCitationsFromText(fullText);
            
            setMessages(prev => {
              const updated = prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { ...msg, citations: finalCitations }
                  : msg
              );
              saveChatHistory(updated);
              return updated;
            });
          }
        } catch (parseError) {
          // Silently fail
        }
      });

      eventSource.addEventListener('error', (error: Event) => {
        eventSource.close();
        setIsLoading(false);
        
        const errorMessage: Message = {
          id: generateMessageId('error'),
          role: 'assistant',
          content: 'Stream connection failed',
        };
        setMessages(prev => [...prev, errorMessage]);
      });

    } catch (error) {
      setIsLoading(false);
      const errorMessage: Message = {
        id: generateMessageId('error'),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [input, messages, pdfId]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
}