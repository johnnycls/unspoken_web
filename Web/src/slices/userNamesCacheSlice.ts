import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserNamesCacheState {
  cache: { [email: string]: string };
}

const initialState: UserNamesCacheState = {
  cache: {},
};

const userNamesCacheSlice = createSlice({
  name: "userNamesCache",
  initialState,
  reducers: {
    addUserNames: (
      state,
      action: PayloadAction<{ [email: string]: string }>
    ) => {
      state.cache = { ...state.cache, ...action.payload };
    },
    clearUserNamesCache: (state) => {
      state.cache = {};
    },
  },
});

export const { addUserNames, clearUserNamesCache } =
  userNamesCacheSlice.actions;

export default userNamesCacheSlice.reducer;
