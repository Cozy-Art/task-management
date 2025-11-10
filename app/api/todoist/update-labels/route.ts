/**
 * API Route: Update Todoist Task Labels
 * Updates labels on a Todoist task (used for moving between kanban columns)
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/todoist/update-labels
 * Update task labels to reflect kanban column
 */
export async function POST(request: NextRequest) {
  try {
    const { taskId, labels } = await request.json();

    if (!taskId || !Array.isArray(labels)) {
      return NextResponse.json(
        { error: 'Missing required fields: taskId, labels (array)' },
        { status: 400 }
      );
    }

    const todoistToken = process.env.TODOIST_API_TOKEN;

    if (!todoistToken) {
      return NextResponse.json(
        { error: 'Todoist API token not configured' },
        { status: 500 }
      );
    }

    // Update task in Todoist
    const response = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${todoistToken}`,
      },
      body: JSON.stringify({
        labels,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Todoist API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Todoist API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const updatedTask = await response.json();

    return NextResponse.json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
