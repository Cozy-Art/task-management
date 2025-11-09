'use client';

/**
 * React Query hook to fetch Todoist projects
 */

import { useQuery } from '@tanstack/react-query';
import { TodoistProject } from '@/lib/types/todoist';

async function fetchProjects(): Promise<TodoistProject[]> {
  const response = await fetch('/api/todoist/projects');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch projects');
  }

  const data = await response.json();
  return data.projects;
}

export function useTodoistProjects() {
  return useQuery({
    queryKey: ['todoist', 'projects'],
    queryFn: fetchProjects,
    staleTime: 10 * 60 * 1000, // 10 minutes - projects don't change often
  });
}
