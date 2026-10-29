import { useEffect, useRef, useState } from 'react';
import { createTask } from '../lib/api';
import type { CreateTaskPayload } from '../types/task';
import { useToast } from './Toast';

interface TaskFormProps {
  onClose: () => void;
  onTaskCreated: () => void;
}

export default function TaskForm({ onClose, onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (titleError) setTitleError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateTaskPayload = { title: trimmed };
      if (description.trim()) payload.description = description.trim();
      if (dueDate) payload.dueDate = dueDate;

      await createTask(payload);
      onTaskCreated();
      onClose();
      showToast('Task created', 'success');
    } catch {
      showToast('Failed to create task. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const inputBorderClass = titleError
    ? 'border-destructive-600 focus:ring-destructive-600/20 focus:border-destructive-600'
    : 'border-gray-300 focus:ring-primary-600/20 focus:border-primary-600';

  return (
    <div
      className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Create New Task</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-destructive-600">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={handleTitleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${inputBorderClass}`}
            />
            {titleError && (
              <p className="mt-1.5 text-sm text-destructive-600">Title is required</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-colors resize-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              id="due-date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-colors text-gray-700"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <span>{submitting ? 'Creating...' : 'Create Task'}</span>
              {submitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
