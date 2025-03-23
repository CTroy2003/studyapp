import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json();
    
    // Create query with context from the note
    const queryWithContext = `Note Title: ${context.title}
Subject: ${context.subject}
Note Content: ${context.content}

Question: ${question}`;
    
    // Call your custom model API on render
    const response = await axios.post(
      'https://ezstudy-kunk.onrender.com/chat',
      {
        query: queryWithContext
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the response from your API
    const responseText = response.data.response || "Sorry, I couldn't generate a response.";
    
    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error calling custom chatbot API:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 