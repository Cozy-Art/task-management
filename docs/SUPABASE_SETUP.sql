-- Supabase Database Setup for Priority & Time Management System
-- Run this script in your Supabase SQL Editor to create all required tables

-- ============================================================================
-- TABLE: daily_allocations
-- Stores daily project allocation plans
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,  -- For MVP, using simple text ID. In production, reference auth.users(id)
  date DATE NOT NULL,
  project_allocations JSONB NOT NULL,
  total_work_hours INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_allocations_user_date
  ON daily_allocations(user_id, date);

-- Add comment for documentation
COMMENT ON TABLE daily_allocations IS 'Stores daily project time allocation plans';
COMMENT ON COLUMN daily_allocations.project_allocations IS 'JSON array of {project_id, project_name, percentage, hours}';

-- ============================================================================
-- TABLE: time_entries
-- Tracks time spent on tasks (for future use)
-- ============================================================================

CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  todoist_task_id TEXT NOT NULL,
  todoist_project_id TEXT,
  project_name TEXT,
  task_name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  category TEXT CHECK (category IN ('putting-off', 'strategy', 'timely')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_time_entries_user_date
  ON time_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_time_entries_task
  ON time_entries(todoist_task_id);

COMMENT ON TABLE time_entries IS 'Tracks time spent on individual tasks';

-- ============================================================================
-- TABLE: daily_reflections
-- End-of-day reflections and summaries (for future use)
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  planned_vs_actual JSONB,
  unplanned_tasks JSONB,
  what_worked TEXT,
  what_didnt_work TEXT,
  notes_for_tomorrow TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_date
  ON daily_reflections(user_id, date);

COMMENT ON TABLE daily_reflections IS 'Daily reflection notes and planned vs actual comparisons';

-- ============================================================================
-- TABLE: allocation_templates
-- Saved allocation patterns (for future use)
-- ============================================================================

CREATE TABLE IF NOT EXISTS allocation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('preset', 'custom')),
  allocations JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_allocation_templates_user
  ON allocation_templates(user_id);

COMMENT ON TABLE allocation_templates IS 'Saved allocation templates for quick daily planning';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- For MVP, we're not enabling RLS since we're using simple user IDs
-- In production with proper auth, uncomment and configure these policies
-- ============================================================================

-- Enable RLS on tables (uncomment for production with auth)
-- ALTER TABLE daily_allocations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE allocation_templates ENABLE ROW LEVEL SECURITY;

-- Create policies (example for daily_allocations)
-- CREATE POLICY "Users can view own allocations"
--   ON daily_allocations FOR SELECT
--   USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can insert own allocations"
--   ON daily_allocations FOR INSERT
--   WITH CHECK (auth.uid()::text = user_id);

-- CREATE POLICY "Users can update own allocations"
--   ON daily_allocations FOR UPDATE
--   USING (auth.uid()::text = user_id);

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify tables were created successfully
-- ============================================================================

-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('daily_allocations', 'time_entries', 'daily_reflections', 'allocation_templates');

-- Check columns for daily_allocations
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'daily_allocations';

-- ============================================================================
-- TEST DATA (Optional - for testing)
-- Uncomment to insert sample data
-- ============================================================================

-- INSERT INTO daily_allocations (user_id, date, total_work_hours, project_allocations)
-- VALUES (
--   'demo-user',
--   CURRENT_DATE,
--   8,
--   '[
--     {"project_id": "123", "project_name": "Work Project", "percentage": 60, "hours": 4.8},
--     {"project_id": "456", "project_name": "Side Project", "percentage": 40, "hours": 3.2}
--   ]'::jsonb
-- );

-- Verify the test data
-- SELECT * FROM daily_allocations WHERE user_id = 'demo-user';
