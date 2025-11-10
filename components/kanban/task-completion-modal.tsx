'use client';

/**
 * Task Completion Modal
 * Modal to log time when completing a task
 */

import { useState } from 'react';
import { TodoistTask } from '@/lib/types/todoist';
import { formatDuration, getToday } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TaskCompletionModalProps {
  task: TodoistTask;
  elapsedSeconds: number;
  onComplete: (durationMinutes: number, notes?: string) => Promise<void>;
  onCancel: () => void;
}

export function TaskCompletionModal({
  task,
  elapsedSeconds,
  onComplete,
  onCancel,
}: TaskCompletionModalProps) {
  const suggestedMinutes = Math.round(elapsedSeconds / 60);
  const [selectedMinutes, setSelectedMinutes] = useState(suggestedMinutes || 15);
  const [customMinutes, setCustomMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const quickOptions = [15, 30, 60];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const duration = showCustom ? parseInt(customMinutes) || selectedMinutes : selectedMinutes;
      await onComplete(duration, notes || undefined);
    } catch (error) {
      console.error('Error completing task:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-lg border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Complete Task</h2>
          <p className="text-sm text-muted-foreground mt-1">{task.content}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Timer Display */}
          {elapsedSeconds > 0 && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                ⏱️ Timer: {formatDuration(suggestedMinutes)}
              </p>
            </div>
          )}

          {/* Quick Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Spent</label>
            <div className="grid grid-cols-3 gap-2">
              {quickOptions.map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => {
                    setSelectedMinutes(minutes);
                    setShowCustom(false);
                  }}
                  className={cn(
                    'min-h-[44px] rounded-lg border p-3 text-sm font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    selectedMinutes === minutes && !showCustom
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:bg-accent'
                  )}
                >
                  {formatDuration(minutes)}
                </button>
              ))}
            </div>

            {/* Custom Time Input */}
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="w-full rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
              {showCustom ? '✓ Custom time' : '+ Custom time'}
            </button>

            {showCustom && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Minutes"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 min-h-[44px] rounded-lg border border-border bg-background px-4 py-2 font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (showCustom && !customMinutes)}
            className="flex-1 min-h-[44px] rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                Completing...
              </span>
            ) : (
              'Complete Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
