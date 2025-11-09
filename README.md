# Priority & Time Management System

A daily focus dashboard integrated with Todoist to help manage time allocation across multiple projects. Plan your day with percentage allocations, visualize priorities in a multi-row Kanban board, track time spent, and reflect on productivity.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14%2B-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![License](https://img.shields.io/badge/license-ISC-green)

---

## Features

### ✅ Daily Planning
- Select 1-6 projects for the day
- Set percentage allocation per project
- Calculate hours based on your work day length
- Save and edit allocation plans

### 📊 Multi-Row Kanban Board
- One row per selected project
- Three columns: "Putting Off" / "Strategy" / "Timely"
- Drag-and-drop task management
- Visual progress tracking

### ⏱️ Time Tracking
- Click-to-start timers on task cards
- Log time on completion
- Manual time entry for retroactive logging
- Sync time data to Todoist

### 📈 Analytics & Reflection
- End-of-day summaries
- Planned vs. actual time comparison
- Weekly and monthly trend reports
- Task completion tracking

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with light/dark mode
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + Todoist OAuth
- **State Management:** React Query (TanStack Query)
- **Drag & Drop:** @dnd-kit/core
- **Charts:** Recharts

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Todoist account
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Cozy-Art/priority-management.git
   cd priority-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure your `.env.local` file**

   You'll need to fill in:

   **Todoist API Token (for quick development):**
   - Go to [Todoist Integrations](https://todoist.com/prefs/integrations)
   - Scroll to "Developer" section
   - Copy your API token
   - Add to `.env.local`:
     ```
     TODOIST_API_TOKEN=your-api-token-here
     ```

   **Supabase (for database):**
   - Create a project at [Supabase](https://app.supabase.com)
   - Go to Settings → API
   - Copy Project URL and anon/public key
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

   **Todoist OAuth (optional, for production):**
   - Register app at [Todoist App Console](https://developer.todoist.com/appconsole.html)
   - Add client ID and secret to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

---

## Project Structure

```
priority-management/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main app pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles + theme
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── kanban/            # Kanban board components
│   ├── timer/             # Timer components
│   └── shared/            # Shared components
├── lib/
│   ├── supabase/          # Database client
│   ├── todoist/           # Todoist API client
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript types
├── docs/                  # Documentation
│   ├── CLAUDE.md          # Development log
│   ├── PLANNING.md        # Feature roadmap
│   └── DOCUMENTATION.md   # Technical docs
└── public/                # Static assets
```

---

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
npm run type-check  # TypeScript type checking
```

---

## Environment Variables

See `.env.local.example` for all required variables.

**Important:** Never commit your `.env.local` file! It's already in `.gitignore` to prevent accidental commits of your API keys.

---

## Development Roadmap

### MVP Phase 1 (Weeks 1-2) 🔄 In Progress
- [x] Project setup with Next.js, TypeScript, Tailwind
- [x] Environment variables and configuration
- [x] Theme system (light/dark mode)
- [ ] Todoist integration
- [ ] Daily allocation planning
- [ ] Multi-row Kanban board
- [ ] Basic time tracking
- [ ] Task completion sync
- [ ] End-of-day summary

### Phase 2 (Weeks 3-4)
- [ ] Drag tasks between columns
- [ ] Weekly planning view
- [ ] Allocation templates
- [ ] Basic analytics dashboard
- [ ] Floating timer widget

### Phase 3 (Future)
- [ ] Advanced analytics with Recharts
- [ ] Monthly trend reports
- [ ] Keyboard shortcuts
- [ ] PWA for mobile
- [ ] Calendar integration

See [docs/PLANNING.md](docs/PLANNING.md) for detailed TODO list.

---

## Documentation

- **[CLAUDE.md](docs/CLAUDE.md)** - Development log and decisions
- **[PLANNING.md](docs/PLANNING.md)** - Feature backlog and TODO
- **[DOCUMENTATION.md](docs/DOCUMENTATION.md)** - Technical documentation
- **[Todoist API Docs](https://developer.todoist.com/rest/v2/)**

---

## Accessibility

This project follows WCAG 2.1 AA guidelines:
- ✅ Semantic HTML throughout
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Color contrast ratios meet standards
- ✅ Mobile-first responsive design
- ✅ Touch targets ≥ 44px

---

## Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Ensure tests pass and code is formatted
5. Submit a pull request

---

## License

ISC

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Todoist](https://todoist.com/) for the excellent task management API
- [Supabase](https://supabase.com/) for backend infrastructure
- [Vercel](https://vercel.com/) for hosting

---

## Support

For issues or questions:
- Check [DOCUMENTATION.md](docs/DOCUMENTATION.md) for technical details
- Review [PLANNING.md](docs/PLANNING.md) for known issues
- Open an issue on GitHub

---

**Status:** 🚧 Active Development - MVP Phase 1

Last updated: November 9, 2025
