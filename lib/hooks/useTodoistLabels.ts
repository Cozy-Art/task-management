'use client';

/**
 * React Query hook to fetch Todoist labels
 */

import { useQuery } from '@tanstack/react-query';
import { TodoistLabel } from '@/lib/types/todoist';

async function fetchLabels(): Promise<TodoistLabel[]> {
  const response = await fetch('/api/todoist/labels');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch labels');
  }

  const data = await response.json();
  return data.labels;
}

export function useTodoistLabels() {
  return useQuery({
    queryKey: ['todoist', 'labels'],
    queryFn: fetchLabels,
    staleTime: 10 * 60 * 1000, // 10 minutes - labels don't change often
  });
}
