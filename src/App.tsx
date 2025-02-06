import React, { useEffect, useState } from "react";
import { NoteForm } from "./components/NoteForm";
import { clipboardService } from "./services/clipboardService";
import { ClipboardItem as ClipboardItemType } from "./types/clipboard";
import { ClipboardItem } from "./components/ClipboardItem";
import { FiRefreshCw } from "react-icons/fi";
import "./styles/richText.css";
import "./App.css";

export const App: React.FC = () => {
  const [notes, setNotes] = useState<ClipboardItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await clipboardService.getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError("Failed to load notes. Please try again later.");
      console.error("Error fetching notes:", err);
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
      await clipboardService.createNote(newNote);
      setNewNote("");
      await fetchNotes();
    } catch (err) {
      setError("Failed to create note. Please try again.");
      console.error("Error creating note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      setError(null);
      await clipboardService.deleteNote(id);
      await fetchNotes();
    } catch (err) {
      setError("Failed to delete note. Please try again.");
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Shared Clipboard
            </h1>
            <button
              onClick={fetchNotes}
              disabled={loading}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              aria-label="Refresh notes"
            >
              <FiRefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        <main>
          {/* Error Message */}
          {error && (
            <div className="error-message fade-in" role="alert">
              <p>{error}</p>
            </div>
          )}

          {/* New Note Form */}
          <div className="form-container fade-in">
            <NoteForm
              value={newNote}
              onChange={setNewNote}
              onSubmit={createNote}
              disabled={isSubmitting}
            />
          </div>

          {/* Notes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {notes.map((note) => (
                <div key={note.id}>
                  <ClipboardItem
                    item={note}
                    onDelete={deleteNote}
                    loading={loading}
                  />
                </div>
              ))}
              {notes.length === 0 && !loading && (
                <div className="col-span-full p-8 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">No clipboard items yet. Create one above!</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
