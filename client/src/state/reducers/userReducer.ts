import { User } from "@/types/entity";
import { authResponse } from "@/types/response";
import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export const userRegisterAction = createAsyncThunk<
  authResponse,
  User,
  { rejectValue: SerializedError }
>("users/register", async (user, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<authResponse>(
      `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/register`,
      user,
      {
        withCredentials: true,
      }
    );
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

export const resendVerificationEmailAction = createAsyncThunk<
  authResponse,
  undefined,
  { rejectValue: SerializedError }
>("users/resend-email", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<authResponse>(
      `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/resend-verification-email`,
      {
        emptyPostRequest: true,
      },
      {
        withCredentials: true,
      }
    );
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

export const getUserInSessionAction = createAsyncThunk<
  authResponse,
  undefined,
  { rejectValue: SerializedError }
>("users/get-user-in-session", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<authResponse>(
      `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/get-user-in-session`,
      {
        withCredentials: true,
      }
    );
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

export const loginUserAction = createAsyncThunk<
  authResponse,
  User,
  { rejectValue: SerializedError }
>("users/login", async (user, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<authResponse>(
      `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/login`,
      user,
      {
        withCredentials: true,
      }
    );
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

export const verifyEmailAction = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: SerializedError }
>("users/verify-email", async (token, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<{ message: string }>(
      `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/verify-email?token=${token}`,
      {
        withCredentials: true,
      }
    );
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

export const logOutAction = createAsyncThunk<
  { message: string },
  undefined,
  { rejectValue: SerializedError }
>("users/logout", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<{ message: string }>(
      `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/logout`,
      {
        withCredentials: true,
      }
    );
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
