import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json();
    
    // Construct prompt with context
    const prompt = `
      Note Title: ${context.title}
      Subject: ${context.subject}
      Note Content: 
      ${context.content}
      
      Question: ${question}
    `;
    
    // Call Gemini API with the gemini-2.0-flash model
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );
    
    // Extract the response text
    const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
                        "Sorry, I couldn't generate a response.";
    
    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    // Enhanced error logging
    console.error('Error calling Gemini API:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    return NextResponse.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
} 