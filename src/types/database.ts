export type Subject = 'math' | 'science' | 'history' | 'english';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  subject: Subject;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: Note;
        Insert: Omit<Note, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Note, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
} 