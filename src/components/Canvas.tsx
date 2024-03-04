import { useCallback, useEffect, useRef, useState } from "react";
import Tools from "@/components/Tools";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { draw } from "@/lib/utils";
import {
  addDrawing,
  addDrawingAndSplice,
  resetDrawings,
} from "@/features/drawings/drawingsSlice";
import { switchTool } from "@/features/toolbar/toolbarSlice";

export default function Canvas() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const ctxRef = useRef<null | CanvasRenderingContext2D>(null);

  const drawings = useAppSelector((state) => state.drawings);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [currentPoints, setCurrentPoints] = useState<
    { x: number; y: number }[]
  >([]);

  const tool = useAppSelector((state) => state.toolbar.tool);
  const brushSize = useAppSelector((state) => state.toolbar.brushSize);
  const brushColor = useAppSelector((state) => state.toolbar.brushColor);
  const isEraser = tool === "eraser";

  const dispatch = useAppDispatch();

  const isUndoDisabled = currentStep < 0;
  const isRedoDisabled = currentStep === drawings.length - 1;

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

      const existingDrawings = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.style.width = "100%";
      canvas.style.height = "calc(100% - 5px)";
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.putImageData(existingDrawings, 0, 0);

      configBrushStyles();
    };

    //Also set canvas size and brush styles when component mounted
    configCanvas();

    window.addEventListener("resize", configCanvas);

    return () => {
      window.removeEventListener("resize", configCanvas);
    };
  }, [brushColor, brushSize, configBrushStyles, isEraser]);

  useEffect(() => {
    if (drawings.length > 0) {
      draw(drawings, drawings.length - 1, canvasRef.current);
      setCurrentStep(drawings.length - 1);
    }
  }, [drawings]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setCurrentPoints([{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]);
    setIsDrawing(true);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) {
      return;
    }
    ctxRef.current?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current?.stroke();

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
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
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
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();

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
      draw(drawings, prevStep, canvasRef.current);
      setCurrentStep(prevStep);
    }

    //Set the  tool to pencil if the the currentStep will be negative (nothing to draw)
    if (prevStep < 0 && isEraser) {
      dispatch(switchTool("pencil"));
    }
  };

  const handleRedo = () => {
    const nextStep = currentStep + 1;
    if (nextStep < drawings.length) {
      draw(drawings, nextStep, canvasRef.current);
      setCurrentStep(nextStep);
    }
  };

  const clearCanvas = () => {
    const confirmation = confirm(
      "Are you sure you want to clear your drawings?"
    );
    if (confirmation && canvasRef.current) {
      ctxRef.current?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      setCurrentStep(-1);
      dispatch(resetDrawings());
    }
  };

  const checkIfOnlyClicked = () => {
    // Checking if it's just a click
    if (ctxRef.current && currentPoints.length === 1) {
      const { x, y } = currentPoints[0];
      ctxRef.current.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
      ctxRef.current.fill();
    }
  };

  const storeDrawing = () => {
    if (currentPoints.length > 0 && ctxRef.current) {
      const drawing = {
        color: ctxRef.current.strokeStyle,
        lineWidth: ctxRef.current.lineWidth,
        points: currentPoints,
        globalCompositeOperation: ctxRef.current.globalCompositeOperation,
      };

      if (currentStep < drawings.length - 1) {
        dispatch(addDrawingAndSplice({ drawing, index: currentStep }));
      } else {
        dispatch(addDrawing(drawing));
      }
      setCurrentStep((prev) => prev + 1);
      setCurrentPoints([]);
    }
  };

  return (
    <div className="h-svh w-full flex flex-col justify-center gap-4 px-8 py-4">
      <Tools
        canvas={canvasRef.current}
        isUndoDisabled={isUndoDisabled}
        isRedoDisabled={isRedoDisabled}
        isEraserDisabled={currentStep < 0}
        onClear={clearCanvas}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <div className="w-full h-full flex justify-center">
        <canvas
          ref={canvasRef}
          className="border rounded-lg"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </div>
  );
}
