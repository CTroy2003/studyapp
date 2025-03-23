# EZStudy - Transcribe and Organize Handwritten Notes

EZStudy is a Next.js application that allows users to upload images of their handwritten notes, have them transcribed into text, and organize them by subject. The application uses Supabase for authentication and data storage, and integrates with a Flask API for OCR text extraction.

## Features

- **User Authentication**: Sign up, login, and account management using Supabase Auth
- **Note Upload & Transcription**: Upload images of handwritten notes and convert them to text
- **Note Organization**: Categorize notes by subject (math, science, history, or english)
- **Note Management**: View, organize, and access your notes from any device
- **Responsive Design**: Fully responsive UI using TailwindCSS with a green and white theme

## Tech Stack

- **Frontend/Backend**: Next.js with App Router
- **Styling**: TailwindCSS
- **Authentication & Database**: Supabase
- **Image Processing**: Flask API for OCR (Optical Character Recognition)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Flask API for text extraction

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   FLASK_API_URL=http://your_flask_api_url:5000
   ```

### Supabase Setup

1. Create a new Supabase project
2. Create a `notes` table with the following schema:
   ```sql
   CREATE TABLE notes (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users NOT NULL,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     subject TEXT NOT NULL CHECK (subject IN ('math', 'science', 'history', 'english')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Add RLS policies
   ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can view their own notes" 
     ON notes FOR SELECT 
     USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert their own notes" 
     ON notes FOR INSERT 
     WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can update their own notes" 
     ON notes FOR UPDATE 
     USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can delete their own notes" 
     ON notes FOR DELETE 
     USING (auth.uid() = user_id);
   ```

3. Get your Supabase URL and anon key from your project settings

### Flask API Setup

The Flask API should expose an endpoint that accepts image uploads and returns extracted text:

- **Endpoint**: `/extract_text`
- **Method**: POST
- **Request format**: `multipart/form-data` with an image file
- **Response format**: JSON with an `extracted_text` field

Example response:
```json
{
  "extracted_text": "This is the transcribed text from the uploaded image."
}
```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application can be deployed to Vercel or any other platform that supports Next.js applications. Make sure to set the environment variables in your deployment platform.

## License

This project is licensed under the MIT License.
