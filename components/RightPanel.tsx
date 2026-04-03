"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Lock, Unlock, ChevronDown } from "lucide-react";
import { useBoardStore, useSelectedElement } from "@/store/board";
import type { WhiteboardElement } from "@/types";
import clsx from "clsx";

// ─── Colour swatches ──────────────────────────────────────────────────────────

const SWATCHES = [
  "#7c6aff", "#5b9fff", "#ff6a9b", "#4ade80",
  "#fbbf24", "#f87171", "#a78bfa", "#34d399",
  "#fb923c", "#e2e8f0", "#64748b", "transparent",
];

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className="w-7 h-7 rounded-lg border border-border-default flex-shrink-0
            transition-transform hover:scale-105"
          style={{
            background: value === "transparent"
              ? "repeating-conic-gradient(#333 0% 25%, #555 0% 50%) 0 0 / 8px 8px"
              : value,
          }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border border-border-subtle text-text-primary
            font-mono text-[11px] px-2 py-1 rounded-lg outline-none
            hover:border-border-default focus:border-accent-purple/40 transition-colors"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  onClick={() => { onChange(c); setOpen(false); }}
                  className={clsx(
                    "h-5 rounded-md border transition-all hover:scale-110",
                    value === c ? "border-white/60 scale-105" : "border-transparent"
                  )}
                  style={{
                    background: c === "transparent"
                      ? "repeating-conic-gradient(#333 0% 25%, #555 0% 50%) 0 0 / 8px 8px"
                      : c,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3
          hover:bg-black/[0.02] transition-colors"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {title}
        </span>
        <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.15 }}>
          <ChevronDown size={12} className="text-text-muted" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Prop field ───────────────────────────────────────────────────────────────

function PropField({
  label,
  value,
  onChange,
  suffix,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  suffix?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-mono text-text-muted">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border border-border-subtle text-text-primary
            font-mono text-[12px] px-2 py-1 rounded-lg outline-none w-full
            hover:border-border-default focus:border-accent-purple/40 transition-colors"
        />
        {suffix && (
          <span className="text-[10px] text-text-muted font-mono">{suffix}</span>
        )}
      </div>
    </div>
  );
}

// ─── Slider field ─────────────────────────────────────────────────────────────

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-text-muted">{label}</span>
        <span className="text-[10px] font-mono text-text-secondary">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

// ─── Layer row ────────────────────────────────────────────────────────────────

function LayerRow({
  el,
  isSelected,
  onSelect,
  onToggleVisible,
  onToggleLock,
}: {
  el: WhiteboardElement;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisible: () => void;
  onToggleLock: () => void;
}) {
  const shapeColor = {
    "el-1": "#7c6aff",
    "el-2": "#ff6a9b",
    "el-3": "#5b9fff",
    "el-4": "#e2e8f0",
    "el-5": "#7c6aff",
  }[el.id] ?? "#7c6aff";

  return (
    <div
      onClick={onSelect}
      className={clsx(
        "flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer",
        "transition-colors duration-100",
        isSelected ? "bg-accent-purple/10" : "hover:bg-black/[0.03]",
        !el.visible && "opacity-40"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-4 h-4 rounded-sm flex-shrink-0"
          style={{
            background: shapeColor,
            borderRadius: el.type === "circle" ? "50%" : 4,
            opacity: 0.8,
          }}
        />
        <span className="text-[11px] text-text-secondary font-medium truncate">
          {el.label}
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
          className="w-5 h-5 rounded flex items-center justify-center text-text-muted
            hover:text-text-primary hover:bg-black/[0.05] transition-colors"
        >
          {el.locked
            ? <Lock size={9} />
            : <Unlock size={9} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisible(); }}
          className="w-5 h-5 rounded flex items-center justify-center text-text-muted
            hover:text-text-primary hover:bg-black/[0.05] transition-colors"
        >
          {el.visible ? <Eye size={9} /> : <EyeOff size={9} />}
        </button>
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

export default function RightPanel() {
  const {
    isPanelOpen, selectedElementId, elements,
    closePanel, selectElement, updateElement,
  } = useBoardStore();

  const selected = useSelectedElement();

  const update = (patch: Partial<WhiteboardElement>) => {
    if (selected) updateElement(selected.id, patch);
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.aside
          key="right-panel"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className="pointer-events-auto absolute top-20 right-4 w-[240px] max-h-[calc(100vh-160px)]
            bg-canvas-surface border border-border-default rounded-2xl shadow-layer-2
            flex flex-col overflow-hidden z-40"
        >
          <div className="w-full flex-1 overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3
              border-b border-border-subtle flex-shrink-0">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Properties
              </span>
              <button
                onClick={closePanel}
                className="w-5 h-5 rounded flex items-center justify-center
                  text-text-muted hover:text-text-primary hover:bg-black/[0.05] transition-colors"
              >
                <X size={11} />
              </button>
            </div>

            {selected ? (
              <>
                {/* Position */}
                <Section title="Position">
                  <div className="grid grid-cols-2 gap-2">
                    <PropField label="X" value={selected.x} onChange={(v) => update({ x: +v })} suffix="px" />
                    <PropField label="Y" value={selected.y} onChange={(v) => update({ y: +v })} suffix="px" />
                  </div>
                </Section>

                {/* Size */}
                <Section title="Size">
                  <div className="grid grid-cols-2 gap-2">
                    <PropField label="W" value={selected.width}  onChange={(v) => update({ width: +v })}  suffix="px" />
                    <PropField label="H" value={selected.height} onChange={(v) => update({ height: +v })} suffix="px" />
                  </div>
                  <SliderField
                    label="Rotation"
                    value={selected.rotation}
                    min={0} max={360} suffix="°"
                    onChange={(v) => update({ rotation: v })}
                  />
                </Section>

                {/* Fill */}
                <Section title="Fill">
                  <ColorPicker
                    value={selected.fill}
                    onChange={(v) => update({ fill: v })}
                  />
                </Section>

                {/* Stroke */}
                <Section title="Stroke">
                  <ColorPicker
                    value={selected.stroke}
                    onChange={(v) => update({ stroke: v })}
                  />
                  <SliderField
                    label="Width"
                    value={selected.strokeWidth}
                    min={0} max={20} step={0.5} suffix="px"
                    onChange={(v) => update({ strokeWidth: v })}
                  />
                </Section>

                {/* Opacity */}
                <Section title="Opacity">
                  <SliderField
                    label="Opacity"
                    value={selected.opacity}
                    min={0} max={100} suffix="%"
                    onChange={(v) => update({ opacity: v })}
                  />
                </Section>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-text-muted text-[11px] text-center px-6 leading-relaxed">
                  Select an element to edit its properties
                </p>
              </div>
            )}

            {/* Layers — always visible */}
            <Section title="Layers" defaultOpen={true}>
              <div className="space-y-0.5">
                {elements.map((el) => (
                  <LayerRow
                    key={el.id}
                    el={el}
                    isSelected={el.id === selectedElementId}
                    onSelect={() => selectElement(el.id)}
                    onToggleVisible={() => updateElement(el.id, { visible: !el.visible })}
                    onToggleLock={() => updateElement(el.id, { locked: !el.locked })}
                  />
                ))}
              </div>
            </Section>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
