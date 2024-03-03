import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToolbarState {
  tool: "pencil" | "eraser";
  brushSize: number;
  brushColor: string;
}

const initialState: ToolbarState = localStorage.getItem("drawingTools")
  ? JSON.parse(localStorage.getItem("drawingTools")!)
  : {
      tool: "pencil",
      brushSize: 10,
      brushColor: "#000000",
    };

const toolbarSlice = createSlice({
  name: "toolbar",
  initialState,
  reducers: {
    switchTool: (
      state: ToolbarState,
      action: PayloadAction<"pencil" | "eraser">
    ) => {
      const newConfig = { ...state, tool: action.payload };
      localStorage.setItem("drawingTools", JSON.stringify(newConfig));
      return newConfig;
    },
    changeBrushSize: (state: ToolbarState, action: PayloadAction<number>) => {
      const newConfig = { ...state, brushSize: action.payload };
      localStorage.setItem("drawingTools", JSON.stringify(newConfig));
      return newConfig;
    },

    changeBrushColor: (state: ToolbarState, action: PayloadAction<string>) => {
      const newConfig = { ...state, brushColor: action.payload };
      localStorage.setItem("drawingTools", JSON.stringify(newConfig));
      return newConfig;
    },
  },
});

export const { switchTool, changeBrushSize, changeBrushColor } =
  toolbarSlice.actions;
export default toolbarSlice.reducer;
