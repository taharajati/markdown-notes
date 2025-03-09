import React from "react";
import { NoteFormProps } from '../types';
import { marked } from 'marked';

const NoteForm: React.FC<NoteFormProps> = ({
  currentNote,
  currentTags,
  attachment,
  reminder,
  isPreview,
  editingNoteId,
  onNoteChange,
  onTagsChange,
  onReminderChange,
  onFileChange,
  onPreviewToggle,
  onSave,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card glass p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {editingNoteId ? "ویرایش یادداشت" : "یادداشت جدید"}
        </h2>
        <button
          type="button"
          onClick={onPreviewToggle}
          className="btn-secondary"
        >
          {isPreview ? (
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              ویرایش
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              پیش‌نمایش
            </span>
          )}
        </button>
      </div>

      {isPreview ? (
        <div className="prose-custom min-h-[200px] p-6 card animate-scale-in">
          <div dangerouslySetInnerHTML={{ __html: marked(currentNote || 'متن خود را وارد کنید...') }} />
        </div>
      ) : (
        <textarea
          value={currentNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="متن یادداشت خود را اینجا بنویسید..."
          className="input min-h-[200px] resize-y animate-scale-in"
          dir="auto"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 animate-slide-in">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            برچسب‌ها
          </label>
          <input
            type="text"
            value={currentTags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="برچسب‌ها را با کاما جدا کنید"
            className="input"
          />
        </div>

        <div className="space-y-2 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            یادآوری
          </label>
          <input
            type="datetime-local"
            value={reminder}
            onChange={(e) => onReminderChange(e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div className="space-y-2 animate-slide-in" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          پیوست
        </label>
        <input
          type="file"
          onChange={handleFileInput}
          className="input-file"
          accept="image/*"
        />
        {attachment && (
          <div className="mt-4 relative group animate-scale-in">
            <img src={attachment} alt="پیوست" className="rounded-lg max-h-48 w-full object-cover" />
            <button
              type="button"
              onClick={() => onFileChange(null)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="حذف تصویر"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="btn-primary"
          disabled={!currentNote.trim()}
        >
          {editingNoteId ? "به‌روزرسانی" : "ذخیره"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm; 