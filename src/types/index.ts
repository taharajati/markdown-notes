export interface Note {
  id: number;
  content: string;
  tags: string[];
  attachment?: string;
  reminder?: string;
  versions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFormProps {
  currentNote: string;
  currentTags: string;
  attachment: string;
  reminder: string;
  isPreview: boolean;
  editingNoteId: number | null;
  onNoteChange: (note: string) => void;
  onTagsChange: (tags: string) => void;
  onReminderChange: (reminder: string) => void;
  onFileChange: (file: File) => void;
  onPreviewToggle: () => void;
  onSave: () => void;
}

export interface NotesListProps {
  notes: Note[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onShare: (id: number) => void;
  viewMode: "list" | "grid";
}

export type ViewMode = "list" | "grid"; 