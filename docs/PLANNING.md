# Project Planning & TODO

This document tracks the feature backlog, current sprint tasks, and known issues.

---

## Current Sprint: MVP Phase 1 (Weeks 1-2)

### Completed ✅
- [x] Project initialization with Next.js, TypeScript, Tailwind
- [x] Environment variables structure
- [x] ESLint and Prettier configuration
- [x] Basic folder structure
- [x] Theme system foundation (light/dark mode CSS variables)

### In Progress 🔄
- [ ] shadcn/ui installation and configuration
- [ ] Documentation files creation

### TODO - Foundation (Week 1)
- [ ] Set up Supabase client
  - [ ] Install Supabase packages
  - [ ] Create client configuration
  - [ ] Set up type generation
  - [ ] Create database schema (see brief)
  - [ ] Enable Row Level Security (RLS) policies

- [ ] Create Todoist API client
  - [ ] Install HTTP client (fetch or axios)
  - [ ] Create TodoistClient class
  - [ ] Add TypeScript types for Todoist API
  - [ ] Implement basic methods (getTasks, getProjects, completeTask)
  - [ ] Add error handling and rate limiting awareness

- [ ] Theme Toggle Component
  - [ ] Create theme provider context
  - [ ] Build toggle button component (accessible)
  - [ ] Implement system preference detection
  - [ ] Add localStorage persistence
  - [ ] Test light/dark mode switching

- [ ] Authentication Flow
  - [ ] Supabase Auth setup
  - [ ] Login page UI
  - [ ] Todoist OAuth callback handler
  - [ ] Protected route middleware
  - [ ] User profile storage

### TODO - Core Features (Week 1-2)

**Daily Planning**
- [ ] Create daily allocation page/component
- [ ] Project selector (fetch from Todoist)
- [ ] Percentage allocation UI (sliders)
- [ ] Hours calculation display
- [ ] Save allocation to Supabase
- [ ] Load existing allocation for today

**Multi-Row Kanban Board**
- [ ] Install @dnd-kit/core for drag-and-drop
- [ ] Create KanbanBoard component
- [ ] Create ProjectRow component
- [ ] Create Column component (Putting Off, Strategy, Timely)
- [ ] Create TaskCard component
  - [ ] Display task name, priority, due date
  - [ ] Show Todoist project/label
  - [ ] Expandable for description/subtasks
- [ ] Implement drag-and-drop within columns
- [ ] Fetch tasks from Todoist
- [ ] Filter tasks by selected projects

**Time Tracking**
- [ ] Create useTimer hook
- [ ] Add timer UI to TaskCard
- [ ] Implement start/stop/pause functionality
- [ ] Only one timer active at a time
- [ ] Quick time entry buttons (15m, 30m, 1h, custom)
- [ ] Save time entries to Supabase
- [ ] Link time entries to tasks

**Task Completion**
- [ ] Mark task complete in UI
- [ ] Sync completion to Todoist
- [ ] Prompt for time logging on completion
- [ ] Update task list in real-time

**End-of-Day Summary**
- [ ] Create summary page/modal
- [ ] Display planned vs actual time per project
- [ ] Show completed vs planned tasks
- [ ] Calculate allocation accuracy
- [ ] Simple reflection form (what worked, what didn't)
- [ ] Save reflection to Supabase

### TODO - Nice to Have (Phase 2)
- [ ] Drag tasks between columns (updates labels in Todoist)
- [ ] Log partial time on incomplete tasks
- [ ] Quick add new tasks (inline + keyboard shortcut)
- [ ] Floating timer widget
- [ ] Weekly planning view
- [ ] Allocation templates
- [ ] Basic analytics dashboard

### TODO - Future (Phase 3+)
- [ ] Advanced analytics with Recharts
- [ ] Monthly trend visualizations
- [ ] Custom theme colors
- [ ] Comprehensive keyboard shortcuts
- [ ] PWA setup for mobile
- [ ] Calendar integration
- [ ] Collaboration features

---

## Technical Debt

None yet - project just started!

---

## Known Issues

None yet.

---

## Design Decisions Needed

### 1. Todoist Label Strategy
**Status:** Pending user input

How should we categorize tasks into columns?
- **Option A:** Manual labels (`@putting-off`, `@strategy`, `@timely`)
- **Option B:** Auto-categorize using priority + due date
- **Option C:** Hybrid (auto-assign, allow override)

**Recommendation:** Start with Option A for MVP

### 2. Timer Data Storage
**Status:** Pending user input

Where should time tracking data be stored?
- **Option A:** Todoist comments (sync back)
- **Option B:** Supabase only (our database)
- **Option C:** Both (dual write)

**Recommendation:** Option B for MVP simplicity

### 3. Real-time Sync
**Status:** Pending user input

How should we sync with Todoist?
- **Option A:** Polling (refetch every N minutes)
- **Option B:** Webhooks (Todoist pushes changes)
- **Option C:** Manual refresh button

**Recommendation:** Option A (polling every 5 min) for MVP

---

## Development Workflow

1. Check this PLANNING.md for current sprint tasks
2. Pick a task and move to "In Progress"
3. Reference project brief for specific requirements
4. Implement with tests
5. Update CLAUDE.md with decisions made
6. Mark task complete
7. Commit with descriptive message

---

## Testing Checklist

For each feature:
- [ ] Works on mobile (375px width)
- [ ] Works on tablet (768px width)
- [ ] Works on desktop (1440px width)
- [ ] Light mode looks good
- [ ] Dark mode looks good
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Passes accessibility audit

---

## Deployment Checklist

Before deploying to Vercel:
- [ ] All environment variables set in Vercel dashboard
- [ ] Supabase RLS policies enabled
- [ ] OAuth redirect URIs updated for production
- [ ] HTTPS enforced
- [ ] Lighthouse scores checked (Performance ≥90, Accessibility =100)
- [ ] Mobile devices tested (iOS Safari, Android Chrome)
- [ ] Error boundaries added
- [ ] Loading states implemented
- [ ] Empty states designed
