/**
 * Allocation Sliders Component
 * Allows users to set percentage allocations for selected projects
 */

import { TodoistProject } from '@/lib/types/todoist';
import { percentageToHours, formatDuration } from '@/lib/utils';

interface AllocationSlidersProps {
  projects: TodoistProject[];
  selectedProjects: string[];
  allocations: Record<string, number>;
  onAllocationChange: (projectId: string, percentage: number) => void;
  totalWorkHours: number;
}

export function AllocationSliders({
  projects,
  selectedProjects,
  allocations,
  onAllocationChange,
  totalWorkHours,
}: AllocationSlidersProps) {
  if (selectedProjects.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-xl font-semibold mb-4">Allocate Your Time</h2>

      <div className="space-y-6">
        {selectedProjects.map((projectId) => {
          const project = projects.find((p) => p.id === projectId);
          const percentage = allocations[projectId] || 0;
          const hours = percentageToHours(percentage, totalWorkHours);

          if (!project) return null;

          return (
            <div key={projectId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
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
                    background: `linear-gradient(to right, ${project.color} 0%, ${project.color} ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`,
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

      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          💡 Tip: Drag the sliders to allocate your time. Total should equal 100%.
        </p>
      </div>
    </div>
  );
}
