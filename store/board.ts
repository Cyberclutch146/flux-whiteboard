import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BoardState,
  ToolId,
  WhiteboardElement,
  ConnectionStatus,
} from "@/types";

// ─── Store interface ──────────────────────────────────────────────────────────

interface BoardStore extends BoardState {
  // Board
  setBoardName: (name: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;

  // Tools
  setSelectedTool: (tool: ToolId) => void;

  // Elements
  selectElement: (id: string | null) => void;
  addElement: (el: WhiteboardElement) => void;
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

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ──
      name: "demo.lorien",
      selectedTool: "pencil",
      selectedElementId: null,
      elements: [],
      collaborators: [],
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
      addElement: (el) => set((s) => ({ elements: [...s.elements, el] })),
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
    }),
    {
      name: "flux-board-storage",
      partialize: (state) => ({ elements: state.elements, name: state.name }),
    }
  )
);

// ─── Derived selectors ────────────────────────────────────────────────────────

export const useSelectedElement = () => {
  const { elements, selectedElementId } = useBoardStore();
  return elements.find((el) => el.id === selectedElementId) ?? null;
};
