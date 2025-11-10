/**
 * Project Selector Component
 * Allows users to select 1-6 projects for daily planning
 */

import { TodoistProject } from '@/lib/types/todoist';
import { cn } from '@/lib/utils';
import { getTodoistColor } from '@/lib/utils/colors';

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

  // Helper to get parent project name
  const getParentProject = (parentId: string | undefined) => {
    if (!parentId) return null;
    return projects.find((p) => p.id === parentId);
  };

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
          const parentProject = getParentProject(project.parent_id);
          const isSubProject = !!project.parent_id;

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
                {/* Show indent icon for sub-projects */}
                {isSubProject && (
                  <svg
                    className="h-4 w-4 text-muted-foreground flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                <div
                  className="h-4 w-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getTodoistColor(project.color) }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{project.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {parentProject && (
                      <span className="text-xs text-muted-foreground">
                        ↳ {parentProject.name}
                      </span>
                    )}
                    {project.is_favorite && (
                      <span className="text-xs text-muted-foreground">⭐ Favorite</span>
                    )}
                  </div>
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
