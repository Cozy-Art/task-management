/**
 * Todoist API Client
 * Implements REST API v2 calls with TypeScript
 */

import {
  TodoistTask,
  TodoistProject,
  TodoistSection,
  TodoistLabel,
  TodoistComment,
  TodoistAPIError,
} from '@/lib/types/todoist';

export class TodoistClient {
  private accessToken: string;
  private baseURL = 'https://api.todoist.com/rest/v2';

  constructor(accessToken: string) {
    if (!accessToken) {
      throw new Error('Todoist access token is required');
    }
    this.accessToken = accessToken;
  }

  /**
   * Make a request to the Todoist API
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new TodoistAPIError(response.status, errorText || response.statusText);
      }

      // For 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof TodoistAPIError) {
        throw error;
      }
      throw new Error(`Todoist API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================== TASKS ====================

  /**
   * Get all active tasks
   */
  async getTasks(params?: {
    project_id?: string;
    section_id?: string;
    label?: string;
    filter?: string;
    lang?: string;
  }): Promise<TodoistTask[]> {
    const searchParams = new URLSearchParams();
    if (params?.project_id) searchParams.append('project_id', params.project_id);
    if (params?.section_id) searchParams.append('section_id', params.section_id);
    if (params?.label) searchParams.append('label', params.label);
    if (params?.filter) searchParams.append('filter', params.filter);
    if (params?.lang) searchParams.append('lang', params.lang);

    const query = searchParams.toString();
    return this.request<TodoistTask[]>(`/tasks${query ? `?${query}` : ''}`);
  }

  /**
   * Get a specific task by ID
   */
  async getTask(taskId: string): Promise<TodoistTask> {
    return this.request<TodoistTask>(`/tasks/${taskId}`);
  }

  /**
   * Create a new task
   */
  async createTask(data: {
    content: string;
    description?: string;
    project_id?: string;
    section_id?: string;
    parent_id?: string;
    order?: number;
    labels?: string[];
    priority?: 1 | 2 | 3 | 4;
    due_string?: string;
    due_date?: string;
    due_datetime?: string;
    due_lang?: string;
    assignee_id?: string;
  }): Promise<TodoistTask> {
    return this.request<TodoistTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a task
   */
  async updateTask(
    taskId: string,
    data: Partial<{
      content: string;
      description: string;
      labels: string[];
      priority: 1 | 2 | 3 | 4;
      due_string: string;
      due_date: string;
      due_datetime: string;
    }>
  ): Promise<TodoistTask> {
    return this.request<TodoistTask>(`/tasks/${taskId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Close (complete) a task
   */
  async closeTask(taskId: string): Promise<void> {
    return this.request<void>(`/tasks/${taskId}/close`, {
      method: 'POST',
    });
  }

  /**
   * Reopen a completed task
   */
  async reopenTask(taskId: string): Promise<void> {
    return this.request<void>(`/tasks/${taskId}/reopen`, {
      method: 'POST',
    });
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    return this.request<void>(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // ==================== PROJECTS ====================

  /**
   * Get all projects
   */
  async getProjects(): Promise<TodoistProject[]> {
    return this.request<TodoistProject[]>('/projects');
  }

  /**
   * Get a specific project
   */
  async getProject(projectId: string): Promise<TodoistProject> {
    return this.request<TodoistProject>(`/projects/${projectId}`);
  }

  /**
   * Create a new project
   */
  async createProject(data: {
    name: string;
    parent_id?: string;
    color?: string;
    is_favorite?: boolean;
    view_style?: 'list' | 'board';
  }): Promise<TodoistProject> {
    return this.request<TodoistProject>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a project
   */
  async updateProject(
    projectId: string,
    data: Partial<{
      name: string;
      color: string;
      is_favorite: boolean;
      view_style: 'list' | 'board';
    }>
  ): Promise<TodoistProject> {
    return this.request<TodoistProject>(`/projects/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    return this.request<void>(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // ==================== SECTIONS ====================

  /**
   * Get all sections for a project
   */
  async getSections(projectId?: string): Promise<TodoistSection[]> {
    const query = projectId ? `?project_id=${projectId}` : '';
    return this.request<TodoistSection[]>(`/sections${query}`);
  }

  /**
   * Get a specific section
   */
  async getSection(sectionId: string): Promise<TodoistSection> {
    return this.request<TodoistSection>(`/sections/${sectionId}`);
  }

  // ==================== LABELS ====================

  /**
   * Get all labels
   */
  async getLabels(): Promise<TodoistLabel[]> {
    return this.request<TodoistLabel[]>('/labels');
  }

  /**
   * Get a specific label
   */
  async getLabel(labelId: string): Promise<TodoistLabel> {
    return this.request<TodoistLabel>(`/labels/${labelId}`);
  }

  // ==================== COMMENTS ====================

  /**
   * Get all comments for a task
   */
  async getTaskComments(taskId: string): Promise<TodoistComment[]> {
    return this.request<TodoistComment[]>(`/comments?task_id=${taskId}`);
  }

  /**
   * Get all comments for a project
   */
  async getProjectComments(projectId: string): Promise<TodoistComment[]> {
    return this.request<TodoistComment[]>(`/comments?project_id=${projectId}`);
  }

  /**
   * Create a comment
   */
  async createComment(data: {
    task_id?: string;
    project_id?: string;
    content: string;
  }): Promise<TodoistComment> {
    return this.request<TodoistComment>('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
