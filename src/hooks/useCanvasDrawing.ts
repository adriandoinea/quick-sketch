import { draw } from "@/lib/utils";
import { Drawings } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

export function useCanvasDrawing({
  drawings,
  isEraser,
  brushSize,
  brushColor,
}: {
  drawings: Drawings;
  isEraser: boolean;
  brushSize: number;
  brushColor: string;
}) {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const ctxRef = useRef<null | CanvasRenderingContext2D>(null);
  const [canvasSnapshot, setCanvasSnapshot] =
    useState<HTMLCanvasElement | null>(null);

  const { lines, currentStep } = drawings;

  const configBrushStyles = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = isEraser ? "white" : brushColor;
    ctx.fillStyle = isEraser ? "white" : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";

    ctxRef.current = ctx;
  }, [isEraser, brushSize, brushColor]);

  useEffect(() => {
    const configCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });
      if (!canvas || !ctx) return;

      canvas.style.width = "100%";
      canvas.style.height = "calc(100% - 5px)";
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      configBrushStyles();
      draw(lines, currentStep, canvasRef.current);
    };

    //Also set canvas size and brush styles when component mounted
    configCanvas();

    window.addEventListener("resize", configCanvas);

    return () => {
      window.removeEventListener("resize", configCanvas);
    };
  }, [brushColor, brushSize, configBrushStyles, currentStep, isEraser, lines]);

  useEffect(() => {
    if (lines.length > 0) {
      draw(lines, currentStep, canvasRef.current);
    }
  }, [currentStep, lines]);

  useEffect(() => {
    if (canvasRef.current) setCanvasSnapshot(canvasRef.current);
  }, []);

  return { canvasRef, ctx: ctxRef.current, canvasSnapshot };
}
