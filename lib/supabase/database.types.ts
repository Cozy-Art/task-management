/**
 * Database TypeScript Types
 * Auto-generated types for Supabase tables
 * Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID` to regenerate
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          todoist_access_token: string | null;
          todoist_user_id: string | null;
          default_work_hours: number;
          theme_preference: 'light' | 'dark' | 'system';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          todoist_access_token?: string | null;
          todoist_user_id?: string | null;
          default_work_hours?: number;
          theme_preference?: 'light' | 'dark' | 'system';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          todoist_access_token?: string | null;
          todoist_user_id?: string | null;
          default_work_hours?: number;
          theme_preference?: 'light' | 'dark' | 'system';
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_allocations: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          project_allocations: Json;
          total_work_hours: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          project_allocations: Json;
          total_work_hours: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          project_allocations?: Json;
          total_work_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      time_entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          todoist_task_id: string;
          todoist_project_id: string | null;
          project_name: string | null;
          task_name: string;
          duration_minutes: number;
          category: 'putting-off' | 'strategy' | 'timely' | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          todoist_task_id: string;
          todoist_project_id?: string | null;
          project_name?: string | null;
          task_name: string;
          duration_minutes: number;
          category?: 'putting-off' | 'strategy' | 'timely' | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          todoist_task_id?: string;
          todoist_project_id?: string | null;
          project_name?: string | null;
          task_name?: string;
          duration_minutes?: number;
          category?: 'putting-off' | 'strategy' | 'timely' | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      daily_reflections: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          planned_vs_actual: Json | null;
          unplanned_tasks: Json | null;
          what_worked: string | null;
          what_didnt_work: string | null;
          notes_for_tomorrow: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          planned_vs_actual?: Json | null;
          unplanned_tasks?: Json | null;
          what_worked?: string | null;
          what_didnt_work?: string | null;
          notes_for_tomorrow?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          planned_vs_actual?: Json | null;
          unplanned_tasks?: Json | null;
          what_worked?: string | null;
          what_didnt_work?: string | null;
          notes_for_tomorrow?: string | null;
          created_at?: string;
        };
      };
      allocation_templates: {
        Row: {
          id: string;
          user_id: string;
          template_name: string;
          template_type: 'preset' | 'custom';
          allocations: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_name: string;
          template_type: 'preset' | 'custom';
          allocations: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_name?: string;
          template_type?: 'preset' | 'custom';
          allocations?: Json;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
