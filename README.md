# LocalLens

LocalLens is a human-powered local travel companion that helps travelers discover trusted local insights from friends and people who know a city well. Instead of relying only on algorithmic recommendations, LocalLens focuses on friend guides, nearby local context, real-time updates, and place-aware conversations.

## Description

LocalLens is a full-stack TypeScript web application built with React and TanStack Start. The app includes a landing page, authenticated dashboard, friend guides, nearby map-style discovery, chat, profile, and local travel planning flows.

The project uses Clerk for authentication, Stream Chat credentials for chat token generation, SQLite for local development data, and Cloudflare Workers configuration for deployment.

## Architecture Diagrams

### Full Application Workflow

```mermaid
flowchart TD
  U[User / Traveler] --> B[Browser]

  B --> FE[React 19 Frontend]
  FE --> TSR[TanStack Router<br/>File-based routes]

  TSR --> Landing[Landing Page<br/>/]
  TSR --> Login[Login / Signup<br/>/login /signup]
  TSR --> AppShell[Authenticated App Shell<br/>/_app]

  Login --> Clerk[Clerk Authentication]
  Clerk --> AppShell

  AppShell --> Dashboard[Dashboard<br/>/dashboard]
  AppShell --> Guides[Friend Guides<br/>/guides]
  AppShell --> GuideDetail[Guide Detail<br/>/guides/$guideId]
  AppShell --> NewGuide[Create Guide<br/>/guides/new]
  AppShell --> Map[Nearby Discovery<br/>/map]
  AppShell --> Friends[Friends<br/>/friends]
  AppShell --> ChatIndex[Chat List<br/>/chat]
  AppShell --> ChatFriend[Place-aware Chat<br/>/chat/$friendId]
  AppShell --> Itinerary[Travel Itinerary<br/>/travel-itinerary]
  AppShell --> Profile[Profile<br/>/profile]

  Dashboard --> DataFn[getLocalLensDataFn]
  Guides --> DataFn
  GuideDetail --> DataFn
  Map --> DataFn
  Friends --> DataFn
  ChatIndex --> DataFn
  Itinerary --> DataFn
  Profile --> DataFn

  DataFn --> DBServer[src/lib/db.server.ts]
  DBServer --> SQLite[(SQLite Database<br/>data/locallens.sqlite)]

  SQLite --> Tables[users<br/>friendships<br/>guides<br/>posts<br/>messages<br/>conversations<br/>city_maps<br/>live_locations<br/>guide_places<br/>city_top_places]

  ChatFriend --> ChatHistory[GET /api/chat/history/:friendId]
  ChatFriend --> ChatStream[EventSource<br/>/api/chat/stream/:friendId]
  ChatFriend --> ChatSend[POST /api/chat/send]
  ChatFriend --> ChatToken[POST /api/chat/token]

  ChatHistory --> Server[src/server.ts]
  ChatStream --> Server
  ChatSend --> Server
  ChatToken --> Server

  Server --> MemoryChat[(In-memory Chat State<br/>messages + SSE clients)]
  Server --> Stream[Stream Chat API]
  Stream --> ChatToken

  Server --> SSR[TanStack Start Server Entry]
  SSR --> FE

  subgraph Deployment
    Vite[Vite Build]
    Worker[Cloudflare Worker<br/>wrangler.jsonc]
  end

  FE --> Vite
  Server --> Worker
```

### User Journey

```mermaid
journey
  title LocalLens User Workflow
  section Entry
    Visit landing page: 5: User
    Login or sign up: 4: User, Clerk
    Redirect to dashboard: 5: Clerk, App
  section Explore
    View local dashboard insights: 5: User, App
    Browse friend guides: 5: User, App
    Open guide details: 4: User, App
    Discover nearby places and friends: 5: User, App
  section Data
    Load app data through server function: 4: App
    Query SQLite local database: 4: Server
    Return guides, posts, users, places, messages: 5: Server, App
  section Chat
    Open friend chat: 5: User
    Load chat history: 4: App, Server
    Connect to live SSE stream: 4: App, Server
    Send message: 5: User, Server
    Broadcast message update: 5: Server, App
  section Planning
    Build travel itinerary: 5: User, App
    Review profile and own guides: 4: User, App
```

### Technical Request Flow

