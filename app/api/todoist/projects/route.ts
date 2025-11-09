/**
 * API Route: GET /api/todoist/projects
 * Fetches all Todoist projects for the authenticated user
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

    // Fetch all projects
    const projects = await client.getProjects();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching Todoist projects:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
