/**
 * API Route: GET /api/todoist/labels
 * Fetches all labels from Todoist
 */

import { NextResponse } from 'next/server';
import { TodoistClient } from '@/lib/todoist/client';

export async function GET() {
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

    // Fetch all labels
    const labels = await client.getLabels();

    return NextResponse.json({ labels });
  } catch (error) {
    console.error('Error fetching Todoist labels:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch labels',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