```mermaid
sequenceDiagram
  actor User
  participant Browser
  participant React as React UI
  participant Router as TanStack Router
  participant Clerk
  participant Start as TanStack Start Server
  participant DB as SQLite
  participant API as Custom Chat API
  participant Stream as Stream Chat API

  User->>Browser: Open LocalLens
  Browser->>React: Load app
  React->>Router: Resolve route

  alt Public route
    Router->>React: Render landing/login/signup
  else Protected app route
    React->>Clerk: Check auth session
    Clerk-->>React: Authenticated user
    Router->>React: Render AppShell
  end

  React->>Start: getLocalLensDataFn()
  Start->>DB: Query users, guides, posts, maps, messages
  DB-->>Start: LocalLensData
  Start-->>React: Return typed app data

  React->>User: Show dashboard/guides/map/friends/profile

  opt Chat page
    React->>API: GET /api/chat/history/:friendId
    API-->>React: Existing messages

    React->>API: Connect /api/chat/stream/:friendId
    API-->>React: Live SSE events

    React->>API: POST /api/chat/send
    API-->>React: Message sent
    API-->>React: Broadcast message event

    React->>API: POST /api/chat/token
    API->>Stream: Upsert users
    Stream-->>API: OK
    API-->>React: apiKey + userToken
  end
```

## Features

- User authentication with Clerk
- Landing page for the LocalLens product
- Authenticated app shell with sidebar and mobile navigation
- Dashboard with local travel insights
- Friend guides for trusted city recommendations
- Guide detail and guide creation pages
- Nearby/local discovery page
- Friends page
- Place-aware chat experience
- Travel itinerary page
- User profile page
- Dark and light theme toggle
- Local SQLite database with schema and seed data
- Server-side API handlers for chat token, chat history, chat stream, and chat send
- Cloudflare Workers deployment configuration

## Tech Stack

| Category | Technology |
| --- | --- |
| Language | TypeScript |
| Frontend | React 19 |
| Full-stack framework | TanStack Start |
| Routing | TanStack Router |
| Data fetching/state | TanStack React Query |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui style components |
| UI primitives | Radix UI |
| Icons | Lucide React |
| Authentication | Clerk |
| Chat | Stream Chat API and custom server endpoints |
| Forms | React Hook Form |
| Validation | Zod |
| Charts | Recharts |
| Notifications | Sonner |
| Date utilities | date-fns |
| Local database | SQLite |
| Deployment target | Cloudflare Workers |
| Deployment tooling | Wrangler |
| Linting | ESLint |
| Formatting | Prettier |

## Project Structure

```txt
LocalLens/
+-- db/
|   +-- README.md
|   +-- schema.sql
|   +-- seed.sql
+-- src/
|   +-- components/
|   |   +-- AppShell.tsx
|   |   +-- ui/
|   +-- hooks/
|   +-- lib/
|   |   +-- data.ts
|   |   +-- db.server.ts
|   |   +-- mockData.ts
|   |   +-- utils.ts
|   +-- routes/
|   |   +-- __root.tsx
|   |   +-- index.tsx
|   |   +-- login.tsx
|   |   +-- signup.tsx
|   |   +-- _app.dashboard.tsx
|   |   +-- _app.friends.tsx
|   |   +-- _app.map.tsx
|   |   +-- _app.profile.tsx
|   |   +-- _app.travel-itinerary.tsx
|   |   +-- _app.chat.* / _app.guides.*
|   +-- router.tsx
|   +-- server.ts
|   +-- start.ts
|   +-- styles.css
+-- .env.example
+-- components.json
+-- eslint.config.js
+-- package.json
+-- tsconfig.json
+-- vite.config.ts
+-- wrangler.jsonc
```

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- SQLite CLI (`sqlite3`)

## Environment Variables

Create a `.env` file in the project root using `.env.example` as a reference.

Required variables:

```env
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_SIGN_IN_URL=/login
CLERK_SIGN_UP_URL=/signup
CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
GETSTREAM_API_KEY=
GETSTREAM_API_SECRET=
```

## Steps to Run

1. Install dependencies:

```sh
npm install
```

2. Create the environment file:

```sh
cp .env.example .env
```

3. Initialize the local SQLite database:

```sh
npm run db:init
```

4. Start the development server:

```sh
npm run dev
```

5. Open the app in your browser:

```txt
http://localhost:8083
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production app |
| `npm run build:dev` | Build the app in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format files with Prettier |
| `npm run db:init` | Create and seed the local SQLite database |
| `npm run db:reset` | Delete and recreate the local SQLite database |

## Database

This project uses SQLite for local development. The database file is created at:

```txt
data/locallens.sqlite
```

The database file is ignored by Git. Schema and seed files are stored in:

```txt
db/schema.sql
db/seed.sql
```

Useful database checks:

```sh
sqlite3 data/locallens.sqlite ".tables"
sqlite3 data/locallens.sqlite "select * from users;"
```

## Deployment

The project includes Cloudflare Workers configuration through `wrangler.jsonc` and Cloudflare/Vite integration. The server entry is configured in `src/server.ts`, and the app is built with Vite/TanStack Start.

## Notes

- The app uses file-based routing through TanStack Router.
- Generated route output is stored in `src/routeTree.gen.ts`.
- UI components follow a shadcn-style structure under `src/components/ui`.
- Local development data comes from SQLite, while chat token generation depends on Stream credentials.
