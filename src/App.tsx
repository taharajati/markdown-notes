import { useState, useEffect } from "react";
import Preview from "./components/Preview";
import NotesList from "./components/NotesList";

interface Note {
  id: number;
  content: string;
  tags: string[];
  attachment?: string; // ذخیره به صورت base64 یا URL
  reminder?: string;   // به صورت رشته ISO
  versions: string[];  // تاریخچه تغییرات
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [currentTags, setCurrentTags] = useState<string>("");
  const [attachment, setAttachment] = useState<string>("");
  const [reminder, setReminder] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem("darkMode") === "true");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // بارگذاری یادداشت‌ها از localStorage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]") as Note[];
    setNotes(savedNotes);
  }, []);

  // ذخیره یادداشت‌ها در localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // تغییر تم و ذخیره وضعیت در localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  // پردازش فایل ضمیمه به base64
  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setAttachment(reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  // ذخیره یا بروزرسانی یادداشت
  const saveNote = () => {
    if (!currentNote.trim()) return;
    const tagsArray = currentTags.split(",").map(tag => tag.trim()).filter(tag => tag);
    if (editingNoteId !== null) {
      setNotes(notes.map(note => {
        if (note.id === editingNoteId) {
          const updatedVersions = [...note.versions, note.content];
          return {
            ...note,
            content: currentNote,
            tags: tagsArray,
            attachment: attachment,
            reminder: reminder,
            versions: updatedVersions,
          };
        }
        return note;
      }));
      setEditingNoteId(null);
    } else {
      const newNote: Note = {
        id: Date.now(),
        content: currentNote,
        tags: tagsArray,
        attachment: attachment,
        reminder: reminder,
        versions: [],
      };
      setNotes([newNote, ...notes]);
    }
    // ریست کردن فیلدها
    setCurrentNote("");
    setCurrentTags("");
    setAttachment("");
    setReminder("");
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (editingNoteId === id) {
      setEditingNoteId(null);
      setCurrentNote("");
      setCurrentTags("");
      setAttachment("");
      setReminder("");
    }
  };

  const editNote = (id: number) => {
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

  const shareNote = (id: number) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      navigator.clipboard.writeText(note.content).then(() => {
        alert("متن یادداشت کپی شد!");
      });
    }
  };

  // فیلتر کردن یادداشت‌ها براساس جستجو (متن یا برچسب‌ها)
  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-gray-50 dark:bg-gray-900 transition-all" dir="rtl">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center transition-all">
        {/* هدر */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📝</span> یادداشت‌های من
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg transition hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {viewMode === "list" ? "نمای شبکه‌ای" : "نمای لیست"}
            </button>
          </div>
        </div>

        {/* جستجو */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="جستجو در یادداشت‌ها یا برچسب‌ها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* سوییچ بین حالت ویرایش و پیش‌نمایش */}
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-4 py-2 rounded-lg ${!isPreview ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"}`}
          >
            ویرایش
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-4 py-2 rounded-lg ${isPreview ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"}`}
          >
            پیش نمایش
          </button>
        </div>

        {/* نمایش ویرایشگر یا پیش‌نمایش */}
        {isPreview ? (
          <Preview markdown={currentNote} />
        ) : (
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="متن یادداشت..."
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-white"
          />
        )}

        {/* فیلدهای اضافی: برچسب‌ها، یادآوری و ضمیمه */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="برچسب‌ها (با کاما جدا کنید)"
            value={currentTags}
            onChange={(e) => setCurrentTags(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="datetime-local"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mt-4">
          <button
            onClick={saveNote}
            className="px-5 py-2 bg-green-500 text-white rounded-lg shadow-md transition hover:bg-green-600"
          >
            {editingNoteId ? "بروزرسانی" : "ذخیره"}
          </button>
        </div>

        <div className="mt-6">
          <NotesList
            notes={filteredNotes}
            onDelete={deleteNote}
            onEdit={editNote}
            onShare={shareNote}
            viewMode={viewMode}
          />
        </div>
      </div>
    </div>
  );
}
