# SYNQ — Collaborative Workspace

![SYNQ Preview](/public/logo.png)

**SYNQ** is a high-fidelity, cinematic real-time collaboration suite. It merges an infinite, unstructured Whiteboard canvas with a distraction-free, rich-text Collaborative Notebook. Built on modern web technologies including Next.js 15, Yjs, Firebase, and React Konva, SYNQ emphasizes a fluid, aesthetic-driven user experience alongside high-performance multiplayer synchronization.

## 🌟 Core Capabilities

- **Gateway Access System**: Join collaborative modes securely via a custom 7-digit Terminal code sequence, or boot a private, local-cached session.
- **Fluid Workspace Selection**: Smoothly pivot between the Infinite Whiteboard and the structured Document Notebook without breaking session connectivity.
- **Real-Time Multiplayer Sync**:
  - Powered by **Yjs & WebRTC** for decentralized, conflict-free collaborative editing (CRDT).
  - **Firebase Realtime Database** handles signaling, low-latency multi-cursor tracking, and active session management.
  - **Split-Architecture Rendering**: Local strokes render instantaneously on the canvas guaranteeing zero-lag response, while remote strokes sync seamlessly via WebRTC at a throttled 60 FPS.
- **Mobile-First Performance Parity**:
  - Touch-optimized drawing and a dedicated “Pan” tool for efficient canvas navigation without accidental sketching.
  - Optimized dashboard, loading sequences, and footers—reducing resource-heavy interactive elements to ensure battery efficiency and zero layout thrashing on mobile devices.
- **Aesthetic Refinement**: Complete Light/Dark mode support. Cinematic visual elements including dynamically stylized neon glow layers, noise grids, minimalistic backgrounds, and interactive Framer Motion typography mechanics.
- **Exporting Options**: Convert and download your Notebook sessions directly to `.pdf`, `.txt`, or `.docx` perfectly formatted using top-level Ribbon tools.

## 🎨 The Environments

### 1. The Whiteboard (React Konva)
Map complex architectures, draw freehand, stack geometric primitives, or import imagery into an infinite canvas mode. 
- Features a dynamic toolbar for adjusting stroke widths, colors, and live erasing.
- Instant, multi-client board deletions.
- Dedicated panning and mobile touch support.

### 2. The Collaborative Notebook
A premium, stylized document editor reminiscent of a glowing physical sheet of paper.
- Combines **React-Quill** and **Tiptap** for deep editorial alignment and co-brainstorming.
- Synchronized text states using `y-tiptap` and WebRTC.

## 🚀 Getting Started

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

Install dependencies and run the development environment locally:

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to enter the gateway.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Framer Motion, Shadcn UI
- **State Management**: Zustand (with Persist Middleware) & Yjs
- **Sync Architecture**: Y-WebRTC & Firebase Realtime Database
- **Canvas Rendering**: React Konva
- **Text Rendering**: React-Quill, Tiptap
- **WebGL/Cinematics**: OGL

## 💡 Recent Optimizations

- **High-Performance Architecture**: Eliminated synchronization lag by decoupling local instant re-renders from remote WebRTC updates. 
- **Type Safety**: Strictly typed TypeScript data flow to prevent deployment errors on Vercel.
- **Mobile Upgrades**: Simplified heavy WebGL animations on mobile breakpoints and integrated responsive static footers.

---
*"Follow the white rabbit..."* 🐇
