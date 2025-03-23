import { createClient } from '@/lib/supabase-server';
import { Note } from '@/types/database';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/auth/login');
  }
  
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notes:', error);
  }
  
  const subjectColors = {
    math: 'bg-blue-100 text-blue-800',
    science: 'bg-green-100 text-green-800',
    history: 'bg-yellow-100 text-yellow-800',
    english: 'bg-purple-100 text-purple-800',
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
      
      {notes && notes.length > 0 ? (
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
          <p className="text-gray-500 mb-4">You don't have any notes yet.</p>
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