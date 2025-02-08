import React, { useEffect, useState } from "react";
import { NoteForm } from "./components/NoteForm";
import { clipboardService } from "./services/clipboardService";
import { ClipboardItem as ClipboardItemType } from "./types/clipboard";
import { ClipboardItem } from "./components/ClipboardItem";
import { ThemeToggle } from "./components/ThemeToggle";
import { FiRefreshCw } from "react-icons/fi";
import "./styles/richText.css";
import "./App.css";

export const App: React.FC = () => {
  const [notes, setNotes] = useState<ClipboardItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    // Update the document class when theme changes
    document.documentElement.classList.toggle('dark', isDark);
    // Save theme preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

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

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              <button
                onClick={fetchNotes}
                disabled={loading}
                className="p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                aria-label="Refresh notes"
              >
                <FiRefreshCw className={`w-8 h-8 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-48 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
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
                <div className="col-span-full p-8 text-center bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No clipboard items yet. Create one above!</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
