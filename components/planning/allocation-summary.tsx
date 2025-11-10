/**
 * Allocation Summary Component
 * Shows summary of allocations and save button
 */

import { ProjectAllocation } from '@/lib/types/app';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AllocationSummaryProps {
  projectAllocations: ProjectAllocation[];
  totalAllocation: number;
  totalWorkHours: number;
  isValid: boolean;
  onSave: () => void;
  isSaving: boolean;
}

export function AllocationSummary({
  projectAllocations,
  totalAllocation,
  totalWorkHours,
  isValid,
  onSave,
  isSaving,
}: AllocationSummaryProps) {
  const remainingPercentage = 100 - totalAllocation;
  const isOverAllocated = totalAllocation > 100;
  const isUnderAllocated = totalAllocation < 100 && projectAllocations.length > 0;

  return (
    <div className="rounded-lg border bg-card p-6 sticky top-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>

      {/* Total Allocation */}
      <div className="mb-6">
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
          {projectAllocations.length === 0 && (
            <p className="text-sm text-muted-foreground">Select projects to begin</p>
          )}
        </div>
      </div>

      {/* Project Breakdown */}
      {projectAllocations.length > 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-medium">Breakdown</h3>
          {projectAllocations.map((allocation) => (
            <div key={allocation.project_id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="truncate pr-2">{allocation.project_name}</span>
                <span className="font-medium">{allocation.percentage}%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDuration(Math.round(allocation.hours * 60))} ({allocation.hours.toFixed(1)}{' '}
                hours)
              </div>
            </div>
          ))}

          <div className="pt-3 border-t">
            <div className="flex justify-between text-sm font-medium">
              <span>Total Time</span>
              <span>{totalWorkHours} hours</span>
            </div>
          </div>
        </div>
      )}

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

      {!isValid && projectAllocations.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Adjust allocations to equal 100%
        </p>
      )}
    </div>
  );
}
