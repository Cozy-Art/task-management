/**
 * TaskCard Component
 * Displays a Todoist task with priority, due date, and labels
 */

import { TodoistTask } from '@/lib/types/todoist';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: TodoistTask;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const priorityColors = {
    4: 'border-l-red-500',    // P1 (highest)
    3: 'border-l-orange-500', // P2
    2: 'border-l-blue-500',   // P3
    1: 'border-l-gray-400',   // P4 (normal)
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

  return (
    <div
      className={cn(
        'group rounded-lg border-l-4 border-t border-r border-b bg-card p-4 shadow-sm transition-all',
        'hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        priorityColors[task.priority],
        isDragging && 'opacity-50 cursor-grabbing'
      )}
    >
      {/* Task Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight flex-1">{task.content}</h3>

          {/* Priority Badge */}
          {task.priority > 1 && (
            <span
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded',
                task.priority === 4 && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                task.priority === 3 && 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
                task.priority === 2 && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
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

        {/* Footer: Due Date and Labels */}
        <div className="flex items-center justify-between gap-2 pt-2">
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
          {task.labels.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.labels.slice(0, 3).map((label) => (
                <span
                  key={label}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
                >
                  {label}
                </span>
              ))}
              {task.labels.length > 3 && (
                <span className="text-xs text-muted-foreground">+{task.labels.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
