# SYNQ Collaborative Workspace

SYNQ is a minimalist, high-performance real-time collaboration suite containing a robust Collaborative Whiteboard and a real-time Collaborative Notebook. It is built on modern web technologies including Next.js, Framer Motion, Zustand, and Firebase Realtime Database.

## Features

- **Infinite Canvas Whiteboard**: Boundless spatial canvas with panning and zooming.
- **Collaborative Notebook**: A rich-text syncing document editor optimized for structured group note-taking.
- **Real-Time Multiplayer Sync**: Low-latency multi-cursor tracking and instantaneous DOM-element synchronization across remote users.
- **Ephemeral Rooms**: Session destruction logic ensures data hygiene; rooms and elements automatically clear when the session is abandoned.
- **Persistent Local Caching**: Solo drawings automatically hydrate from internal `localStorage` using Zustand Persist layers.
- **Robust Tools**: Vector-based Paths, Lines, Shapes, Draggable Floating Text Boxes, and Media Imagery imports.
- **Exporting Suite**: Dump sessions directly to `.png`, `.pdf`, `.docx`, or generic `.txt`.

## Getting Started

### Prerequisites
You need a Google Firebase Project properly initialized with **Realtime Database** switched on.

1. Create a file named `.env.local` in the root of the directory.
2. Provide your Firebase keys:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```
*(Ensure you hit save and completely restart `npm run dev` so Next.js hydrates them!)*

### Installation
Run the development server natively:

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the workspace.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Framer Motion & React Bits
- **State Engine**: Zustand (Standard & Persist Middleware)
- **Sync Layer**: Firebase Realtime Database
- **Canvas Engine**: React Konva
- **Rich Text**: React-Quill

## Design Architecture
SYNQ is engineered around multi-state flow lifecycle paradigms: `Loading` -> `Login` -> `Selection` -> `Room` -> `Destruction`. It prioritizes highly performant UX, dynamically omitting heavy payload operations from non-critical render paths.
