import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface ClipboardItem {
  id: number;
  field_3420227: number; // Id field
  field_3420228: string; // Notes field
}

const baserowApi = axios.create({
  baseURL: 'https://api.baserow.io/api/database/rows/table/',
  headers: {
    'Authorization': `Token ${import.meta.env.VITE_BASEROW_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_ID;

const App: React.FC = () => {
  const [notes, setNotes] = useState<ClipboardItem[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await baserowApi.get(`${TABLE_ID}/`);
      setNotes(response.data.results);
    } catch (err) {
      setError('Failed to fetch notes. Please try again.');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await baserowApi.post(`${TABLE_ID}/`, {
        field_3420228: newNote.trim() // Notes field
      });
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
      await baserowApi.delete(`${TABLE_ID}/${id}/`);
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
    <div className="container">
      <header className="header">
        <h1>📋 Shared Clipboard</h1>
        <p>Share your notes across devices</p>
      </header>

      <form onSubmit={createNote} className="input-form">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type your note here..."
          rows={3}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newNote.trim()}>
          {loading ? 'Adding...' : 'Add Note'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="notes-container">
        {loading && notes.length === 0 ? (
          <div className="loading">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">No notes yet. Add your first note!</div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.field_3420227} className="note-card">
                <p>{note.field_3420228}</p>
                <div className="note-actions">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(note.field_3420228);
                    }}
                    className="copy-button"
                    title="Copy to clipboard"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => deleteNote(note.field_3420227)}
                    className="delete-button"
                    disabled={loading}
                    title="Delete note"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;