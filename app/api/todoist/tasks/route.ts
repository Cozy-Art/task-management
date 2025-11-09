/**
 * API Route: GET /api/todoist/tasks
 * Fetches Todoist tasks, optionally filtered by project
 * Query params:
 *   - project_id: Filter tasks by project ID
 *   - filter: Todoist filter string (e.g., "today", "overdue")
 */

import { NextRequest, NextResponse } from 'next/server';
import { TodoistClient } from '@/lib/todoist/client';

export async function GET(request: NextRequest) {
  try {
    // Get API token from environment variable
    const apiToken = process.env.TODOIST_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { error: 'Todoist API token not configured' },
        { status: 500 }
      );
    }

    // Create Todoist client
    const client = new TodoistClient(apiToken);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('project_id') || undefined;
    const filter = searchParams.get('filter') || undefined;

    // Fetch tasks
    const tasks = await client.getTasks({
      project_id: projectId,
      filter: filter,
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching Todoist tasks:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch tasks',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
