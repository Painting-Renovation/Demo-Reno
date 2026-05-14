# Demo-Reno | ProCoat Painters — Full Business Management Platform

A production-ready, full-stack web application for a painting and property renovation business. Built with Next.js 16, TypeScript, Prisma, and Tailwind CSS.

## Overview

This platform includes:

- **Public Website** — Professional multi-section landing page with 44+ components, lead capture, AI-powered pricing calculator, Koalendar appointment booking, and full SEO optimization.
- **Owner Dashboard** — Complete business management with 27+ components: leads, appointments, projects, quotes, analytics, revenue tracking, funnel management, and more.
- **AI Pricing Engine** — 6-step interactive calculator with LLM-powered estimates using Ontario market data, dimension-based calculations, and transparent cost breakdowns.
- **Mini-Services** — Notification microservice for alerts.
- **API Layer** — 18+ REST API routes for full CRUD operations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Webpack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | SQLite via Prisma ORM |
| State | Zustand (client) + TanStack Query (server) |
| Auth | NextAuth.js v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| AI | z-ai-web-dev-sdk (LLM) |
| Calendar | Koalendar (inline embed) |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A package manager (Bun recommended)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/Painting-Renovation/Demo-Reno.git
cd Demo-Reno

# Install dependencies
bun install

# Push database schema
bun run db:push

# Start development server
bun run dev
```

The app runs on `http://localhost:3000`.

### Database Migrations

```bash
bun run db:push      # Push schema changes to SQLite
bun run db:generate  # Generate Prisma Client
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/           # Public-facing pages (20+ routes)
│   ├── (dashboard)/        # Owner dashboard pages
│   └── api/                # API routes (18+)
├── components/
│   ├── website/            # Public site components (44+)
│   ├── dashboard/          # Dashboard components (27+)
│   ├── shared/             # Reusable UI components
│   └── ui/                 # shadcn/ui primitives
├── lib/                    # Utilities, store, DB client
mini-services/              # Microservices (notifications)
skills/estimator/           # AI estimation brain files (agent.md, skill.md)
prisma/                     # Database schema & migrations
public/                     # Static assets
```

## Key Features

- **AI-Powered Pricing Calculator** — 6-step wizard with real Ontario market rates, dimension-based wall area calculations, quality multipliers, and worst-case contingency estimates.
- **Koalendar Integration** — Inline appointment booking embedded at every CTA point.
- **Lead Funnel** — Multi-step estimate forms, appointment scheduling, lead scoring, and conversion tracking.
- **Analytics Dashboard** — Revenue trends, project completion charts, KPI tracking, lead source analytics.
- **Responsive Design** — Mobile-first with Tailwind CSS, supporting all screen sizes.
- **68+ CSS Animations** — Custom keyframes, glassmorphism, shimmer effects, and scroll-triggered animations.

## Owner Access

- **Dashboard**: Click "Dashboard" in the footer Quick Links
- **Login**: owner@procoatpainters.com / any password (6+ characters)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
