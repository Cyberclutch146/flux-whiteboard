# SYNQ — Collaborative Suite

**SYNQ** is a high-fidelity, cinematic real-time collaboration suite. It merges an infinite unstructured Whiteboard canvas with a distraction-free, rich-text Collaborative Notebook. Built on Next.js, Framer Motion, and Firebase Realtime Database, it emphasizes a fluid, aesthetic-driven user experience.

![SYNQ Preview](/public/logo.png)

## Core Capabilities

- **Gateway Access System**: Join collaborative modes securely via a custom 7-digit Terminal code sequence, or boot a private Solo local-cache session.
- **Fluid Workspace Selection**: Smoothly pivot between the Infinite Whiteboard and the structured Document Notebook without breaking session connectivity.
- **Real-Time Multiplayer Sync**: Low-latency multi-cursor tracking and instantaneous DOM-element synchronization across remote users utilizing Firebase hooks.
- **Aesthetic Refinement**: Complete Light/Dark mode support. Cinematic visual elements including dynamically stylized neon glow layers, noise grids, and interactive Framer Motion typography mechanics.
- **Exporting Options**: Convert and download your Notebook sessions directly to `.pdf`, `.txt`, or `.docx` perfectly formatted using top-level Ribbon tools.

## The Environments

1. **The Whiteboard**: Built on `React Konva`. Map complex architectures, draw freehand, stack geometric primitives, or import imagery. Features a dedicated dynamic toolbar for adjusting stroke widths, colors, and live erasing.
2. **The Collaborative Notebook**: Built on `React-Quill`. A premium, stylized document editor reminiscent of a glowing physical sheet of paper. Optimized for deep editorial alignment and co-brainstorming.

## Getting Started

### Prerequisites
You need a Google Firebase Project initialized with **Realtime Database** enabled and authentication protocols set.

1. Create a file named `.env.local` in the root of the directory.
2. Insert your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

### Installation
Run the development environment locally:

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to enter the gateway.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Framer Motion, Lucide React
- **State management**: Zustand (with Persist Middleware for Local Instances)
- **Sync Architecture**: Firebase Realtime Database
- **Canvas / Text Rendering**: React Konva & React-Quill

---
*"Follow the white rabbit..."* 🐇
