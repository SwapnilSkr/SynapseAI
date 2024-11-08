import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { userRegisterAction } from "../reducers/userReducer";

interface UserState {
  loading?: boolean;
  user?: any;
  appErr?: string | undefined;
  serverErr?: string | undefined;
}

const localStorageUser = localStorage.getItem("userInfo");
const userInfo = localStorageUser ? JSON.parse(localStorageUser) : null;

const initialState: UserState = {
  user: userInfo,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userRegisterAction.pending, (state) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(userRegisterAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(userRegisterAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
    });
  },
});

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
