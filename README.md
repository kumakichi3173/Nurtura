# Nurtura / Feedback Bridge

[Live Demo](nurtura-feedback.vercel.app)

A portfolio demo of a database-backed provider feedback management platform. The app centralizes provider feedback, supports internal review and prioritization, and turns feedback records into dashboard insights for product and operational decision-making.

## Overview

Feedback Bridge is designed to close the gap between incoming provider feedback and internal action. Instead of keeping feedback in scattered messages, spreadsheets, or informal notes, the platform provides a structured workflow for collecting, reviewing, prioritizing, assigning, and reporting on feedback.

## Features

- Submit provider feedback through a structured intake form
- Store feedback records in Supabase
- View all feedback in a centralized repository
- Open individual feedback detail pages
- Update status, priority, and internal owner
- Review feedback by workflow status
- View reporting dashboards by category, status, priority, and provider

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- pnpm

## Demo Flow

1. Open the home page
2. Click **Start Demo Flow**
3. Submit a new provider feedback item
4. View the feedback in the repository
5. Open the feedback detail page
6. Update status, priority, and owner
7. Review the item on the Review Board
8. Check updated metrics in the Reporting Dashboard

## Local Setup

Clone the repository and install dependencies.

```bash
pnpm install
```

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_supabase_anon_key
```

Start Supabase locally.

```bash
supabase start
```

Reset and seed the local database if needed.

```bash
supabase db reset
```

Start the development server.

```bash
pnpm dev
```

Open the app.

```txt
http://localhost:3000
```

## Project Structure

```txt
src/app
├── page.tsx               # Home page
├── submit/page.tsx        # Feedback submission form
├── feedback/page.tsx      # Feedback repository
├── feedback/[id]/page.tsx # Feedback detail page
├── review/page.tsx        # Review board
└── dashboard/page.tsx     # Reporting dashboard
```

## Database

The core `feedback` table stores feedback records with fields such as:

- feedback ID
- title
- description
- category
- status
- priority
- provider name
- owner
- created timestamp
- updated timestamp

## Purpose

This project demonstrates experience with full-stack product development, database-backed workflows, UI routing, form handling, Supabase integration, and dashboard-style data presentation.
