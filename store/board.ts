import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BoardState,
  ToolId,
  WhiteboardElement,
  ConnectionStatus,
} from "@/types";

interface BoardStore extends BoardState {
  setBoardName: (name: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setSelectedTool: (tool: ToolId) => void;
  
  setCurrentColor: (c: string) => void;
  setCurrentWidth: (w: number) => void;

  selectElement: (id: string | null) => void;
  addElement: (el: WhiteboardElement) => void;
  updateElement: (id: string, patch: Partial<WhiteboardElement>) => void;
  clearBoard: () => void;

  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPanOffset: (offset: { x: number; y: number }) => void;

  openPanel: () => void;
  closePanel: () => void;
  toggleGrid: () => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      name: "demo.lorien",
      selectedTool: "pencil",
      currentColor: "#333333",
      currentWidth: 4,
      selectedElementId: null,
      elements: [],
      pastElements: [],
      futureElements: [],
      collaborators: [],
      zoom: 100,
      panOffset: { x: 0, y: 0 },
      connectionStatus: "connected",
      isPanelOpen: false,
      isGridVisible: true,
      historyIndex: 0,
      historyLength: 0,
      theme: 'light',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      setBoardName: (name) => set({ name }),
      setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

      setSelectedTool: (tool) => {
        set({ selectedTool: tool });
        if (tool !== "select") {
          set({ selectedElementId: null, isPanelOpen: false });
        }
      },
      
      setCurrentColor: (currentColor) => set({ currentColor }),
      setCurrentWidth: (currentWidth) => set({ currentWidth }),

      selectElement: (id) => {
        set({ selectedElementId: id, isPanelOpen: id !== null });
      },
      
      addElement: (el) => set((s) => ({ 
        elements: [...s.elements, el],
        // pushHistory handles past/future
      })),
      
      updateElement: (id, patch) =>
        set((s) => ({
          elements: s.elements.map((el) =>
            el.id === id ? { ...el, ...patch } : el
          ),
        })),

      clearBoard: () => {
        const { elements, pastElements } = get();
        if (elements.length === 0) return;
        set({
          pastElements: [...pastElements, elements],
          futureElements: [],
          elements: [],
          historyIndex: pastElements.length + 1,
          historyLength: pastElements.length + 1,
        });
      },

      setZoom: (zoom) => set({ zoom: Math.min(400, Math.max(10, zoom)) }),
      zoomIn: () => set((s) => ({ zoom: Math.min(400, s.zoom + 10) })),
      zoomOut: () => set((s) => ({ zoom: Math.max(10, s.zoom - 10) })),
      resetZoom: () => set({ zoom: 100, panOffset: { x: 0, y: 0 } }),
      setPanOffset: (panOffset) => set({ panOffset }),

      openPanel: () => set({ isPanelOpen: true }),
      closePanel: () => set({ isPanelOpen: false, selectedElementId: null }),
      toggleGrid: () => set((s) => ({ isGridVisible: !s.isGridVisible })),

      // History mapping
      pushHistory: () => {
        set((s) => {
          const newPast = [...s.pastElements, s.elements];
          return {
            pastElements: newPast,
            futureElements: [],
            historyIndex: newPast.length,
            historyLength: newPast.length,
          };
        });
      },
      
      undo: () => {
        set((s) => {
          if (s.pastElements.length === 0) return s;
          const previous = s.pastElements[s.pastElements.length - 1];
          const newPast = s.pastElements.slice(0, -1);
          return {
            pastElements: newPast,
            futureElements: [s.elements, ...s.futureElements],
            elements: previous,
            historyIndex: s.historyIndex - 1,
          };
        });
      },
      
      redo: () => {
        set((s) => {
          if (s.futureElements.length === 0) return s;
          const next = s.futureElements[0];
          const newFuture = s.futureElements.slice(1);
          return {
            pastElements: [...s.pastElements, s.elements],
            futureElements: newFuture,
            elements: next,
            historyIndex: s.historyIndex + 1,
          };
        });
      },
    }),
    {
      name: "flux-board-storage",
      partialize: (state) => ({ elements: state.elements, pastElements: state.pastElements, futureElements: state.futureElements, name: state.name }),
    }
  )
);

export const useSelectedElement = () => {
  const { elements, selectedElementId } = useBoardStore();
  return elements.find((el) => el.id === selectedElementId) ?? null;
};
