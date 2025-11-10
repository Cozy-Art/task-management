/**
 * Allocation Sliders Component
 * Allows users to set percentage allocations for selected projects
 */

import { TodoistProject } from '@/lib/types/todoist';
import { percentageToHours, formatDuration, cn } from '@/lib/utils';
import { getTodoistColor } from '@/lib/utils/colors';

interface AllocationSlidersProps {
  projects: TodoistProject[];
  selectedProjects: string[];
  allocations: Record<string, number>;
  onAllocationChange: (projectId: string, percentage: number) => void;
  totalWorkHours: number;
  onWorkHoursChange: (hours: number) => void;
  totalAllocation: number;
  isValid: boolean;
  onSave: () => void;
  isSaving: boolean;
  saveError?: string | null;
}

export function AllocationSliders({
  projects,
  selectedProjects,
  allocations,
  onAllocationChange,
  totalWorkHours,
  onWorkHoursChange,
  totalAllocation,
  isValid,
  onSave,
  isSaving,
  saveError,
}: AllocationSlidersProps) {
  if (selectedProjects.length === 0) {
    return null;
  }

  const remainingPercentage = 100 - totalAllocation;
  const isOverAllocated = totalAllocation > 100;
  const isUnderAllocated = totalAllocation < 100;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Allocate Your Time</h2>
        <div className="flex items-center gap-3">
          <label htmlFor="work-hours" className="text-sm font-medium text-muted-foreground">
            Work Hours:
          </label>
          <input
            id="work-hours"
            type="number"
            min="1"
            max="24"
            value={totalWorkHours}
            onChange={(e) => onWorkHoursChange(Number(e.target.value))}
            className="w-20 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-6">
        {selectedProjects.map((projectId) => {
          const project = projects.find((p) => p.id === projectId);
          const percentage = allocations[projectId] || 0;
          const hours = percentageToHours(percentage, totalWorkHours);

          if (!project) return null;

          const projectColor = getTodoistColor(project.color);

          return (
            <div key={projectId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: projectColor }}
                    aria-hidden="true"
                  />
                  <label htmlFor={`slider-${projectId}`} className="font-medium">
                    {project.name}
                  </label>
                </div>
                <div className="text-sm font-medium">
                  {percentage}% ({formatDuration(Math.round(hours * 60))})
                </div>
              </div>

              <div className="relative">
                <input
                  id={`slider-${projectId}`}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={percentage}
                  onChange={(e) => onAllocationChange(projectId, Number(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer slider-custom"
                  style={{
                    background: `linear-gradient(to right, ${projectColor} 0%, ${projectColor} ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`,
                  }}
                  aria-label={`Allocate percentage for ${project.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentage}
                  aria-valuetext={`${percentage} percent, ${formatDuration(Math.round(hours * 60))}`}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar and Summary */}
      <div className="mt-6 pt-6 border-t space-y-6">
        {/* Total Allocation */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium">Total Allocated</span>
            <span
              className={cn(
                'text-2xl font-bold',
                isValid && 'text-green-600 dark:text-green-400',
                isOverAllocated && 'text-destructive',
                isUnderAllocated && 'text-yellow-600 dark:text-yellow-400'
              )}
            >
              {totalAllocation}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                isValid && 'bg-green-600',
                isOverAllocated && 'bg-destructive',
                isUnderAllocated && 'bg-yellow-600'
              )}
              style={{ width: `${Math.min(totalAllocation, 100)}%` }}
            />
          </div>

          {/* Status Message */}
          <div className="mt-2">
            {isValid && (
              <p className="text-sm text-green-600 dark:text-green-400">✓ Perfect allocation!</p>
            )}
            {isOverAllocated && (
              <p className="text-sm text-destructive">
                ⚠️ Over allocated by {totalAllocation - 100}%
              </p>
            )}
            {isUnderAllocated && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ {remainingPercentage}% remaining
              </p>
            )}
          </div>
        </div>

        {/* Total Time */}
        <div className="flex justify-between text-sm font-medium">
          <span>Total Time</span>
          <span>{totalWorkHours} hours</span>
        </div>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={!isValid || isSaving}
          className={cn(
            'w-full min-h-[44px] rounded-lg font-medium transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            isValid && !isSaving
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-secondary text-muted-foreground cursor-not-allowed'
          )}
          aria-label={isValid ? 'Save daily allocation' : 'Fix allocation to save'}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              Saving...
            </span>
          ) : (
            'Save Daily Plan'
          )}
        </button>

        {!isValid && (
          <p className="text-xs text-muted-foreground text-center">
            Adjust allocations to equal 100%
          </p>
        )}

        {saveError && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
            <p className="text-sm text-destructive font-medium">Error saving plan</p>
            <p className="text-xs text-destructive/80 mt-1">{saveError}</p>
          </div>
        )}
      </div>
    </div>
  );
}
