'use client';

/**
 * Task Edit Modal
 * Modal to edit an existing task with all Todoist fields
 */

import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTodoistLabels } from '@/lib/hooks/useTodoistLabels';
import { TodoistTask } from '@/lib/types/todoist';
import { cn } from '@/lib/utils';

interface TaskEditModalProps {
  task: TodoistTask;
  projectName: string;
  onClose: () => void;
}

export function TaskEditModal({ task, projectName, onClose }: TaskEditModalProps) {
  const queryClient = useQueryClient();
  const { data: allLabels } = useTodoistLabels();

  const [content, setContent] = useState(task.content);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(task.priority);
  const [dueString, setDueString] = useState(task.due?.string || '');
  const [selectedLabels, setSelectedLabels] = useState<string[]>(task.labels);

  // Determine initial category label
  const initialCategory = task.labels.find((l) =>
    ['@putting-off', '@strategy', '@timely'].includes(l)
  ) as '@putting-off' | '@strategy' | '@timely' | null;

  const [categoryLabel, setCategoryLabel] = useState<'@putting-off' | '@strategy' | '@timely' | null>(
    initialCategory || null
  );
  const [labelInput, setLabelInput] = useState('');
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const labelInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const priorities = [
    { value: 4, label: 'P1', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    { value: 3, label: 'P2', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { value: 2, label: 'P3', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { value: 1, label: 'P4', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
  ];

  const categoryLabels = [
    { value: '@putting-off', label: 'Putting Off', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { value: '@strategy', label: 'Strategy', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { value: '@timely', label: 'Timely', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  ] as const;

  // Handle category label selection (mutually exclusive)
  const handleCategorySelect = (category: '@putting-off' | '@strategy' | '@timely') => {
    if (categoryLabel === category) {
      // Deselect if clicking the same one
      setCategoryLabel(null);
      setSelectedLabels(selectedLabels.filter(l => !['@putting-off', '@strategy', '@timely'].includes(l)));
    } else {
      // Select new category and remove any existing category labels
      setCategoryLabel(category);
      const withoutCategories = selectedLabels.filter(l => !['@putting-off', '@strategy', '@timely'].includes(l));
      setSelectedLabels([...withoutCategories, category]);
    }
  };

  // Filter labels based on input (exclude category labels as they have their own section)
  const filteredLabels = allLabels?.filter(
    (label) =>
      !selectedLabels.includes(label.name) &&
      !['@putting-off', '@strategy', '@timely'].includes(label.name) &&
      label.name.toLowerCase().includes(labelInput.toLowerCase())
  ) || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !labelInputRef.current?.contains(event.target as Node)
      ) {
        setShowLabelDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addLabel = (labelName: string) => {
    if (labelName.trim() && !selectedLabels.includes(labelName.trim())) {
      setSelectedLabels([...selectedLabels, labelName.trim()]);
      setLabelInput('');
      setShowLabelDropdown(false);
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setSelectedLabels(selectedLabels.filter((l) => l !== labelToRemove));
    // If removing a category label, also clear the categoryLabel state
    if (['@putting-off', '@strategy', '@timely'].includes(labelToRemove)) {
      setCategoryLabel(null);
    }
  };

  const handleLabelInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredLabels.length > 0) {
        addLabel(filteredLabels[0].name);
      } else if (labelInput.trim()) {
        addLabel(labelInput);
      }
    } else if (e.key === 'Backspace' && labelInput === '' && selectedLabels.length > 0) {
      removeLabel(selectedLabels[selectedLabels.length - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Task name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/todoist/update-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          content: content.trim(),
          description: description.trim() || undefined,
          priority,
          due_string: dueString.trim() || undefined,
          labels: selectedLabels.length > 0 ? selectedLabels : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      // Refresh task list
      queryClient.invalidateQueries({ queryKey: ['todoist', 'tasks'] });

      // Close modal
      onClose();
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
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
          <h2 className="text-xl font-semibold">Edit Task</h2>
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

          {/* Category (Kanban Column) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Kanban Category</label>
            <div className="grid grid-cols-3 gap-2">
              {categoryLabels.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategorySelect(cat.value)}
                  className={cn(
                    'min-h-[40px] rounded-lg border p-2 text-sm font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    categoryLabel === cat.value
                      ? cat.color
                      : 'border-border bg-background hover:bg-accent'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select which column this task should appear in on the Kanban board
            </p>
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

            {/* Selected Labels */}
            <div className="relative">
              <div className="flex flex-wrap gap-2 min-h-[44px] rounded-md border bg-background p-2">
              {selectedLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                >
                  {label}
                  <button
                    onClick={() => removeLabel(label)}
                    className="hover:text-destructive transition-colors"
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}

              {/* Input for adding labels */}
              <input
                ref={labelInputRef}
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onFocus={() => setShowLabelDropdown(true)}
                onKeyDown={handleLabelInputKeyDown}
                placeholder={selectedLabels.length === 0 ? "Type to search or add labels..." : ""}
                className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
              />
            </div>

            {/* Dropdown with existing labels */}
            {showLabelDropdown && (labelInput || filteredLabels.length > 0) && (
              <div
                ref={dropdownRef}
                className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-popover shadow-lg"
              >
                {filteredLabels.length > 0 ? (
                  <div className="py-1">
                    {filteredLabels.map((label) => (
                      <button
                        key={label.id}
                        onClick={() => addLabel(label.name)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
                        type="button"
                      >
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        {label.name}
                      </button>
                    ))}
                  </div>
                ) : labelInput.trim() ? (
                  <button
                    onClick={() => addLabel(labelInput)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                    type="button"
                  >
                    <span className="text-muted-foreground">Create:</span> "{labelInput}"
                  </button>
                ) : null}
              </div>
            )}
            </div>

            <p className="text-xs text-muted-foreground">
              Press Enter to add label. Category labels can be selected above.
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
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
