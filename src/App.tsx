import React, { useEffect, useState } from "react";
import { NoteForm } from "./components/NoteForm";
import { clipboardApi } from "./services/api";
import { ClipboardItem } from "./types/clipboard";
import {
  FiRefreshCw,
  FiCopy,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";

export const App: React.FC = () => {
  const [notes, setNotes] = useState<ClipboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await clipboardApi.getNotes();
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
      await clipboardApi.createNote(newNote);
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
      await clipboardApi.deleteNote(id);
      await fetchNotes();
    } catch (err) {
      setError("Failed to delete note. Please try again.");
      console.error("Error deleting note:", err);
    }
  };

  const copyToClipboard = async (content: string, id: number) => {
    try {
      // Create a temporary element to handle HTML content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || tempDiv.innerText || "";

      await navigator.clipboard.writeText(textContent);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="clipboard-container">
        {/* Header */}
        <header className="header flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
              Shared Clipboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchNotes}
              disabled={loading}
              className="button button-primary"
              aria-label="Refresh notes"
            >
              <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="fade-in bg-red-50 dark:bg-red-900/30 px-4 py-3 rounded-md mb-6">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* New Note Form */}
        <div className="note-form">
          <NoteForm
            value={newNote}
            onChange={setNewNote}
            onSubmit={createNote}
            disabled={isSubmitting}
          />
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner" />
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="note-card fade-in">
                <div
                  className="mb-4 rich-text-content"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(note.content, note.id)}
                      className="button button-secondary p-2"
                      aria-label="Copy note"
                    >
                      {copiedId === note.id ? (
                        <FiCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <FiCopy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="button button-danger p-2"
                      aria-label="Delete note"
                    >
                      <FiTrash2 />
                      <span className="sr-only"></span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
