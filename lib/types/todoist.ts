/**
 * Todoist API v2 TypeScript Types
 * Based on https://developer.todoist.com/rest/v2/
 */

export interface TodoistTask {
  id: string;
  project_id: string;
  section_id?: string;
  content: string;
  description: string;
  is_completed: boolean;
  labels: string[];
  parent_id?: string;
  order: number;
  priority: 1 | 2 | 3 | 4; // 1 = normal, 2 = high, 3 = higher, 4 = highest
  due?: {
    date: string;
    string: string;
    datetime?: string;
    timezone?: string;
    recurring: boolean;
  };
  url: string;
  comment_count: number;
  created_at: string;
  creator_id: string;
  assignee_id?: string;
  assigner_id?: string;
  duration?: {
    amount: number;
    unit: 'minute' | 'day';
  };
}

export interface TodoistProject {
  id: string;
  name: string;
  color: string;
  parent_id?: string;
  order: number;
  comment_count: number;
  is_shared: boolean;
  is_favorite: boolean;
  is_inbox_project: boolean;
  is_team_inbox: boolean;
  view_style: 'list' | 'board';
  url: string;
}

export interface TodoistSection {
  id: string;
  project_id: string;
  order: number;
  name: string;
}

export interface TodoistLabel {
  id: string;
  name: string;
  color: string;
  order: number;
  is_favorite: boolean;
}

export interface TodoistComment {
  id: string;
  task_id?: string;
  project_id?: string;
  content: string;
  posted_at: string;
  attachment?: {
    file_name: string;
    file_type: string;
    file_url: string;
    resource_type: string;
  };
}

export class TodoistAPIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'TodoistAPIError';
  }
}
