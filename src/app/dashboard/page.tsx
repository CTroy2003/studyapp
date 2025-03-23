'use client';

import { useState, useEffect } from 'react';
import { Note, Subject } from '@/types/database';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { SubjectFilter } from '@/components/SubjectFilter';

export default function DashboardPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjectColors = {
    math: 'bg-blue-100 text-blue-800',
    science: 'bg-green-100 text-green-800',
    history: 'bg-yellow-100 text-yellow-800',
    english: 'bg-purple-100 text-purple-800',
  };

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      try {
        const supabase = createClient();
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }
        
        // Fetch notes
        let query = supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });
          
        // Apply filter if a subject is selected
        if (selectedSubject) {
          query = query.eq('subject', selectedSubject);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setNotes(data || []);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchNotes();
  }, [selectedSubject, router]);

  const handleSubjectChange = (subject: string | null) => {
    setSelectedSubject(subject);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Notes</h1>
        <Link 
          href="/dashboard/upload" 
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Upload New Note
        </Link>
      </div>
      
      <SubjectFilter 
        activeSubject={selectedSubject} 
        onSubjectChange={handleSubjectChange} 
      />
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading notes...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note: Note) => (
            <Link href={`/dashboard/notes/${note.id}`} key={note.id}>
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-primary-700">{note.title}</h2>
                    <span className={`text-xs px-2 py-1 rounded ${subjectColors[note.subject as keyof typeof subjectColors]}`}>
                      {note.subject}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-3">{note.content}</p>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {selectedSubject 
              ? `You don't have any ${selectedSubject} notes yet.` 
              : "You don't have any notes yet."}
          </p>
          <Link 
            href="/dashboard/upload" 
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Upload Your First Note
          </Link>
        </div>
      )}
    </div>
  );
} 