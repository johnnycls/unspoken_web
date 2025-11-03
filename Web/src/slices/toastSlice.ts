import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastMessage = {
  severity: "success" | "info" | "warn" | "error";
  summary: string;
};

type ToastState = {
  message: ToastMessage | null;
};

const initialState: ToastState = {
  message: null,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastMessage>) => {
      state.message = action.payload;
    },
  },
});

export const { showToast } = toastSlice.actions;
export default toastSlice.reducer;
