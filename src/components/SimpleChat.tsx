'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface SimpleChatProps {
  noteContent: string;
  noteTitle: string;
  noteSubject: string;
}

export function SimpleChat({ noteContent, noteTitle, noteSubject }: SimpleChatProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askedQuestion, setAskedQuestion] = useState<string | null>(null);

  const sendQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError(null);
    const currentQuestion = question;
    
    try {
      const res = await axios.post('/api/chat', {
        question,
        context: {
          content: noteContent,
          title: noteTitle,
          subject: noteSubject
        }
      });
      
      setResponse(res.data.response);
      setAskedQuestion(currentQuestion);
      setQuestion('');
    } catch (err) {
      console.error('Error communicating with Gemini API:', err);
      setError('Failed to get a response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-primary-700 mb-4">Ask about this note</h2>
      
      <div className="mb-4 text-sm text-gray-600">
        <p>Ask questions about your "{noteTitle}" note on {noteSubject}.</p>
        <p className="text-xs text-gray-500 mt-1">The AI has full context of your note content.</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {askedQuestion && response && (
        <div className="mb-6">
          <div className="p-3 bg-gray-100 rounded-t-md">
            <p className="text-sm font-medium text-gray-700">Your question:</p>
            <p>{askedQuestion}</p>
          </div>
          <div className="p-4 bg-primary-50 border-l-4 border-primary-500 rounded-b-md">
            <p className="text-sm font-medium text-primary-700">Answer:</p>
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this note..."
          className="flex-grow p-2 border border-gray-300 rounded-md"
          onKeyPress={(e) => e.key === 'Enter' && sendQuestion()}
        />
        <button
          onClick={sendQuestion}
          disabled={loading || !question.trim()}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
    </div>
  );
} 