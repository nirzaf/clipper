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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            📋 Shared Clipboard
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
            Share and manage your clipboard content across devices
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <NoteForm
              value={newNote}
              onChange={setNewNote}
              onSubmit={createNote}
              disabled={loading}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700">
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