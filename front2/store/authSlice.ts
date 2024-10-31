import { api } from "@/app/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface User {
  token: string;
  nom: string;
  email: string;
  tipusUsuari: string;
  codiEntrenador: string | null;
}
interface authState {
  user: User | null;
  status: "idle" | "pending" | "succeeded" | "failed";
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
  {email: string; password: string}, // Parameters type
  { state: RootState }
>("login", async ({ email, password }, { rejectWithValue }) => {
  const response = await api.post("/login", { email, password });
  return response.status == 200
    ? response.data.data
    : rejectWithValue(response.data.error ?? "Failed to create alumne");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
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

export const selectUser = (state: RootState) => state.auth.user;

export const selectUserStatus = (state: RootState) => state.auth.status;
export const selectUserError = (state: RootState) => state.auth.error;
// Export the reducer
export default authSlice.reducer;
