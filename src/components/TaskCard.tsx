import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Trash2, GripVertical } from 'lucide-react';
import { Task } from '../types/task';
import { cn } from '../utils/cn';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, updates: Partial<Task>) => void;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (!isDragging) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const trimmedTitle = editedTitle.trim();
    if (trimmedTitle && trimmedTitle !== task.title) {
      onEdit?.(task._id, { title: trimmedTitle });
    } else {
      setEditedTitle(task.title); // Reset if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm',
        task.completed && 'bg-gray-50',
        isDragging && 'opacity-50 shadow-xl ring-2 ring-blue-500 scale-105',
        'touch-none' // Prevents scrolling while dragging on mobile
      )}
    >
      <button
        {...listeners}
        {...attributes}
        className="mt-0.5 cursor-grab touch-none opacity-0 group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </button>
      
      <button
        onClick={() => onToggle(task._id)}
        className={cn(
          'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border',
          task.completed ? 'border-green-500 bg-green-500' : 'border-gray-300'
        )}
      >
        {task.completed && <Check className="h-3 w-3 text-white" />}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex-1 min-w-0 bg-transparent px-1 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded',
            task.completed && 'text-gray-500'
          )}
        />
      ) : (
        <span 
          onClick={handleEdit}
          className={cn(
            'flex-1 min-w-0 cursor-pointer break-words px-1 rounded hover:bg-gray-50',
            task.completed && 'text-gray-500 line-through'
          )}
        >
          {task.title}
        </span>
      )}

      <button
        onClick={() => onDelete(task._id)}
        className="mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="h-5 w-5 text-red-500" />
      </button>
    </div>
  );
}