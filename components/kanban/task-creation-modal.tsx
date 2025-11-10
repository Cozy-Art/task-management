'use client';

/**
 * Task Creation Modal
 * Modal to create a new task with all Todoist fields
 */

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface TaskCreationModalProps {
  projectId: string;
  projectName: string;
  onClose: () => void;
}

export function TaskCreationModal({ projectId, projectName, onClose }: TaskCreationModalProps) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(1);
  const [dueString, setDueString] = useState('');
  const [labels, setLabels] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priorities = [
    { value: 4, label: 'P1', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { value: 3, label: 'P2', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { value: 2, label: 'P3', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { value: 1, label: 'P4', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
  ];

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Task name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Parse labels (comma-separated)
      const labelArray = labels
        .split(',')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const response = await fetch('/api/todoist/create-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          description: description.trim() || undefined,
          project_id: projectId,
          priority,
          due_string: dueString.trim() || undefined,
          labels: labelArray.length > 0 ? labelArray : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      // Refresh task list
      queryClient.invalidateQueries({ queryKey: ['todoist', 'tasks'] });

      // Close modal
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to create task');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border bg-card shadow-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <p className="text-sm text-muted-foreground mt-1">In {projectName}</p>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Task Name */}
          <div className="space-y-2">
            <label htmlFor="task-name" className="text-sm font-medium">
              Task Name *
            </label>
            <input
              id="task-name"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g., Design landing page mockup"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the task..."
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value as 1 | 2 | 3 | 4)}
                  className={cn(
                    'min-h-[40px] rounded-lg border p-2 text-sm font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    priority === p.value
                      ? p.color
                      : 'border-border bg-background hover:bg-accent'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label htmlFor="due-date" className="text-sm font-medium">
              Due Date
            </label>
            <input
              id="due-date"
              type="text"
              value={dueString}
              onChange={(e) => setDueString(e.target.value)}
              placeholder="e.g., tomorrow, next monday, Dec 25"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Use natural language like "tomorrow", "next week", or specific dates
            </p>
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <label htmlFor="labels" className="text-sm font-medium">
              Labels
            </label>
            <input
              id="labels"
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="e.g., @timely, urgent, design (comma separated)"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple labels with commas. Use @timely, @strategy, or @putting-off for Kanban categories
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 min-h-[44px] rounded-lg border border-border bg-background px-4 py-2 font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="flex-1 min-h-[44px] rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                Creating...
              </span>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
