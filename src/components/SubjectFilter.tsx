'use client';

import { useState } from 'react';
import { Subject } from '@/types/database';

interface SubjectFilterProps {
  activeSubject: string | null;
  onSubjectChange: (subject: string | null) => void;
}

export function SubjectFilter({ activeSubject, onSubjectChange }: SubjectFilterProps) {
  const subjects: { value: string | null; label: string; }[] = [
    { value: null, label: 'All' },
    { value: 'math', label: 'Math' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'english', label: 'English' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <button
            key={subject.label}
            onClick={() => onSubjectChange(subject.value)}
            className={`
              px-4 py-2 rounded-md 
              ${
                activeSubject === subject.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }
            `}
          >
            {subject.label}
          </button>
        ))}
      </div>
    </div>
  );
} 