import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPointAlreadyExisting(
  x: number,
  y: number,
  arr: { x: number; y: number }[]
) {
  return arr.some((elem) => elem.x === x && elem.y === y);
}
