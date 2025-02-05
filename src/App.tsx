import React, { useEffect, useState } from 'react';
import { NoteForm } from './components/NoteForm';
import { NotesTable } from './components/NotesTable';
import { clipboardApi } from './services/api';
import { ClipboardItem } from './types/clipboard';

export const App: React.FC = () => {
  const [notes, setNotes] = useState<ClipboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await clipboardApi.getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError('Failed to load notes. Please try again later.');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
    if (!newNote.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await clipboardApi.createNote(newNote);
      setNewNote('');
      await fetchNotes();
    } catch (err) {
      setError('Failed to create note. Please try again.');
      console.error('Error creating note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      setError(null);
      await clipboardApi.deleteNote(id);
      await fetchNotes();
    } catch (err) {
      setError('Failed to delete note. Please try again.');
      console.error('Error deleting note:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Shared Clipboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Share and manage your notes seamlessly across devices
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/30">
              <p className="text-sm text-red-800 dark:text-red-200">
                {error}
              </p>
            </div>
          )}

          {/* New Note Form */}
          <div className="space-y-4">
            <NoteForm
              value={newNote}
              onChange={setNewNote}
              onSubmit={createNote}
              disabled={isSubmitting}
            />
          </div>

          {/* Notes List */}
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              All notes
            </h2>
            <NotesTable
              notes={notes}
              onDelete={deleteNote}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};