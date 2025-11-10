/**
 * API Route: POST /api/todoist/create-task
 * Creates a new task in Todoist
 */

import { NextRequest, NextResponse } from 'next/server';
import { TodoistClient } from '@/lib/todoist/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      content,
      description,
      project_id,
      labels,
      priority,
      due_string,
      due_date,
      due_datetime,
    } = body;

    if (!content) {
      return NextResponse.json({ error: 'Task content is required' }, { status: 400 });
    }

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

    // Create the task
    const task = await client.createTask({
      content,
      description,
      project_id,
      labels,
      priority,
      due_string,
      due_date,
      due_datetime,
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Error creating task:', error);

    return NextResponse.json(
      {
        error: 'Failed to create task',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
