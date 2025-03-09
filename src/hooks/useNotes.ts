import { useState, useEffect } from 'react';
import { Note } from '../types';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]") as Note[];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id: number, updatedNote: Partial<Note>) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        return {
          ...note,
          ...updatedNote,
          updatedAt: new Date(),
          versions: [...note.versions, note.content],
        };
      }
      return note;
    }));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    notes: filteredNotes,
    addNote,
    updateNote,
    deleteNote,
    searchQuery,
    setSearchQuery,
  };
}; 