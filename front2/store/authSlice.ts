import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface User {
  id: number;
  token: string;
  nom: string;
  email: string;
  tipusUsuari: string;
  codiEntrenador: string | null;
}
interface authState {
  user: User | null;  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: authState = {
  user: null,
  status: "idle",
  error: null,
};

// Login api
export const loginRedux = createAsyncThunk<
  User, // Expected result type
  { email: string; password: string }, // Parameters type
  { state: RootState }
>("login", async ({ email, password }, { rejectWithValue }) => {
  try {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/login`)
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.error ?? "Failed to login");
    }
    return data.data;
  } catch (error) {
    return rejectWithValue("Network error or unexpected error occurred");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutRedux: (state) => {
      state.status = "idle";
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginRedux.fulfilled, (state, action) => {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = "";
    });
    builder.addCase(loginRedux.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(loginRedux.rejected, (state, action) => {
      state.user = null;
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { logoutRedux } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;

export const selectUserStatus = (state: RootState) => state.auth.status;
export const selectUserError = (state: RootState) => state.auth.error;
// Export the reducer
export default authSlice.reducer;
