'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { createClient } from '@/lib/supabase';
import { Subject } from '@/types/database';

interface UploadFormData {
  title: string;
  subject: Subject;
}

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  
  const { register, handleSubmit, formState: { errors } } = useForm<UploadFormData>();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_FLASK_API_URL}/extract_text`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setTranscribedText(response.data.extracted_text);
      setStep('review');
    } catch (err) {
      console.error('Error transcribing image:', err);
      setError('Failed to transcribe the image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSaveNote = async (formData: UploadFormData) => {
    if (!transcribedText) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        title: formData.title,
        content: transcribedText,
        subject: formData.subject,
      });
      
      if (error) throw error;
      
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save the note. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Handwritten Note</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {step === 'upload' ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block font-medium mb-2">Upload Image</label>
            <p className="text-sm text-gray-500 mb-4">
              Upload an image of your handwritten notes (PNG, JPEG)
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="image"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {filePreview ? (
                <div className="mb-4">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview(null);
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="cursor-pointer block py-4"
                >
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-gray-700">
                    Click to select an image
                  </span>
                </label>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {isUploading ? 'Transcribing...' : 'Transcribe Image'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(handleSaveNote)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block font-medium mb-1">
                Note Title
              </label>
              <input
                id="title"
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="subject" className="block font-medium mb-1">
                Subject
              </label>
              <select
                id="subject"
                {...register('subject', { required: 'Subject is required' })}
                className="w-full"
              >
                <option value="">Select a subject</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="english">English</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>
            
            <div>
              <label className="block font-medium mb-1">
                Transcribed Text
              </label>
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap">
                {transcribedText}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isUploading ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 