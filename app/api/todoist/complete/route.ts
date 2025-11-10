/**
 * API Route: POST /api/todoist/complete
 * Completes a task in Todoist
 */

import { NextRequest, NextResponse } from 'next/server';
import { TodoistClient } from '@/lib/todoist/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
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

    // Complete the task
    await client.closeTask(taskId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing task:', error);

    return NextResponse.json(
      {
        error: 'Failed to complete task',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
