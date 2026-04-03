# Flux — Collaborative Whiteboard

A modern, high-performance collaborative whiteboard UI built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Zustand.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

| Layer       | Library                        |
|-------------|-------------------------------|
| Framework   | Next.js 15 (App Router)       |
| Language    | TypeScript (strict)           |
| Styling     | Tailwind CSS v3               |
| Animations  | Framer Motion v11             |
| State       | Zustand v5                    |
| Icons       | Lucide React                  |
| Fonts       | Syne + JetBrains Mono (Google)|

---

## Project Structure

```
flux-whiteboard/
├── app/
│   ├── globals.css          # Tailwind base + custom CSS (sliders, scrollbars)
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Entry point → <WhiteboardApp />
│
├── components/
│   ├── WhiteboardApp.tsx    # Top-level shell: composes all panels
│   ├── Navbar.tsx           # Logo, board name, status, avatars, share
│   ├── Toolbar.tsx          # Vertical tool buttons with tooltips + shortcuts
│   ├── Canvas.tsx           # Grid, mock elements, selection overlay
│   ├── RightPanel.tsx       # Properties panel: position/size/color/stroke/layers
│   ├── BottomBar.tsx        # Zoom controls, undo/redo, grid toggle
│   └── CursorOverlay.tsx    # Animated collaborator cursor indicators
│
├── hooks/
│   ├── useKeyboardShortcuts.ts   # Global key bindings (V/R/O/L/P/T/H, zoom, undo)
│   └── useCollaboratorCursors.ts # Cursor animation helper (used by CursorOverlay)
│
├── store/
│   └── board.ts             # Zustand store: all UI + board state + selectors
│
├── types/
│   └── index.ts             # ToolId, WhiteboardElement, Collaborator, BoardState
│
├── tailwind.config.ts       # Custom tokens: colors, fonts, keyframes
└── tsconfig.json
```

---

## Keyboard Shortcuts

| Key       | Action           |
|-----------|-----------------|
| `V`       | Select tool      |
| `R`       | Rectangle tool   |
| `O`       | Circle tool      |
| `L`       | Line tool        |
| `P`       | Pencil tool      |
| `T`       | Text tool        |
| `H`       | Pan/Hand tool    |
| `+` / `=` | Zoom in          |
| `-`       | Zoom out         |
| `Ctrl+0`  | Reset zoom       |
| `Ctrl+Z`  | Undo             |
| `Ctrl+Y`  | Redo             |
| `Escape`  | Deselect / close panel |

---

## State Management (Zustand)

All state lives in `store/board.ts`. The store is flat and action-oriented:

```ts
// Reading state
const zoom = useBoardStore((s) => s.zoom);
const selected = useSelectedElement(); // derived selector

// Dispatching actions
const { zoomIn, setSelectedTool, updateElement } = useBoardStore();
```

### Key state slices

| Slice               | Type                    | Description                        |
|---------------------|-------------------------|------------------------------------|
| `selectedTool`      | `ToolId`                | Currently active drawing tool       |
| `selectedElementId` | `string \| null`        | ID of the selected element          |
| `elements`          | `WhiteboardElement[]`   | All canvas elements                 |
| `collaborators`     | `Collaborator[]`        | Mock real-time collaborators        |
| `zoom`              | `number`                | Viewport zoom level (10–400)        |
| `isPanelOpen`       | `boolean`               | Right panel visibility              |
| `connectionStatus`  | `ConnectionStatus`      | connected / saving / saved / offline|
| `historyIndex`      | `number`                | Mock undo pointer                   |

---

## Connecting a Real Backend

The UI is deliberately backend-free. Here are the integration points:

### Real-time cursors (Liveblocks / Yjs)
Replace the `setInterval` animation in `CursorOverlay.tsx` with a presence subscription:

```ts
// Liveblocks example
const others = useOthers();
// Map others[].presence.cursor → <CollabCursor />
```

### Shared canvas state (Yjs / Automerge)
Replace `useBoardStore` element mutations with a CRDT document:

```ts
const ydoc = new Y.Doc();
const yElements = ydoc.getArray<WhiteboardElement>("elements");
// Bind yElements.observe → Zustand store sync
```

### Persistence (Supabase / PlanetScale)
Replace the `setBoardName` save timer with a debounced API call:

```ts
await fetch("/api/board", {
  method: "PATCH",
  body: JSON.stringify({ name, elements }),
});
```

### Real canvas rendering (Konva / Fabric.js)
Replace the mock `<div>` shapes in `Canvas.tsx` with a proper canvas renderer:

```tsx
import { Stage, Layer, Rect, Circle } from "react-konva";
// Map store.elements → Konva shapes
```

---

## Design Tokens

All design tokens are defined in `tailwind.config.ts`:

```ts
colors: {
  canvas: {
    bg:       "#0a0a0f",   // Page background
    surface:  "#111118",   // Canvas area
    elevated: "#16161f",   // Panels, tooltips
    overlay:  "#1c1c28",   // Inputs, badges
  },
  accent: {
    purple: "#7c6aff",
    blue:   "#5b9fff",
    pink:   "#ff6a9b",
    green:  "#4ade80",
  },
  text: {
    primary:   "#e8e8f0",
    secondary: "#9898b0",
    muted:     "#55556a",
  },
}
```

---

## License

MIT
