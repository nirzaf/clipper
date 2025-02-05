import React, { useState, useEffect } from 'react';
import { ClipboardItem } from './types/clipboard';
import { clipboardApi } from './services/api';
import { NoteForm } from './components/NoteForm';
import { NotesTable } from './components/NotesTable';
import './App.css';

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Title */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              📋 Shared Clipboard
            </h1>
            <p className="mt-2 text-sm text-indigo-100 sm:text-base">
              Share and manage your clipboard content across devices
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Input Form */}
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <NoteForm
            value={newNote}
            onChange={setNewNote}
            onSubmit={createNote}
            loading={loading}
          />
        </div>

        {error && (
          <div className="rounded bg-red-50 p-3 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
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