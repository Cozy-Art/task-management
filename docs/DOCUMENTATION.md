# Technical Documentation

This document provides technical details for developers working on the Priority & Time Management System.

---

## Architecture Overview

### Tech Stack

- **Frontend Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom theme system
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + Todoist OAuth
- **State Management:** React Context + TanStack Query (React Query)
- **Drag & Drop:** @dnd-kit/core
- **Charts:** Recharts (lazy loaded)

### Project Structure

```
priority-management/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes group
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles + theme
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── kanban/            # Kanban board components
│   ├── timer/             # Timer components
│   ├── analytics/         # Chart components
│   ├── planning/          # Allocation planning UI
│   └── shared/            # Shared components
├── lib/
│   ├── supabase/          # Supabase client & queries
│   ├── todoist/           # Todoist API client
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── docs/                  # Documentation
├── public/                # Static assets
└── [config files]         # tsconfig, tailwind, etc.
```

---

## Environment Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Todoist account with API access

### Installation

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Fill in `.env.local` with your credentials

### Running Locally

```bash
# Development server (with hot reload)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Production build
npm run build
npm start
```

---

## Theme System

### Overview

The app uses class-based dark mode with CSS variables for all colors.

### Implementation

1. **CSS Variables** (`app/globals.css`):
   - Defined in `:root` for light mode
   - Defined in `.dark` for dark mode
   - Using HSL color format for easier manipulation

2. **Tailwind Configuration** (`tailwind.config.ts`):
   - `darkMode: 'class'` enables class-based switching
   - Custom colors reference CSS variables
   - Semantic color tokens (background, foreground, primary, etc.)

3. **Usage in Components**:
   ```tsx
   <div className="bg-background text-foreground">
     <button className="bg-primary text-primary-foreground">
       Click me
     </button>
   </div>
   ```

4. **Theme Toggle**:
   - Detect system preference: `window.matchMedia('(prefers-color-scheme: dark)')`
   - Store user preference in localStorage
   - Apply by adding/removing `dark` class to `<html>` element

---

## Database Schema (Supabase)

### Tables

