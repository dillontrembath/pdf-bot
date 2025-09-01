export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ pageNumber: number; text: string }>;
}