import React from "react";
import { format } from "date-fns-jalali";
import { marked } from 'marked';
import { NotesListProps } from '../types';

interface Note {
  id: number;
  content: string;
  tags: string[];
  attachment?: string;
  reminder?: string;
  versions: string[];
  createdAt: Date;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  onDelete,
  onEdit,
  onShare,
  viewMode,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          هنوز یادداشتی ثبت نشده است
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          برای شروع، یک یادداشت جدید ایجاد کنید
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {notes.map((note, index) => (
        <article
          key={note.id}
          className="card group animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-2 flex-wrap">
                {note.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onShare(note.id)}
                  className="icon-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="اشتراک‌گذاری"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(note.id)}
                  className="icon-btn text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                  title="ویرایش"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="icon-btn text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                  title="حذف"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="prose-custom">
              <div dangerouslySetInnerHTML={{ 
                __html: marked(note.content.length > 300 ? note.content.slice(0, 300) + '...' : note.content) 
              }} />
            </div>

            {note.attachment && (
              <div className="relative group/img">
                <img 
                  src={note.attachment} 
                  alt="پیوست" 
                  className="rounded-lg max-h-48 w-full object-cover transition-transform group-hover/img:scale-[1.02]" 
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button 
                    onClick={() => window.open(note.attachment, '_blank')}
                    className="btn-secondary"
                  >
                    مشاهده تصویر
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={note.createdAt.toISOString()} className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {formatDate(note.createdAt)}
              </time>
              {note.reminder && (
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <time dateTime={note.reminder}>
                    {formatDate(new Date(note.reminder))}
                  </time>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

const ActionButton: React.FC<{
  onClick: () => void;
  color: "yellow" | "blue" | "red";
  children: React.ReactNode;
}> = ({ onClick, color, children }) => {
  const colors = {
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 ${colors[color]} text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-lg`}
    >
      {children}
    </button>
  );
};

export default NotesList;   