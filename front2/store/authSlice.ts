import { api } from "@/app/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface User {
  token: string;
  nom: string;
  email: string;
  tipusUsuari: string;
  codiEntrenador: string|null;
}
interface authState {
  user: User | null;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string|null;
}

const initialState: authState = {
  user: null,
  status: "idle",
  error: null,
};

export const loginRedux = createAsyncThunk<
  User,
  { email: string; password: string },
  { state: RootState }
>("auth/login", async ({ email, password }, { dispatch, getState }) => {
  const response = await api.post("/login", { email, password });
  dispatch(loginRedux(response.data.data));
  return response.data.data;
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
  }
});

export const selectUser = (state: RootState) => state.auth.user;

export const selectUserStatus = (state: RootState) => state.auth.status
export const selectUserError = (state: RootState) => state.auth.error
// Export the reducer
export default authSlice.reducer;
