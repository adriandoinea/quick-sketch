export interface Line {
  points: { x: number; y: number }[];
  color: string;
  size: number;
}

export type Drawings = Record<
  "previous" | "current" | "future",
  Record<number, Line>
>;
