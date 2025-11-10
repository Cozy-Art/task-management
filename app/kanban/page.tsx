'use client';

/**
 * Kanban Board Page
 * Multi-row Kanban board showing tasks organized by project
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTodoistProjects } from '@/lib/hooks/useTodoistProjects';
import { useTodoistTasks } from '@/lib/hooks/useTodoistTasks';
import { useDailyAllocation } from '@/lib/hooks/useDailyAllocation';
import { ProjectRow } from '@/components/kanban/project-row';
import { TaskCard } from '@/components/kanban/task-card';
import { TodoistTask } from '@/lib/types/todoist';

export default function KanbanPage() {
  const { data: projects, isLoading: projectsLoading } = useTodoistProjects();
  const { data: allTasks, isLoading: tasksLoading } = useTodoistTasks();
  const { data: dailyAllocation, isLoading: allocationLoading } = useDailyAllocation();

  const [activeTask, setActiveTask] = useState<TodoistTask | null>(null);
  const [tasks, setTasks] = useState<TodoistTask[]>([]);

  // Initialize tasks from API
  useEffect(() => {
    if (allTasks) {
      setTasks(allTasks);
    }
  }, [allTasks]);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as TodoistTask;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Add visual feedback during drag
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const task = active.data.current?.task as TodoistTask;

    // Check if dropped on a column (not another task)
    const targetColumnType = over.data.current?.columnType;

    if (targetColumnType && task) {
      // Moved to a different column - update labels
      const categoryLabels = ['@putting-off', '@strategy', '@timely'];
      const newLabel = `@${targetColumnType}`;

      // Remove all category labels and add the new one
      const updatedLabels = [
        ...task.labels.filter((label) => !categoryLabels.includes(label)),
        newLabel,
      ];

      // Optimistically update UI
      setTasks((tasks) =>
        tasks.map((t) => (t.id === task.id ? { ...t, labels: updatedLabels } : t))
      );

      // Sync with Todoist
      try {
        const response = await fetch('/api/todoist/update-labels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: task.id,
            labels: updatedLabels,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update labels');
        }

        const result = await response.json();
        console.log('Labels updated successfully:', result);
      } catch (error) {
        console.error('Error updating labels:', error);
        // Revert on error
        setTasks((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
        alert('Failed to update task labels. Please try again.');
      }
    } else {
      // Reordering within same column
      const overId = over.id;
      if (activeId === overId) return;

      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((t) => t.id === activeId);
        const newIndex = tasks.findIndex((t) => t.id === overId);

        if (oldIndex === -1 || newIndex === -1) return tasks;

        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  };

  // Create allocation map for easy lookup
  const allocationMap = new Map<string, number>();
  dailyAllocation?.project_allocations?.forEach((allocation) => {
    allocationMap.set(allocation.project_id, allocation.percentage);
  });

  // Sort projects: selected projects first (by percentage desc), then unselected (alphabetically)
  const sortedProjects = projects
    ? [...projects].sort((a, b) => {
        const aAllocation = allocationMap.get(a.id);
        const bAllocation = allocationMap.get(b.id);

        // Both have allocations - sort by percentage descending
        if (aAllocation !== undefined && bAllocation !== undefined) {
          return bAllocation - aAllocation;
        }

        // Only a has allocation - a comes first
        if (aAllocation !== undefined) return -1;

        // Only b has allocation - b comes first
        if (bAllocation !== undefined) return 1;

        // Neither has allocation - sort alphabetically
        return a.name.localeCompare(b.name);
      })
    : [];

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading your board...</p>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No Projects Found</h2>
          <p className="text-muted-foreground mb-4">
            You don't have any projects in Todoist yet. Create some projects first!
          </p>
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
            <div>
              <h1 className="text-4xl font-bold mb-2">📊 Multi-Row Kanban</h1>
              <p className="text-muted-foreground">
                Organize your tasks across Putting Off, Strategy, and Timely
              </p>
            </div>
            <Link
              href="/planning"
              className="hidden md:inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              📅 Daily Planning
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-8 rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>💡 How to categorize tasks:</strong> Add labels to your Todoist tasks:
            <code className="mx-1 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">
              @putting-off
            </code>
            ,
            <code className="mx-1 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">
              @strategy
            </code>
            , or
            <code className="mx-1 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">
              @timely
            </code>
            . Tasks without these labels appear in "Timely" by default.
          </p>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-6">
            {sortedProjects.map((project) => {
              const projectTasks = tasks.filter((task) => task.project_id === project.id);

              // Only show projects with tasks (for MVP)
              if (projectTasks.length === 0) return null;

              const allocationPercentage = allocationMap.get(project.id);
              const isInDailyPlan = allocationPercentage !== undefined;

              return (
                <ProjectRow
                  key={project.id}
                  project={project}
                  tasks={projectTasks}
                  defaultExpanded={isInDailyPlan}
                  allocationPercentage={allocationPercentage}
                  allProjects={projects}
                />
              );
            })}

            {tasks.filter((task) => projects.some((p) => p.id === task.project_id)).length ===
              0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks found in your projects.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add some tasks in Todoist to see them here!
                </p>
              </div>
            )}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3">
                <TaskCard task={activeTask} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
