import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExerciciType } from "../types/apiTypes";
import { api } from "@/app/api";
import { RootState } from ".";

interface ExercicisState {
  exercicis: ExerciciType[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ExercicisState = {
  exercicis: [],
  status: "idle",
  error: null,
};

// Define the async thunk
export const getExercicis = createAsyncThunk<
  ExerciciType[], // Expected result type
  void, // No parameters required here
  { state: RootState }
>("entrenador/getExercicis", async (_, { rejectWithValue }) => {
    const response = await api.get("/exercicis");
    return response.status == 200 ? response.data.data : rejectWithValue(response.data.error ?? "Failed to create alumne");
});

const exercicisSlice = createSlice({
  name: "exercicis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExercicis.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        getExercicis.fulfilled,
        (state, action: PayloadAction<ExerciciType[]>) => {
          state.status = "succeeded";
          state.exercicis = action.payload;
        }
      )
      .addCase(getExercicis.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectExercicis = (state: RootState) =>
  state.exercicis.exercicis;
export const selectExerciciByID = (state: RootState, exerciciID: number) =>
  state.exercicis.exercicis.find((exercici) => exercici.ID === exerciciID);

export const selectExercicisStatus = (state: RootState) =>
  state.exercicis.status;
export const selectExercicisError = (state: RootState) => state.exercicis.error;

export default exercicisSlice.reducer;
