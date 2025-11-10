'use client';

/**
 * Project Page
 * Single-project Kanban view with task creation
 */

import { useState, use } from 'react';
import Link from 'next/link';
import { useTodoistProjects } from '@/lib/hooks/useTodoistProjects';
import { useTodoistTasks } from '@/lib/hooks/useTodoistTasks';
import { Column } from '@/components/kanban/column';
import { TaskCreationModal } from '@/components/kanban/task-creation-modal';
import { TodoistTask } from '@/lib/types/todoist';
import { TaskCategory } from '@/lib/types/app';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id: projectId } = use(params);
  const { data: projects, isLoading: projectsLoading } = useTodoistProjects();
  const { data: allTasks, isLoading: tasksLoading } = useTodoistTasks({ projectId });
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Find the current project and its sub-projects
  const project = projects?.find((p) => p.id === projectId);
  const subProjects = projects?.filter((p) => p.parent_id === projectId) || [];

  // Categorize tasks based on labels
  const categorizeTasks = (tasks: TodoistTask[]) => {
    const categorized: Record<TaskCategory, TodoistTask[]> = {
      'putting-off': [],
      strategy: [],
      timely: [],
    };

    tasks?.forEach((task) => {
      const labels = task.labels.map((l) => l.toLowerCase());

      if (labels.some((l) => l.includes('putting-off') || l.includes('putting_off'))) {
        categorized['putting-off'].push(task);
      } else if (labels.some((l) => l.includes('strategy'))) {
        categorized.strategy.push(task);
      } else {
        categorized.timely.push(task);
      }
    });

    return categorized;
  };

  const categorizedTasks = categorizeTasks(allTasks || []);

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            ← Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-6 w-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <div>
                <h1 className="text-4xl font-bold">{project.name}</h1>
                {subProjects.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {subProjects.length} sub-project{subProjects.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              New Task
            </button>
          </div>
        </div>

        {/* Sub-projects display */}
        {subProjects.length > 0 && (
          <div className="mb-6 rounded-lg border bg-card p-4">
            <h3 className="text-sm font-medium mb-2">Sub-projects:</h3>
            <div className="flex flex-wrap gap-2">
              {subProjects.map((subProject) => (
                <Link
                  key={subProject.id}
                  href={`/project/${subProject.id}`}
                  className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: subProject.color }}
                  />
                  {subProject.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Task stats */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-2xl font-bold">{allTasks?.length || 0}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Putting Off</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {categorizedTasks['putting-off'].length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Strategy</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {categorizedTasks.strategy.length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Timely</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {categorizedTasks.timely.length}
            </p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Column
            id={`${projectId}-putting-off`}
            type="putting-off"
            title="Putting Off"
            tasks={categorizedTasks['putting-off']}
            color="#ef4444" // red-500
          />

          <Column
            id={`${projectId}-strategy`}
            type="strategy"
            title="Strategy"
            tasks={categorizedTasks.strategy}
            color="#3b82f6" // blue-500
          />

          <Column
            id={`${projectId}-timely`}
            type="timely"
            title="Timely"
            tasks={categorizedTasks.timely}
            color="#22c55e" // green-500
          />
        </div>

        {allTasks?.length === 0 && (
          <div className="text-center py-12 rounded-lg border border-dashed">
            <p className="text-muted-foreground mb-4">No tasks in this project yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              Create Your First Task
            </button>
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {showCreateModal && (
        <TaskCreationModal
          projectId={projectId}
          projectName={project.name}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </main>
  );
}
