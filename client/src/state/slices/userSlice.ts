import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import {
  getUserInSessionAction,
  loginUserAction,
  logOutAction,
  resendVerificationEmailAction,
  userRegisterAction,
  verifyEmailAction,
} from "../reducers/userReducer";

interface UserState {
  loading?: boolean;
  user?: {
    id: string;
    verified: boolean;
    resentEmail?: boolean;
  };
  verifyMessage?: string;
  appErr?: string | undefined;
  verifyErr?: string | undefined;
  serverErr?: string | undefined;
}

const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // userRegisterAction
    builder.addCase(userRegisterAction.pending, (state) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(userRegisterAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(userRegisterAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
    });
    // resendVerificationEmailAction
    builder.addCase(resendVerificationEmailAction.pending, (state) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(
      resendVerificationEmailAction.fulfilled,
      (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
        state.appErr = undefined;
        state.serverErr = undefined;
      }
    );
    builder.addCase(resendVerificationEmailAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
    });
    // getUserInSessionAction
    builder.addCase(getUserInSessionAction.pending, (state) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getUserInSessionAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(getUserInSessionAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
    });
    // loginAction
    builder.addCase(loginUserAction.pending, (state) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
    });
    //verifyEmailAction
    builder.addCase(verifyEmailAction.pending, (state) => {
      state.loading = true;
      state.verifyErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(verifyEmailAction.fulfilled, (state, action) => {
      state.loading = false;
      state.verifyMessage = action.payload?.message;
      state.verifyErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(verifyEmailAction.rejected, (state, action) => {
      state.loading = false;
      state.verifyErr = action.payload?.message;
      state.serverErr = action.error?.message;
    });
    //logoutAction
    builder.addCase(logOutAction.pending, (state) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logOutAction.fulfilled, (state) => {
      state.loading = false;
      state.user = undefined;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logOutAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action.payload?.message;
      state.serverErr = action.error?.message;
    });
  },
});

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
