/**
 * API Route: POST /api/allocations
 * Saves a daily allocation to Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, total_work_hours, project_allocations } = body;

    // Validate input
    if (!date || !total_work_hours || !project_allocations) {
      return NextResponse.json(
        { error: 'Missing required fields: date, total_work_hours, project_allocations' },
        { status: 400 }
      );
    }

    // For MVP: Use a simple user identifier
    // In production, this would come from authenticated session
    const userId = 'demo-user'; // TODO: Replace with actual auth

    const supabase = await createClient();

    // Upsert (insert or update) the allocation
    const { data, error } = await (supabase
      .from('daily_allocations') as any)
      .upsert(
        {
          user_id: userId,
          date,
          total_work_hours,
          project_allocations,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,date',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save allocation', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving allocation:', error);
    return NextResponse.json(
      {
        error: 'Failed to save allocation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/allocations
 * Fetches allocation for a specific date
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });
    }

    const userId = 'demo-user'; // TODO: Replace with actual auth

    const supabase = await createClient();

    const { data, error } = await (supabase
      .from('daily_allocations') as any)
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No allocation found for this date
        return NextResponse.json({ data: null });
      }
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch allocation', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching allocation:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch allocation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
