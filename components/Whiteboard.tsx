'use client';

import { useEffect, useRef, useState } from 'react';

export default function Whiteboard({ width = 800, height = 480 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#111827');
  const [size, setSize] = useState(3);
  const strokesRef = useRef<Array<{ color: string; size: number; points: number[][] }>>([]);
  const currentStrokeRef = useRef<{ color: string; size: number; points: number[][] } | null>(null);

  useEffect(() => {
    const c = canvasRef.current!;
    c.width = width * 2;
    c.height = height * 2;
    c.style.width = `${width}px`;
    c.style.height = `${height}px`;
    const ctx = c.getContext('2d')!;
    ctx.scale(2, 2);
    redraw();
  }, []);

  function getCtx() {
    const c = canvasRef.current!;
    return c.getContext('2d')!;
  }

  function redraw() {
    const ctx = getCtx();
    ctx.clearRect(0, 0, width, height);
    for (const s of strokesRef.current) {
      drawStroke(ctx, s);
    }
  }

  function drawStroke(ctx: CanvasRenderingContext2D, stroke: { color: string; size: number; points: number[][] }) {
    if (!stroke.points.length) return;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.beginPath();
    const [x0, y0] = stroke.points[0];
    ctx.moveTo(x0, y0);
    for (let i = 1; i < stroke.points.length; i++) {
      const [x, y] = stroke.points[i];
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function pointerPos(e: PointerEvent | MouseEvent | TouchEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    if ('touches' in e && e.touches.length) {
      return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
    }
    const ev = e as MouseEvent;
    return [ev.clientX - rect.left, ev.clientY - rect.top];
  }

  function handlePointerDown(e: any) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setIsDrawing(true);
    const p = pointerPos(e);
    currentStrokeRef.current = { color, size, points: [p] };
  }

  function handlePointerMove(e: any) {
    if (!isDrawing || !currentStrokeRef.current) return;
    const p = pointerPos(e);
    currentStrokeRef.current.points.push(p);
    const ctx = getCtx();
    drawStroke(ctx, { ...currentStrokeRef.current, points: [...currentStrokeRef.current.points.slice(-2)] });
  }

  function handlePointerUp() {
    if (!isDrawing || !currentStrokeRef.current) return;
    strokesRef.current.push(currentStrokeRef.current);
    currentStrokeRef.current = null;
    setIsDrawing(false);
  }

  function clear() {
    strokesRef.current = [];
    redraw();
  }

  function undo() {
    strokesRef.current.pop();
    redraw();
  }

  function downloadPNG() {
    const a = document.createElement('a');
    a.href = canvasRef.current!.toDataURL('image/png');
    a.download = 'whiteboard.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="bg-white border border-neutral-200 rounded p-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex gap-2 items-center">
          <label className="text-xs text-neutral-500">Brush</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 p-0" />
          <input type="range" min={1} max={20} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={undo} className="px-3 py-1 border rounded text-sm">Undo</button>
          <button onClick={clear} className="px-3 py-1 border rounded text-sm">Clear</button>
          <button onClick={downloadPNG} className="px-3 py-1 bg-primary-600 text-white rounded text-sm">Download</button>
        </div>
      </div>
      <div className="border rounded overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => handlePointerDown(e as any)}
          onPointerMove={(e) => handlePointerMove(e as any)}
          onPointerUp={() => handlePointerUp()}
          onPointerCancel={() => handlePointerUp()}
          className="w-full touch-none"
          style={{ width: '100%', height }}
        />
      </div>
    </div>
  );
}
