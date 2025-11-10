/**
 * Project Selector Component
 * Allows users to select 1-6 projects for daily planning
 */

import { TodoistProject } from '@/lib/types/todoist';
import { cn } from '@/lib/utils';

interface ProjectSelectorProps {
  projects: TodoistProject[];
  selectedProjects: string[];
  onProjectToggle: (projectId: string) => void;
  maxProjects: number;
}

export function ProjectSelector({
  projects,
  selectedProjects,
  onProjectToggle,
  maxProjects,
}: ProjectSelectorProps) {
  const isMaxSelected = selectedProjects.length >= maxProjects;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Select Projects</h2>
        <span className="text-sm text-muted-foreground">
          {selectedProjects.length} / {maxProjects} selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map((project) => {
          const isSelected = selectedProjects.includes(project.id);
          const isDisabled = !isSelected && isMaxSelected;

          return (
            <button
              key={project.id}
              onClick={() => onProjectToggle(project.id)}
              disabled={isDisabled}
              className={cn(
                'min-h-[44px] rounded-lg border p-4 text-left transition-all',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-background hover:bg-accent',
                isDisabled && 'opacity-50 cursor-not-allowed hover:bg-background'
              )}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? 'Deselect' : 'Select'} project ${project.name}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{project.name}</p>
                  {project.is_favorite && (
                    <span className="text-xs text-muted-foreground">⭐ Favorite</span>
                  )}
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {isMaxSelected && (
        <p className="text-sm text-muted-foreground mt-4">
          Maximum projects selected. Deselect a project to choose a different one.
        </p>
      )}
    </div>
  );
}
