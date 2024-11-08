import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface SerializedError {
  response?: any;
  message?: string;
  name?: string;
  stack?: string;
  code?: string;
}

export const userRegisterAction = createAsyncThunk<
  any,
  any,
  { rejectValue: SerializedError }
>("users/register", async (user, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<any>(
      `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/register`,
      user
    );
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    const axiosError = error as AxiosError<SerializedError>;
    if (axiosError.response) {
      return rejectWithValue(axiosError.response.data);
    } else {
      throw error;
    }
  }
});
