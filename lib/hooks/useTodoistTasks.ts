'use client';

/**
 * React Query hook to fetch Todoist tasks
 */

import { useQuery } from '@tanstack/react-query';
import { TodoistTask } from '@/lib/types/todoist';

interface UseTasksOptions {
  projectId?: string;
  filter?: string;
  enabled?: boolean;
}

async function fetchTasks(projectId?: string, filter?: string): Promise<TodoistTask[]> {
  const params = new URLSearchParams();
  if (projectId) params.append('project_id', projectId);
  if (filter) params.append('filter', filter);

  const url = `/api/todoist/tasks${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch tasks');
  }

  const data = await response.json();
  return data.tasks;
}

export function useTodoistTasks(options: UseTasksOptions = {}) {
  const { projectId, filter, enabled = true } = options;

  return useQuery({
    queryKey: ['todoist', 'tasks', projectId, filter],
    queryFn: () => fetchTasks(projectId, filter),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
