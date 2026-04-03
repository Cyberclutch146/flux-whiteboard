// ─── Tool Types ───────────────────────────────────────────────────────────────

export type ToolId =
  | "select"
  | "rect"
  | "circle"
  | "line"
  | "pencil"
  | "text"
  | "hand"
  | "eraser";

export interface Tool {
  id: ToolId;
  label: string;
  shortcut: string;
  group: "interaction" | "shape" | "draw";
}

// ─── Element Types ────────────────────────────────────────────────────────────

export type ElementType = "rect" | "circle" | "line" | "text" | "path";

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  label: string;
  points?: number[]; // For lines and paths
  text?: string;     // For text nodes
  globalCompositeOperation?: string; // For eraser
}

export type WhiteboardElement = BaseElement;

// ─── Collaborator Types ───────────────────────────────────────────────────────

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  initials: string;
  cursor: { x: number; y: number };
  active: boolean;
}

// ─── Board State ──────────────────────────────────────────────────────────────

export type ConnectionStatus = "connected" | "saving" | "saved" | "offline";

export type AppMode = 'board' | 'notebook' | null;

export interface BoardState {
  name: string;
  mode: AppMode;
  notebookContent: string;
  selectedTool: ToolId;
  currentColor: string;
  currentWidth: number;
  selectedElementId: string | null;
  elements: WhiteboardElement[];
  pastElements: WhiteboardElement[][];
  futureElements: WhiteboardElement[][];
  collaborators: Collaborator[];
  zoom: number;
  panOffset: { x: number; y: number };
  connectionStatus: ConnectionStatus;
  isPanelOpen: boolean;
  isGridVisible: boolean;
  historyIndex: number;
  historyLength: number;
}
