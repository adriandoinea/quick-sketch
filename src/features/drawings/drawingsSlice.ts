import { Line } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/react";

const initialState: Line[] = localStorage.getItem("drawings")
  ? JSON.parse(localStorage.getItem("drawings")!)
  : [];

const drawingsSlice = createSlice({
  name: "drawings",
  initialState,
  reducers: {
    addDrawing: (state, action: PayloadAction<Line>) => {
      const newDrawing = [...state, action.payload];
      localStorage.setItem("drawings", JSON.stringify(newDrawing));
      return newDrawing;
    },
    addDrawingAndSplice: (
      state,
      action: PayloadAction<{ drawing: Line; index: number }>
    ) => {
      const { drawing, index } = action.payload;
      const tempDrawings = [...state];
      tempDrawings.splice(index + 1);
      tempDrawings.push(drawing);
      localStorage.setItem("drawings", JSON.stringify(tempDrawings));
      return tempDrawings;
    },
    resetDrawings: () => {
      localStorage.setItem("drawings", JSON.stringify([]));
      return [];
    },
  },
});

export const { addDrawing, addDrawingAndSplice, resetDrawings } =
  drawingsSlice.actions;
export default drawingsSlice.reducer;
