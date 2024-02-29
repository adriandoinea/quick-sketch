import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import Tools from "@/components/Tools";

export default function Canvas() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const ctxRef = useRef<null | CanvasRenderingContext2D>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const tool = useAppSelector((state) => state.toolbar.tool);
  const brushSize = useAppSelector((state) => state.toolbar.brushSize);
  const brushColor = useAppSelector((state) => state.toolbar.brushColor);
  const isEraser = tool === "eraser";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = isEraser ? "white" : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";

    ctxRef.current = ctx;
  }, [isEraser, brushSize, brushColor]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    ctxRef.current?.closePath();

    setIsDrawing(false);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) {
      return;
    }
    ctxRef.current?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current?.stroke();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.x;
    const y = e.touches[0].clientY - rect.y;
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
    setIsDrawing(true);
  };

  const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) {
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.x;
    const y = e.touches[0].clientY - rect.y;
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();
  };

  const handleTouchEnd = () => {
    ctxRef.current?.closePath();
    setIsDrawing(false);
  };

  const handleCanvasClear = () => {
    if (canvasRef.current) {
      ctxRef.current?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 px-8 py-4">
      <Tools onClear={handleCanvasClear} />
      <div className="w-full flex justify-center">
        <canvas
          ref={canvasRef}
          className="border rounded-lg"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
          width={1000}
          height={550}
        />
      </div>
    </div>
  );
}
