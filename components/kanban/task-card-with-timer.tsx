'use client';

/**
 * TaskCard with Timer
 * Enhanced TaskCard with timer and completion functionality
 */

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TodoistTask } from '@/lib/types/todoist';
import { useTimerContext } from '@/components/providers/timer-provider';
import { TaskCompletionModal } from './task-completion-modal';
import { TaskEditModal } from './task-edit-modal';
import { cn, formatTime, getToday } from '@/lib/utils';
import { TaskCategory } from '@/lib/types/app';

interface TaskCardWithTimerProps {
  task: TodoistTask;
  category?: TaskCategory;
  projectName?: string;
  isDragging?: boolean;
}

export function TaskCardWithTimer({ task, category, projectName, isDragging = false }: TaskCardWithTimerProps) {
  const queryClient = useQueryClient();
  const { isTimerActive, startTimer, stopTimer, getElapsedSeconds } = useTimerContext();
  const [elapsed, setElapsed] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const isActive = isTimerActive(task.id);

  // Update elapsed time
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsed(getElapsedSeconds());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, getElapsedSeconds]);

  const priorityColors = {
    4: 'border-l-red-500', // P1 (highest)
    3: 'border-l-orange-500', // P2
    2: 'border-l-blue-500', // P3
    1: 'border-l-gray-400', // P4 (normal)
  };

  const priorityLabels = {
    4: 'P1',
    3: 'P2',
    2: 'P3',
    1: 'P4',
  };

  const formatDueDate = (due?: TodoistTask['due']) => {
    if (!due) return null;

    const dueDate = new Date(due.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: due.string, color: 'text-red-600 dark:text-red-400' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600 dark:text-orange-400' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-blue-600 dark:text-blue-400' };
    return { text: due.string, color: 'text-muted-foreground' };
  };

  const dueInfo = formatDueDate(task.due);

  const handleTimerToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      stopTimer();
      setElapsed(0);
    } else {
      startTimer(task.id);
    }
  };

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCompletionModal(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleComplete = async (durationMinutes: number, notes?: string) => {
    try {
      // Save time entry
      await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: getToday(),
          todoist_task_id: task.id,
          todoist_project_id: task.project_id,
          project_name: task.project_id, // We'll look this up later
          task_name: task.content,
          duration_minutes: durationMinutes,
          category,
          notes,
        }),
      });

      // Complete task in Todoist
      await fetch('/api/todoist/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id }),
      });

      // Stop timer if active
      if (isActive) {
        stopTimer();
      }

      // Refresh task list
      queryClient.invalidateQueries({ queryKey: ['todoist', 'tasks'] });

      // Close modal
      setShowCompletionModal(false);
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    }
  };

  return (
    <>
      <div
        className={cn(
          'group rounded-lg border-l-4 border-t border-r border-b bg-card p-4 shadow-sm transition-all',
          'hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          priorityColors[task.priority],
          isDragging && 'opacity-50 cursor-grabbing',
          isActive && 'ring-2 ring-blue-500 ring-offset-2'
        )}
      >
        {/* Task Content */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium leading-tight flex-1">{task.content}</h3>

            {/* Priority Badge */}
            {task.priority > 1 && (
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0',
                  task.priority === 4 &&
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                  task.priority === 3 &&
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
                  task.priority === 2 &&
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                )}
              >
                {priorityLabels[task.priority]}
              </span>
            )}
          </div>

          {/* Description (if exists) */}
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          )}

          {/* Timer Display */}
          {isActive && (
            <div className="rounded bg-blue-50 dark:bg-blue-950/20 px-3 py-2">
              <p className="text-sm font-mono font-medium text-blue-900 dark:text-blue-100">
                ⏱️ {formatTime(elapsed)}
              </p>
            </div>
          )}

          {/* Footer: Due Date and Labels */}
          <div className="flex items-center justify-between gap-2">
            {/* Due Date */}
            {dueInfo && (
              <div className="flex items-center gap-1">
                <svg
                  className={cn('h-4 w-4', dueInfo.color)}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className={cn('text-xs font-medium', dueInfo.color)}>{dueInfo.text}</span>
              </div>
            )}

            {/* Labels */}
            <div className="flex gap-1 flex-wrap items-center">
              {task.labels.length > 0 && (
                <>
                  {task.labels.slice(0, 2).map((label) => (
                    <span
                      key={label}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
                    >
                      {label}
                    </span>
                  ))}
                  {task.labels.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{task.labels.length - 2}</span>
                  )}
                </>
              )}
              {/* Edit button - small plus icon */}
              <button
                onClick={handleEditClick}
                className="h-5 w-5 rounded-full bg-secondary hover:bg-accent transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
                title="Edit labels and task details"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleTimerToggle}
              className={cn(
                'flex-1 min-h-[36px] rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isActive
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {isActive ? '⏸ Pause' : '▶ Start'}
            </button>

            <button
              onClick={handleCompleteClick}
              className="flex-1 min-h-[36px] rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              ✓ Complete
            </button>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <TaskCompletionModal
          task={task}
          elapsedSeconds={isActive ? elapsed : 0}
          onComplete={handleComplete}
          onCancel={() => setShowCompletionModal(false)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <TaskEditModal
          task={task}
          projectName={projectName || 'Unknown Project'}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
