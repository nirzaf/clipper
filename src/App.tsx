import React, { useState, useEffect } from 'react';
import { ClipboardItem } from './types/clipboard';
import { clipboardApi } from './services/api';
import { NoteForm } from './components/NoteForm';
import { NotesTable } from './components/NotesTable';

const App: React.FC = () => {
  const [notes, setNotes] = useState<ClipboardItem[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await clipboardApi.getNotes();
      setNotes(results);
    } catch (err) {
      setError('Failed to fetch notes. Please try again.');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!newNote.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await clipboardApi.createNote(newNote);
      setNewNote('');
      await fetchNotes();
    } catch (err) {
      setError('Failed to create note. Please try again.');
      console.error('Error creating note:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await clipboardApi.deleteNote(id);
      await fetchNotes();
    } catch (err) {
      setError('Failed to delete note. Please try again.');
      console.error('Error deleting note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Shared Clipboard
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Share and manage your clipboard content across all your devices seamlessly
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/50 p-4 shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Note form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-900/5">
            <div className="p-6">
              <NoteForm
                value={newNote}
                onChange={setNewNote}
                onSubmit={createNote}
                disabled={loading}
              />
            </div>
          </div>

          {/* Notes list */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
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

export default App;