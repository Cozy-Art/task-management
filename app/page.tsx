'use client';

import Link from 'next/link';
import { useTodoistProjects } from '@/lib/hooks/useTodoistProjects';

export default function Home() {
  const { data: projects, isLoading, error } = useTodoistProjects();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          Priority & Time Management System
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Daily focus dashboard integrated with Todoist
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🔗 Todoist Connection Test</h2>

          {isLoading && (
            <div className="text-center p-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading your projects...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
              <h3 className="font-semibold text-destructive mb-2">❌ Connection Error</h3>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Failed to connect to Todoist'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure your <code className="bg-muted px-1 rounded">TODOIST_API_TOKEN</code> is
                set in <code className="bg-muted px-1 rounded">.env.local</code>
              </p>
            </div>
          )}

          {projects && (
            <div className="space-y-4">
              <div className="rounded-lg border border-green-500 bg-green-500/10 p-4">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                  ✅ Connected Successfully!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Found {projects.length} project{projects.length !== 1 ? 's' : ''} in your Todoist
                  account
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Your Projects:</h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <h4 className="font-semibold">{project.name}</h4>
                      </div>
                      {project.is_favorite && <span className="text-xs">⭐ Favorite</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/planning"
            className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <h2 className="text-xl font-semibold mb-2">📅 Daily Planning</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Select 1-6 projects and set percentage allocations for your day
            </p>
            <p className="text-sm text-primary font-medium">Start Planning →</p>
          </Link>

          <Link
            href="/kanban"
            className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <h2 className="text-xl font-semibold mb-2">📊 Multi-Row Kanban</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Visualize tasks across Putting Off, Strategy, and Timely columns
            </p>
            <p className="text-sm text-primary font-medium">View Board →</p>
          </Link>

          <div className="rounded-lg border bg-card p-6 shadow-sm opacity-60">
            <h2 className="text-xl font-semibold mb-2">⏱️ Time Tracking</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Track time spent on tasks with integrated timers
            </p>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          {projects && projects.length > 0 && (
            <Link
              href="/planning"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Get Started with Daily Planning →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
