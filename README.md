# CivicSaarthi AI

> AI-Powered Indian Government Scheme Discovery and Citizen Assistance Platform

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Framework    | React 18 + TypeScript + Vite      |
| Styling      | Tailwind CSS + shadcn/ui          |
| Routing      | React Router DOM v7               |
| Icons        | Lucide React                      |
| AI Backend   | Google Gemini API *(Stage 2)*     |
| Database     | Supabase *(Stage 2)*              |

## Design Tokens

| Token       | Value     |
|-------------|-----------|
| Primary     | `#142B4A` |
| Secondary   | `#0F8B8D` |
| Background  | `#F5F7FA` |
| Accent      | `#F2A541` |

## Project Structure

```
src/
  assets/           # Static assets
  components/
    common/         # Shared UI atoms (Button, Badge, etc.)
    layout/         # App shell pieces
    ui/             # shadcn/ui component wrappers
    schemes/        # Scheme cards, filters, lists
    dashboard/      # Dashboard widgets
    assistant/      # Chat UI components
    documents/      # Document upload/list
    eligibility/    # Step-form components
  pages/            # Route-level page components
  layouts/          # AppLayout, AuthLayout
  hooks/            # Custom React hooks
  services/         # API service modules
  types/            # Shared TypeScript interfaces
  data/             # Static/mock data
  lib/              # Utility functions (cn, etc.)
  config/           # App constants, route names
  utils/            # Helper utilities
  routes/           # AppRoutes configuration
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase and Gemini credentials

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

## Routes

| Path                 | Component              | Layout     |
|----------------------|------------------------|------------|
| `/`                  | HomePage               | Standalone |
| `/login`             | LoginPage              | AuthLayout |
| `/register`          | RegisterPage           | AuthLayout |
| `/dashboard`         | DashboardPage          | AppLayout  |
| `/schemes`           | SchemesPage            | AppLayout  |
| `/eligibility`       | EligibilityPage        | AppLayout  |
| `/assistant`         | AssistantPage          | AppLayout  |
| `/document-assistant`| DocumentAssistantPage  | AppLayout  |
| `/documents`         | DocumentsPage          | AppLayout  |
| `/compare`           | ComparePage            | AppLayout  |
| `/saved`             | SavedPage              | AppLayout  |
| `/profile`           | ProfilePage            | AppLayout  |

## Development Stages

- **Stage 1** ✅ — Project scaffold, routing, design tokens, placeholder pages
- **Stage 2** — Supabase auth integration, scheme database, real data
- **Stage 3** — Google Gemini AI assistant and eligibility AI
- **Stage 4** — Document upload, verification, notifications
- **Stage 5** — Multilingual support, production deployment
