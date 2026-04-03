import { create } from "zustand";
import type {
  BoardState,
  ToolId,
  WhiteboardElement,
  ConnectionStatus,
} from "@/types";

// ─── Mock initial elements ────────────────────────────────────────────────────

const INITIAL_ELEMENTS: WhiteboardElement[] = [
  {
    id: "el-1",
    type: "rect",
    x: 240,
    y: 180,
    width: 160,
    height: 100,
    rotation: 0,
    fill: "#7c6aff22",
    stroke: "#7c6aff",
    strokeWidth: 1.5,
    opacity: 100,
    locked: false,
    visible: true,
    label: "Rectangle 1",
  },
  {
    id: "el-2",
    type: "rect",
    x: 520,
    y: 310,
    width: 120,
    height: 80,
    rotation: 0,
    fill: "#ff6a9b22",
    stroke: "#ff6a9b",
    strokeWidth: 1.5,
    opacity: 100,
    locked: false,
    visible: true,
    label: "Rectangle 2",
  },
  {
    id: "el-3",
    type: "circle",
    x: 200,
    y: 340,
    width: 90,
    height: 90,
    rotation: 0,
    fill: "#5b9fff22",
    stroke: "#5b9fff",
    strokeWidth: 1.5,
    opacity: 100,
    locked: false,
    visible: true,
    label: "Circle 1",
  },
  {
    id: "el-4",
    type: "text",
    x: 420,
    y: 220,
    width: 160,
    height: 32,
    rotation: 0,
    fill: "transparent",
    stroke: "transparent",
    strokeWidth: 0,
    opacity: 30,
    locked: false,
    visible: true,
    label: "Ideas Board",
  },
  {
    id: "el-5",
    type: "line",
    x: 370,
    y: 270,
    width: 140,
    height: 2,
    rotation: -15,
    fill: "transparent",
    stroke: "#7c6aff",
    strokeWidth: 2,
    opacity: 100,
    locked: false,
    visible: true,
    label: "Line 1",
  },
];

// ─── Store interface ──────────────────────────────────────────────────────────

interface BoardStore extends BoardState {
  // Board
  setBoardName: (name: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;

  // Tools
  setSelectedTool: (tool: ToolId) => void;

  // Elements
  selectElement: (id: string | null) => void;
  updateElement: (id: string, patch: Partial<WhiteboardElement>) => void;

  // Viewport
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPanOffset: (offset: { x: number; y: number }) => void;

  // UI
  openPanel: () => void;
  closePanel: () => void;
  toggleGrid: () => void;

  // History (mock)
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBoardStore = create<BoardStore>((set, get) => ({
  // ── Initial state ──
  name: "Untitled Board",
  selectedTool: "select",
  selectedElementId: null,
  elements: INITIAL_ELEMENTS,
  collaborators: [
    {
      id: "c1",
      name: "Alex",
      color: "#7c6aff",
      initials: "A",
      cursor: { x: 38, y: 35 },
      active: true,
    },
    {
      id: "c2",
      name: "Sam",
      color: "#5b9fff",
      initials: "S",
      cursor: { x: 62, y: 55 },
      active: true,
    },
    {
      id: "c3",
      name: "Mia",
      color: "#ff6a9b",
      initials: "M",
      cursor: { x: 48, y: 68 },
      active: false,
    },
  ],
  zoom: 100,
  panOffset: { x: 0, y: 0 },
  connectionStatus: "connected",
  isPanelOpen: false,
  isGridVisible: true,
  historyIndex: 0,
  historyLength: 0,

  // ── Board ──
  setBoardName: (name) => set({ name }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  // ── Tools ──
  setSelectedTool: (tool) => {
    set({ selectedTool: tool });
    if (tool !== "select") {
      set({ selectedElementId: null, isPanelOpen: false });
    }
  },

  // ── Elements ──
  selectElement: (id) => {
    set({ selectedElementId: id, isPanelOpen: id !== null });
  },
  updateElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((el) =>
        el.id === id ? { ...el, ...patch } : el
      ),
    })),

  // ── Viewport ──
  setZoom: (zoom) => set({ zoom: Math.min(400, Math.max(10, zoom)) }),
  zoomIn: () => set((s) => ({ zoom: Math.min(400, s.zoom + 10) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(10, s.zoom - 10) })),
  resetZoom: () => set({ zoom: 100, panOffset: { x: 0, y: 0 } }),
  setPanOffset: (panOffset) => set({ panOffset }),

  // ── UI ──
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false, selectedElementId: null }),
  toggleGrid: () => set((s) => ({ isGridVisible: !s.isGridVisible })),

  // ── History (mock) ──
  pushHistory: () =>
    set((s) => ({
      historyIndex: s.historyIndex + 1,
      historyLength: s.historyIndex + 1,
    })),
  undo: () =>
    set((s) => ({
      historyIndex: Math.max(0, s.historyIndex - 1),
    })),
  redo: () =>
    set((s) => ({
      historyIndex: Math.min(s.historyLength, s.historyIndex + 1),
    })),
}));

// ─── Derived selectors ────────────────────────────────────────────────────────

export const useSelectedElement = () => {
  const { elements, selectedElementId } = useBoardStore();
  return elements.find((el) => el.id === selectedElementId) ?? null;
};
