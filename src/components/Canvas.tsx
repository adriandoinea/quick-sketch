import { useState } from "react";
import Tools from "@/components/Tools";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { draw } from "@/lib/utils";
import {
  addDrawing,
  addDrawingAndSplice,
  changeStep,
  resetDrawings,
} from "@/features/drawings/drawingsSlice";
import { switchTool } from "@/features/toolbar/toolbarSlice";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";

export default function Canvas() {
  const drawings = useAppSelector((state) => state.drawings);
  const { lines, currentStep } = drawings;

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<
    { x: number; y: number }[]
  >([]);

  const tool = useAppSelector((state) => state.toolbar.tool);
  const brushSize = useAppSelector((state) => state.toolbar.brushSize);
  const brushColor = useAppSelector((state) => state.toolbar.brushColor);
  const isEraser = tool === "eraser";

  const { canvasRef, ctx, canvasSnapshot } = useCanvasDrawing({
    brushColor,
    brushSize,
    isEraser,
    drawings,
  });

  const dispatch = useAppDispatch();

  const isUndoDisabled = currentStep < 0;
  const isRedoDisabled = currentStep === lines.length - 1;

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    ctx?.beginPath();
    ctx?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setCurrentPoints([{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]);
    setIsDrawing(true);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) {
      return;
    }
    ctx?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx?.stroke();

    setCurrentPoints((prev) => [
      ...prev,
      { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
    ]);
  };

  const handleMouseUp = () => {
    checkIfOnlyClicked();
    storeDrawing();
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.x;
    const y = e.touches[0].clientY - rect.y;
    ctx?.beginPath();
    ctx?.moveTo(x, y);
    setCurrentPoints([{ x, y }]);
    setIsDrawing(true);
  };

  const handleTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) {
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.x;
    const y = e.touches[0].clientY - rect.y;
    ctx?.lineTo(x, y);
    ctx?.stroke();

    setCurrentPoints((prev) => [...prev, { x, y }]);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    checkIfOnlyClicked();
    storeDrawing();
    setIsDrawing(false);
  };

  const handleUndo = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= -1) {
      draw(lines, prevStep, canvasRef.current);
      dispatch(changeStep(prevStep));
    }

    //Set the  tool to pencil if the the currentStep will be negative (nothing to draw)
    if (prevStep < 0 && isEraser) {
      dispatch(switchTool("pencil"));
    }
  };

  const handleRedo = () => {
    const nextStep = currentStep + 1;
    if (nextStep < lines.length) {
      draw(lines, nextStep, canvasRef.current);
      dispatch(changeStep(nextStep));
    }
  };

  const clearCanvas = () => {
    const confirmation = confirm(
      "Are you sure you want to clear your drawings?"
    );
    if (confirmation && canvasRef.current) {
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      dispatch(resetDrawings());
      dispatch(switchTool("pencil"));
    }
  };

  const checkIfOnlyClicked = () => {
    // Checking if it's just a click
    if (ctx && currentPoints.length === 1) {
      const { x, y } = currentPoints[0];
      ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const storeDrawing = () => {
    if (currentPoints.length > 0 && ctx) {
      const drawing = {
        color: ctx.strokeStyle,
        lineWidth: ctx.lineWidth,
        points: currentPoints,
        globalCompositeOperation: ctx.globalCompositeOperation,
      };

      if (currentStep < lines.length - 1) {
        dispatch(addDrawingAndSplice(drawing));
      } else {
        dispatch(addDrawing(drawing));
      }
      setCurrentPoints([]);
    }
  };

  return (
    <div className="h-svh w-full flex flex-col justify-center gap-4 px-8 py-4">
      <Tools
        canvas={canvasSnapshot}
        isUndoDisabled={isUndoDisabled}
        isRedoDisabled={isRedoDisabled}
        isEraserDisabled={currentStep < 0}
        onClear={clearCanvas}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <div className="w-full h-full flex justify-center border rounded-lg">
        <canvas
          ref={canvasRef}
          className="select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </div>
  );
}
