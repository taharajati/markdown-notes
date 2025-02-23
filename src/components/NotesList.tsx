import React from "react";

interface Note {
  id: number;
  content: string;
  tags: string[];
  attachment?: string;
  reminder?: string;
  versions: string[];
}

interface NotesListProps {
  notes: Note[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onShare: (id: number) => void;
  viewMode: "list" | "grid";
}

const NotesList: React.FC<NotesListProps> = ({ notes, onDelete, onEdit, onShare, viewMode }) => {
  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"} dir="rtl">
      {notes.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">هیچ یادداشتی موجود نیست</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 hover:shadow-xl transition">
            <div className="flex justify-between items-center">
              <p className="text-gray-900 dark:text-white line-clamp-3">{note.content}</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onEdit(note.id)}
                  className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  حذف
                </button>
                <button
                  onClick={() => onShare(note.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  اشتراک
                </button>
              </div>
            </div>
            {note.tags.length > 0 && (
              <div className="mt-2 text-gray-900 dark:text-gray-300">
                <strong>برچسب‌ها:</strong> {note.tags.join(", ")}
              </div>
            )}
            {note.reminder && (
              <div className="mt-1 text-gray-900 dark:text-gray-300">
                <strong>یادآوری:</strong> {new Date(note.reminder).toLocaleString()}
              </div>
            )}
            {note.attachment && (
              <div className="mt-2">
                <img src={note.attachment} alt="Attachment" className="w-full h-auto rounded-lg shadow-sm" />
              </div>
            )}
            {note.versions && note.versions.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400">تاریخچه تغییرات</summary>
                <ul className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {note.versions.map((version, index) => (
                    <li key={index}>نسخه {index + 1}: {version}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NotesList;
