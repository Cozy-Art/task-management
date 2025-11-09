/**
 * Application-specific TypeScript types
 */

export type TaskCategory = 'putting-off' | 'strategy' | 'timely';

export interface ProjectAllocation {
  project_id: string;
  project_name: string;
  percentage: number;
  hours: number;
}

export interface DailyAllocation {
  id: string;
  user_id: string;
  date: string;
  project_allocations: ProjectAllocation[];
  total_work_hours: number;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  date: string;
  todoist_task_id: string;
  todoist_project_id: string;
  project_name: string;
  task_name: string;
  duration_minutes: number;
  category: TaskCategory;
  notes?: string;
  created_at: string;
}

export interface DailyReflection {
  id: string;
  user_id: string;
  date: string;
  planned_vs_actual: {
    project_id: string;
    project_name: string;
    planned_hours: number;
    actual_hours: number;
  }[];
  unplanned_tasks: {
    task_name: string;
    duration_minutes: number;
  }[];
  what_worked?: string;
  what_didnt_work?: string;
  notes_for_tomorrow?: string;
  created_at: string;
}

export interface AllocationTemplate {
  id: string;
  user_id: string;
  template_name: string;
  template_type: 'preset' | 'custom';
  allocations: ProjectAllocation[];
  created_at: string;
}

export interface UserPreferences {
  id: string;
  todoist_user_id: string;
  default_work_hours: number;
  theme_preference: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
