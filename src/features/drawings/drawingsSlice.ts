import { Line } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/react";

const initialState: Line[] = [];

const drawingsSlice = createSlice({
  name: "drawings",
  initialState,
  reducers: {
    addDrawing: (state, action: PayloadAction<Line>) => {
      return [...state, action.payload];
    },
    addDrawingAndSplice: (
      state,
      action: PayloadAction<{ drawing: Line; index: number }>
    ) => {
      const { drawing, index } = action.payload;
      const temp = [...state];
      temp.splice(index + 1);
      temp.push(drawing);

      return temp;
    },
    resetDrawings: () => [],
  },
});

export const { addDrawing, addDrawingAndSplice, resetDrawings } =
  drawingsSlice.actions;
export default drawingsSlice.reducer;
