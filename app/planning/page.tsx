'use client';

/**
 * Daily Planning Page
 * Select 1-6 projects and set percentage allocations for the day
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTodoistProjects } from '@/lib/hooks/useTodoistProjects';
import { ProjectSelector } from '@/components/planning/project-selector';
import { AllocationSliders } from '@/components/planning/allocation-sliders';
import { ProjectAllocation } from '@/lib/types/app';
import { getToday } from '@/lib/utils';

export default function PlanningPage() {
  const router = useRouter();
  const { data: projects, isLoading, error } = useTodoistProjects();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [totalWorkHours, setTotalWorkHours] = useState(8);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleProjectToggle = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      // Remove project
      const newSelected = selectedProjects.filter((id) => id !== projectId);
      setSelectedProjects(newSelected);

      // Remove allocation
      const newAllocations = { ...allocations };
      delete newAllocations[projectId];
      setAllocations(newAllocations);
    } else {
      // Add project (max 6)
      if (selectedProjects.length < 6) {
        setSelectedProjects([...selectedProjects, projectId]);
        // Set default allocation
        setAllocations({ ...allocations, [projectId]: 0 });
      }
    }
  };

  const handleAllocationChange = (projectId: string, percentage: number) => {
    setAllocations({ ...allocations, [projectId]: percentage });
  };

  const getTotalAllocation = () => {
    return Object.values(allocations).reduce((sum, val) => sum + val, 0);
  };

  const getProjectAllocations = (): ProjectAllocation[] => {
    if (!projects) return [];

    return selectedProjects.map((projectId) => {
      const project = projects.find((p) => p.id === projectId);
      const percentage = allocations[projectId] || 0;
      const hours = (percentage / 100) * totalWorkHours;

      return {
        project_id: projectId,
        project_name: project?.name || 'Unknown',
        percentage,
        hours: Number(hours.toFixed(2)),
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    const allocationData = {
      date: getToday(),
      total_work_hours: totalWorkHours,
      project_allocations: getProjectAllocations(),
    };

    try {
      const response = await fetch('/api/allocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allocationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save allocation');
      }

      // Success! Navigate to Kanban board
      router.push('/kanban');
    } catch (error) {
      console.error('Error saving allocation:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save allocation');
      setIsSaving(false);
    }
  };

  const totalAllocation = getTotalAllocation();
  const isValid = totalAllocation === 100 && selectedProjects.length > 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 max-w-md">
          <h3 className="font-semibold text-destructive mb-2">Error Loading Projects</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load projects'}
          </p>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No Projects Found</h2>
          <p className="text-muted-foreground">
            You don't have any projects in Todoist yet. Create some projects first!
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-4xl font-bold mb-2">📅 Daily Planning</h1>
              <p className="text-muted-foreground">
                Select 1-6 projects and allocate your time for today
              </p>
            </div>
            <Link
              href="/kanban"
              className="hidden md:inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              📊 Kanban Board
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* Allocation Sliders with Summary */}
          {selectedProjects.length > 0 && (
            <AllocationSliders
              projects={projects}
              selectedProjects={selectedProjects}
              allocations={allocations}
              onAllocationChange={handleAllocationChange}
              totalWorkHours={totalWorkHours}
              onWorkHoursChange={setTotalWorkHours}
              totalAllocation={totalAllocation}
              isValid={isValid}
              onSave={handleSave}
              isSaving={isSaving}
              saveError={saveError}
            />
          )}

          {/* Project Selector */}
          <ProjectSelector
            projects={projects}
            selectedProjects={selectedProjects}
            onProjectToggle={handleProjectToggle}
            maxProjects={6}
          />
        </div>
      </div>
    </main>
  );
}
