/**
 * API Route: POST /api/time-entries
 * Saves a time entry to Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      todoist_task_id,
      todoist_project_id,
      project_name,
      task_name,
      duration_minutes,
      category,
      notes,
    } = body;

    // Validate input
    if (!date || !todoist_task_id || !task_name || !duration_minutes) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: date, todoist_task_id, task_name, duration_minutes',
        },
        { status: 400 }
      );
    }

    // For MVP: Use a simple user identifier
    const userId = 'demo-user'; // TODO: Replace with actual auth

    const supabase = await createClient();

    // Insert the time entry
    const { data, error } = await (supabase
      .from('time_entries') as any)
      .insert({
        user_id: userId,
        date,
        todoist_task_id,
        todoist_project_id,
        project_name,
        task_name,
        duration_minutes,
        category,
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save time entry', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving time entry:', error);
    return NextResponse.json(
      {
        error: 'Failed to save time entry',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
