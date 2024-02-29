import { configureStore } from "@reduxjs/toolkit";
import toolbarReducer from "@/features/toolbar/toolbarSlice";
import drawingsReducer from "@/features/drawings/drawingsSlice";

export const store = configureStore({
  reducer: {
    toolbar: toolbarReducer,
    drawings: drawingsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
