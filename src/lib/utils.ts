import { Line } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function draw(
  drawings: Line[],
  step: number,
  canvas: HTMLCanvasElement | null
) {
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  const currentConfig = {
    color: ctx.strokeStyle,
    lineWidth: ctx.lineWidth,
    globalCompositeOperation: ctx.globalCompositeOperation,
  };

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i <= step; i++) {
    ctx.beginPath();
    const drawing = drawings[i];
    ctx.strokeStyle = drawing.color;
    ctx.fillStyle = drawing.color;
    ctx.lineWidth = drawing.lineWidth;
    ctx.globalCompositeOperation = drawing.globalCompositeOperation as
      | "source-over"
      | "destination-out";

    //Checking if it's just a single point
    if (drawing.points.length === 1) {
      const { x, y } = drawing.points[0];
      ctx.arc(x, y, drawing.lineWidth / 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      for (const point of drawing.points) {
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }
  }

  ctx.strokeStyle = currentConfig.color;
  ctx.fillStyle = currentConfig.color;
  ctx.lineWidth = currentConfig.lineWidth;
  ctx.globalCompositeOperation = currentConfig.globalCompositeOperation;
}
