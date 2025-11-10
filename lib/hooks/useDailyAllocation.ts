/**
 * Hook to fetch today's daily allocation
 */

import { useQuery } from '@tanstack/react-query';
import { getToday } from '@/lib/utils';

interface ProjectAllocation {
  project_id: string;
  project_name: string;
  percentage: number;
  hours: number;
}

interface DailyAllocation {
  id: string;
  user_id: string;
  date: string;
  project_allocations: ProjectAllocation[];
  total_work_hours: number;
  created_at: string;
  updated_at: string;
}

export function useDailyAllocation(userId: string = 'demo-user') {
  return useQuery<DailyAllocation | null>({
    queryKey: ['daily-allocation', userId, getToday()],
    queryFn: async () => {
      const response = await fetch(
        `/api/allocations?user_id=${userId}&date=${getToday()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch daily allocation');
      }

      const result = await response.json();
      return result.data || null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
