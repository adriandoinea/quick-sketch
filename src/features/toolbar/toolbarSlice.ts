import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToolbarState {
  tool: "pencil" | "eraser";
  brushSize: number;
  brushColor: string;
}

const initialState: ToolbarState = {
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
      return { ...state, tool: action.payload };
    },
    changeBrushSize: (state: ToolbarState, action: PayloadAction<number>) => {
      return { ...state, brushSize: action.payload };
    },

    changeBrushColor: (state: ToolbarState, action: PayloadAction<string>) => {
      return { ...state, brushColor: action.payload };
    },
  },
});

export const { switchTool, changeBrushSize, changeBrushColor } =
  toolbarSlice.actions;
export default toolbarSlice.reducer;
