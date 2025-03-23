import { createClient } from '@/lib/supabase-server';
import { Note } from '@/types/database';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { SimpleChat } from '@/components/SimpleChat';

interface NotePageProps {
  params: {
    id: string;
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/auth/login');
  }
  
  const { data: note, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', params.id)
    .single();
  
  if (error || !note) {
    notFound();
  }
  
  const subjectColors = {
    math: 'bg-blue-100 text-blue-800',
    science: 'bg-green-100 text-green-800',
    history: 'bg-yellow-100 text-yellow-800',
    english: 'bg-purple-100 text-purple-800',
  };
  
  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-primary-700">{note.title}</h1>
            <span className={`px-3 py-1 rounded text-sm ${subjectColors[note.subject as keyof typeof subjectColors]}`}>
              {note.subject}
            </span>
          </div>
          
          <p className="text-gray-500 text-sm mb-6">
            Created on {formattedDate}
          </p>
          
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{note.content}</p>
          </div>
        </div>
      </div>
      
      {/* Remove or comment out this placeholder */}
      {/* <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-primary-700 mb-4">Discussion (Coming Soon)</h2>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            A live chat feature will be available here in a future update.
            You'll be able to discuss this note with classmates and tutors.
          </p>
        </div>
      </div> */}
      
      <div className="mt-8">
        <SimpleChat 
          noteContent={note.content} 
          noteTitle={note.title}
          noteSubject={note.subject}
        />
      </div>
    </div>
  );
} 