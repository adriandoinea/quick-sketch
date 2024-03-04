import { Drawings, Line } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/react";

const initialState: Drawings = localStorage.getItem("drawings")
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
    uploadDrawings: (_, action: PayloadAction<Drawings>) => {
      localStorage.setItem("drawings", JSON.stringify(action.payload));
      return action.payload;
    },
    changeStep: (state, action: PayloadAction<number>) => {
      const newState = { ...state, currentStep: action.payload };
      localStorage.setItem("drawings", JSON.stringify(newState));
      return newState;
    },
  },
});

export const {
  addDrawing,
  addDrawingAndSplice,
  resetDrawings,
  uploadDrawings,
  changeStep,
} = drawingsSlice.actions;
export default drawingsSlice.reducer;
