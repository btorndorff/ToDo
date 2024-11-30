import React, { useState } from 'react';
import { cn } from '../utils/cn';

interface AddTaskFormProps {
  onSubmit: (title: string) => void;
  onBulkSubmit?: (text: string) => void;
}

type InputMode = 'single' | 'multi';

export function AddTaskForm({ onSubmit, onBulkSubmit }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [mode, setMode] = useState<InputMode>('single');

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle('');
    }
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkText.trim() && onBulkSubmit) {
      onBulkSubmit(bulkText.trim());
      setBulkText('');
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex justify-center p-2">
        <button
          type="button"
          onClick={() => setMode('single')}
          className={cn(
            'px-4 py-2  font-medium transition-colors',
            mode === 'single'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-200'
          )}
        >
          Single Task
        </button>
        <button
          type="button"
          onClick={() => setMode('multi')}
          className={cn(
            'px-4 py-2 font-medium transition-colors',
            mode === 'multi'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-200'
          )}
        >
          Multiple Tasks
        </button>
      </div>

      {mode === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            Add Task
          </button>
        </form>
      ) : (
        <form onSubmit={handleBulkSubmit} className="flex gap-2">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Enter multiple tasks or paste text to be parsed..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px] resize-y"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-fit"
          >
            Parse & Add Tasks
          </button>
        </form>
      )}
    </div>
  );
}