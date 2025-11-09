export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          Priority & Time Management System
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Daily focus dashboard integrated with Todoist
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Daily Planning</h2>
            <p className="text-sm text-muted-foreground">
              Select 1-6 projects and set percentage allocations for your day
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Multi-Row Kanban</h2>
            <p className="text-sm text-muted-foreground">
              Visualize tasks across Putting Off, Strategy, and Timely columns
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Time Tracking</h2>
            <p className="text-sm text-muted-foreground">
              Track time spent on tasks with integrated timers
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Setup in progress... Authentication and Todoist integration coming next!</p>
        </div>
      </div>
    </main>
  );
}