#### users
Stores user preferences and Todoist tokens.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  todoist_access_token TEXT ENCRYPTED,
  todoist_user_id TEXT,
  default_work_hours INTEGER DEFAULT 8,
  theme_preference TEXT CHECK (theme_preference IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### daily_allocations
Stores daily project allocation plans.

```sql
CREATE TABLE daily_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  project_allocations JSONB NOT NULL,
  -- Example: [{"project_id": "123", "project_name": "Work", "percentage": 60, "hours": 4.8}]
  total_work_hours INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### time_entries
Tracks time spent on tasks.

```sql
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

CREATE INDEX idx_time_entries_user_date ON time_entries(user_id, date);
CREATE INDEX idx_time_entries_task ON time_entries(todoist_task_id);
```

#### daily_reflections
End-of-day reflections and summaries.

```sql
CREATE TABLE daily_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  planned_vs_actual JSONB,
  unplanned_tasks JSONB,
  what_worked TEXT,
  what_didnt_work TEXT,
  notes_for_tomorrow TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### allocation_templates
Saved allocation patterns.

```sql
CREATE TABLE allocation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('preset', 'custom')),
  allocations JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

Enable RLS on all tables and create policies:

```sql
-- Example policy for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

---

## Todoist API Integration

### API Client Structure

Location: `lib/todoist/client.ts`

```typescript
export class TodoistClient {
  private accessToken: string;
  private baseURL = 'https://api.todoist.com/rest/v2';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new TodoistAPIError(response.status, await response.text());
    }

    return response.json();
  }

  async getTasks(projectId?: string): Promise<Task[]> {
    const params = projectId ? `?project_id=${projectId}` : '';
    return this.request<Task[]>(`/tasks${params}`);
  }

  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async completeTask(taskId: string): Promise<void> {
    await this.request(`/tasks/${taskId}/close`, { method: 'POST' });
  }

  // ... more methods
}
```

### TypeScript Types

Location: `lib/todoist/types.ts`

```typescript
export interface Task {
  id: string;
  project_id: string;
  content: string;
  description: string;
  priority: 1 | 2 | 3 | 4; // P1-P4
  due?: {
    date: string;
    datetime?: string;
    string: string;
    timezone?: string;
  };
  labels: string[];
  // ... more fields
}

export interface Project {
  id: string;
  name: string;
  color: string;
  parent_id?: string;
  order: number;
  // ... more fields
}
```

### Rate Limiting

Todoist allows 450 requests per 15 minutes. Implement:
- Request queuing if needed
- Exponential backoff on 429 errors
- Caching with React Query

---

## Custom Hooks

### useTimer

Location: `lib/hooks/useTimer.ts`

```typescript
export function useTimer(taskId: string) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return {
    elapsed,
    isRunning,
    start: () => setIsRunning(true),
    pause: () => setIsRunning(false),
    reset: () => {
      setIsRunning(false);
      setElapsed(0);
    },
  };
}
```

### useTodoistTasks

Location: `lib/hooks/useTodoistTasks.ts`

```typescript
export function useTodoistTasks(projectIds: string[]) {
  return useQuery({
    queryKey: ['todoist-tasks', projectIds],
    queryFn: async () => {
      const client = new TodoistClient(accessToken);
      const tasks = await Promise.all(
        projectIds.map(id => client.getTasks(id))
      );
      return tasks.flat();
    },
    enabled: !!projectIds.length && !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

1. **Semantic HTML**
   - Use proper elements: `<button>`, `<nav>`, `<main>`, `<article>`, etc.
   - Avoid `<div>` for interactive elements

2. **ARIA Labels**
   - Add `aria-label` for icon-only buttons
   - Use `aria-describedby` for additional context
   - Set `aria-pressed` for toggle buttons

3. **Keyboard Navigation**
   - All interactive elements must be keyboard accessible
   - Implement focus trapping in modals
   - Use arrow keys for list navigation (optional but nice)

4. **Color Contrast**
   - Text: ≥ 4.5:1 ratio
   - UI components: ≥ 3:1 ratio
   - Don't rely on color alone (use icons + text)

5. **Focus Indicators**
   - Visible focus styles on all interactive elements
   - Global style in `globals.css`: `*:focus-visible`

6. **Screen Readers**
   - Use `.sr-only` class for screen-reader-only text
   - Announce dynamic changes (timer updates, task completions)

### Example Accessible Component

```tsx
<button
  aria-label={isRunning ? `Pause timer at ${formatTime(elapsed)}` : 'Start timer'}
  aria-pressed={isRunning}
  className="min-h-[44px] min-w-[44px] ..."
  onClick={toggleTimer}
>
  {isRunning ? '⏸️' : '▶️'}
  <span className="sr-only">
    {isRunning ? 'Timer running' : 'Timer stopped'}
  </span>
</button>
```

---

## Mobile-First Development

### Breakpoints (Tailwind defaults)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile Design Principles

1. **Start Mobile (375px)**
   ```tsx
   <div className="flex flex-col md:flex-row">
     {/* Stacks on mobile, horizontal on tablet+ */}
   </div>
   ```

2. **Touch Targets**
   - Minimum 44x44px for all interactive elements
   ```tsx
   <button className="min-h-[44px] min-w-[44px] p-3">
     Click me
   </button>
   ```

3. **Thumb-Friendly Navigation**
   - Use bottom navigation bar on mobile
   - Place important actions within thumb reach

4. **Performance**
   - Lazy load heavy components (Recharts)
   - Use Next.js `<Image>` for optimized images
   - Code split with `dynamic` imports

---

## Testing

### Unit Tests (Future)

- Jest + React Testing Library
- Test utility functions
- Test custom hooks

### Integration Tests (Future)

- Test API routes
- Test database queries

### E2E Tests (Future)

- Playwright or Cypress
- Critical user flows:
  - Login
  - Create daily allocation
  - Start timer and complete task
  - View end-of-day summary

---

## Deployment (Vercel)

### Prerequisites

1. Push code to GitHub
2. Create Vercel account
3. Link repository

### Environment Variables

Set in Vercel dashboard:
- All variables from `.env.local.example`
- Update `NEXT_PUBLIC_APP_URL` to production URL
- Update `NEXT_PUBLIC_TODOIST_REDIRECT_URI` to production callback

### Build Settings

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

### Post-Deployment

- Test OAuth flow with production URLs
- Verify Supabase connection
- Check Lighthouse scores
- Test on real mobile devices

---

## Performance Optimization

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics/Dashboard'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/avatar.png"
  alt="User avatar"
  width={40}
  height={40}
  className="rounded-full"
/>
```

### React Query Caching

```typescript
const { data: tasks } = useQuery({
  queryKey: ['tasks', projectId],
  queryFn: () => todoist.getTasks(projectId),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  refetchOnWindowFocus: true,
});
```

---

## Troubleshooting

### Common Issues

1. **TypeScript errors after installing packages**
   - Run `npm run type-check` to see all errors
   - Restart TypeScript server in VS Code

2. **Tailwind classes not applying**
   - Check `tailwind.config.ts` content paths
   - Restart dev server

3. **Supabase connection fails**
   - Verify environment variables
   - Check RLS policies are enabled
   - Ensure anon key has correct permissions

4. **Todoist API 401 error**
   - Token may be expired (OAuth: refresh token)
   - Personal token: generate new one

---

## Contributing

### Code Style

- Follow Prettier formatting (auto-format on save)
- Use TypeScript strict mode (no `any` types)
- Write meaningful variable names
- Add JSDoc comments for complex functions

### Git Workflow

1. Create feature branch
2. Make small, focused commits
3. Write descriptive commit messages
4. Push and create PR
5. Address review feedback

### Commit Message Format

```
<type>: <description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: add timer component to task cards

Implements start/stop/pause functionality with visual feedback.
Only one timer can be active at a time.
```

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Todoist REST API](https://developer.todoist.com/rest/v2/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
