import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json();
    
    // Add subject-specific guidance
    let subjectGuidance = '';
    switch (context.subject?.toLowerCase()) {
      case 'math':
        subjectGuidance = 'Include step-by-step explanations for any mathematical concepts.';
        break;
      case 'science':
        subjectGuidance = 'Explain scientific concepts clearly and provide real-world examples when possible.';
        break;
      case 'history':
        subjectGuidance = 'Provide historical context and connections between events mentioned in the notes.';
        break;
      case 'english':
        subjectGuidance = 'Offer literary analysis and explain any literary devices or themes mentioned.';
        break;
      default:
        subjectGuidance = 'Be thorough and educational in your response.';
    }
    
    // Truncate content if too long (Gemini has token limits)
    const maxContentLength = 4000; // Adjust based on model limits
    const truncatedContent = context.content.length > maxContentLength 
      ? context.content.substring(0, maxContentLength) + "... (content truncated due to length)"
      : context.content;
    
    // Construct enhanced prompt with context
    const prompt = `
You are a knowledgeable assistant helping a student understand their notes.

CONTEXT:
Title: "${context.title}"
Subject: "${context.subject}"
Content:
"""
${truncatedContent}
"""

${subjectGuidance}

Based on the notes above, please answer the following question:
Question: ${question}

Be specific, clear, and reference relevant parts of the notes when answering.
`;
    
    // Call Gemini API with the enhanced prompt
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