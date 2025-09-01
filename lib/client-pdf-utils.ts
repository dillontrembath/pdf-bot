// Client-safe PDF utilities (no Node.js dependencies)

export function extractCitationsFromText(text: string): Array<{ pageNumber: number; text: string }> {
  const citationRegex = /\[Page (\d+)\]/g;
  const citations: Array<{ pageNumber: number; text: string }> = [];
  let match;
  
  while ((match = citationRegex.exec(text)) !== null) {
    citations.push({
      pageNumber: parseInt(match[1]),
      text: match[0],
    });
  }
  
  return citations;
}