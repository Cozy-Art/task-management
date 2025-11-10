import { NextRequest, NextResponse } from 'next/server';
import { TodoistClient } from '@/lib/todoist/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, content, description, labels, priority, due_string } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const apiToken = process.env.TODOIST_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { error: 'Todoist API token not configured' },
        { status: 500 }
      );
    }

    const client = new TodoistClient(apiToken);

    // Build update data - only include fields that are provided
    const updateData: Partial<{
      content: string;
      description: string;
      labels: string[];
      priority: 1 | 2 | 3 | 4;
      due_string: string;
    }> = {};

    if (content !== undefined) updateData.content = content;
    if (description !== undefined) updateData.description = description;
    if (labels !== undefined) updateData.labels = labels;
    if (priority !== undefined) updateData.priority = priority;
    if (due_string !== undefined) updateData.due_string = due_string;

    const task = await client.updateTask(taskId, updateData);

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update task' },
      { status: 500 }
    );
  }
}
