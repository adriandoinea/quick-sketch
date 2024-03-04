export interface Line {
  points: { x: number; y: number }[];
  color: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  globalCompositeOperation: string;
}

export interface Drawings {
  lines: Line[];
  currentStep: number;
}
