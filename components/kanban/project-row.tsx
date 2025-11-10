/**
 * ProjectRow Component
 * One row per project with three columns: Putting Off, Strategy, Timely
 */

import { TodoistTask, TodoistProject } from '@/lib/types/todoist';
import { Column, ColumnType } from './column';
import { TaskCategory } from '@/lib/types/app';

interface ProjectRowProps {
  project: TodoistProject;
  tasks: TodoistTask[];
}

export function ProjectRow({ project, tasks }: ProjectRowProps) {
  // Categorize tasks based on labels
  // For MVP, we'll use a simple categorization:
  // - Tasks with @putting-off label -> Putting Off
  // - Tasks with @strategy label -> Strategy
  // - Tasks with @timely label -> Timely
  // - Tasks without these labels -> default to Timely (for now)

  const categorizeTasks = (tasks: TodoistTask[]) => {
    const categorized: Record<TaskCategory, TodoistTask[]> = {
      'putting-off': [],
      strategy: [],
      timely: [],
    };

    tasks.forEach((task) => {
      // Check labels (case-insensitive)
      const labels = task.labels.map((l) => l.toLowerCase());

      if (labels.some((l) => l.includes('putting-off') || l.includes('putting_off'))) {
        categorized['putting-off'].push(task);
      } else if (labels.some((l) => l.includes('strategy'))) {
        categorized.strategy.push(task);
      } else {
        // Default to timely for tasks without categorization
        categorized.timely.push(task);
      }
    });

    return categorized;
  };

  const categorizedTasks = categorizeTasks(tasks);

  return (
    <div className="space-y-4">
      {/* Project Header */}
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color }} />
        <h2 className="text-2xl font-bold">{project.name}</h2>
        <span className="text-sm text-muted-foreground">({tasks.length} tasks)</span>
      </div>

      {/* Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Column
          id={`${project.id}-putting-off`}
          type="putting-off"
          title="Putting Off"
          tasks={categorizedTasks['putting-off']}
          color="#ef4444" // red-500
        />

        <Column
          id={`${project.id}-strategy`}
          type="strategy"
          title="Strategy"
          tasks={categorizedTasks.strategy}
          color="#3b82f6" // blue-500
        />

        <Column
          id={`${project.id}-timely`}
          type="timely"
          title="Timely"
          tasks={categorizedTasks.timely}
          color="#22c55e" // green-500
        />
      </div>
    </div>
  );
}
