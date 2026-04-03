// ─── Tool Types ───────────────────────────────────────────────────────────────

export type ToolId =
  | "select"
  | "rect"
  | "circle"
  | "line"
  | "pencil"
  | "text"
  | "hand";

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

export interface BoardState {
  name: string;
  selectedTool: ToolId;
  selectedElementId: string | null;
  elements: WhiteboardElement[];
  collaborators: Collaborator[];
  zoom: number;
  panOffset: { x: number; y: number };
  connectionStatus: ConnectionStatus;
  isPanelOpen: boolean;
  isGridVisible: boolean;
  historyIndex: number;
  historyLength: number;
}
