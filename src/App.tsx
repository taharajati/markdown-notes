import React, { useState } from 'react';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import { useDarkMode } from './hooks/useDarkMode';
import { useNotes } from './hooks/useNotes';
import { ViewMode } from './types';

interface Note {
  id: number;
  content: string;
  tags: string[];
  attachment?: string;
  reminder?: string;
  versions: string[];
}

export default function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    searchQuery,
    setSearchQuery,
  } = useNotes();

  const [currentNote, setCurrentNote] = useState<string>("");
  const [currentTags, setCurrentTags] = useState<string>("");
  const [attachment, setAttachment] = useState<string>("");
  const [reminder, setReminder] = useState<string>("");
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setAttachment("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setAttachment(reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setCurrentNote("");
    setCurrentTags("");
    setAttachment("");
    setReminder("");
    setIsPreview(false);
    setEditingNoteId(null);
  };

  const handleSave = () => {
    if (!currentNote.trim()) return;
    
    const tagsArray = currentTags.split(",").map(tag => tag.trim()).filter(tag => tag);
    const noteData = {
      content: currentNote,
      tags: tagsArray,
      attachment,
      reminder,
      versions: [],
    };

    if (editingNoteId !== null) {
      updateNote(editingNoteId, noteData);
    } else {
      addNote(noteData);
    }
    
    resetForm();
  };

  const handleEdit = (id: number) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setCurrentNote(noteToEdit.content);
      setCurrentTags(noteToEdit.tags.join(", "));
      setAttachment(noteToEdit.attachment || "");
      setReminder(noteToEdit.reminder || "");
      setEditingNoteId(id);
      setIsPreview(false);
    }
  };

  const handleShare = (id: number) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      navigator.clipboard.writeText(note.content).then(() => {
        alert("متن یادداشت کپی شد!");
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex items-center gap-3">
              <span className="animate-bounce">📝</span>
              یادداشت‌های من
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="btn-secondary"
                title={viewMode === "list" ? "نمایش شبکه‌ای" : "نمایش لیستی"}
              >
                {viewMode === "list" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                onClick={toggleDarkMode}
                className="btn-secondary"
                title={isDarkMode ? "حالت روشن" : "حالت تاریک"}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-6 relative animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <input
              type="text"
              placeholder="جستجو در یادداشت‌ها و برچسب‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          <NoteForm
            currentNote={currentNote}
            currentTags={currentTags}
            attachment={attachment}
            reminder={reminder}
            isPreview={isPreview}
            editingNoteId={editingNoteId}
            onNoteChange={setCurrentNote}
            onTagsChange={setCurrentTags}
            onReminderChange={setReminder}
            onFileChange={handleFileChange}
            onPreviewToggle={() => setIsPreview(!isPreview)}
            onSave={handleSave}
          />

          <NotesList
            notes={notes}
            onDelete={deleteNote}
            onEdit={handleEdit}
            onShare={handleShare}
            viewMode={viewMode}
          />
        </main>
      </div>
    </div>
  );
} 