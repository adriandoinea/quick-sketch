import { Line } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/react";

const initialState: { lines: Line[]; currentStep: number } =
  localStorage.getItem("drawings")
    ? JSON.parse(localStorage.getItem("drawings")!)
    : { lines: [], currentStep: -1 };

const drawingsSlice = createSlice({
  name: "drawings",
  initialState,
  reducers: {
    addDrawing: (state, action: PayloadAction<Line>) => {
      const newDrawing = [...state.lines, action.payload];
      const currentStep = newDrawing.length - 1;
      const newState = { lines: newDrawing, currentStep };
      localStorage.setItem("drawings", JSON.stringify(newState));
      return newState;
    },
    addDrawingAndSplice: (state, action: PayloadAction<Line>) => {
      const drawing = action.payload;
      const tempDrawings = [...state.lines];
      tempDrawings.splice(state.currentStep + 1);
      tempDrawings.push(drawing);
      const newState = {
        lines: tempDrawings,
        currentStep: tempDrawings.length - 1,
      };
      localStorage.setItem("drawings", JSON.stringify(newState));
      return newState;
    },
    resetDrawings: () => {
      const newState = { lines: [], currentStep: -1 };
      localStorage.setItem("drawings", JSON.stringify(newState));
      return newState;
    },
    changeStep: (state, action: PayloadAction<number>) => {
      const newState = { ...state, currentStep: action.payload };
      localStorage.setItem("drawings", JSON.stringify(newState));
      return newState;
    },
  },
});

export const { addDrawing, addDrawingAndSplice, resetDrawings, changeStep } =
  drawingsSlice.actions;
export default drawingsSlice.reducer;
