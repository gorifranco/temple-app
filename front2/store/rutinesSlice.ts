import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { api } from "@/app/api";
import { RutinaType } from "../types/apiTypes";

interface RutinesState {
  rutines: RutinaType[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RutinesState = {
  rutines: [],
  status: "idle",
  error: null,
};

// Fetch rutines api
export const getRutinesEntrenador = createAsyncThunk<
  RutinaType[], // Expected result type
  void,         // No parameters required here
  { state: RootState }
>("rutines/getRutinesEntrenador", async (_, { rejectWithValue }) => {
    const response = await api.get("/rutines");
    return response.status == 200 ? response.data.data : rejectWithValue(response.data.error ?? "Failed to create alumne");
});

//Delete rutina
export const deleteRutina = createAsyncThunk<
  number, // Expected result type
  { id: number }, // Parameters type
  { state: RootState }
>("rutines/deleteRutina", async ({ id }, { rejectWithValue }) => {
  const response = await api.delete(`/rutines/${id}`);
  return response.status == 200
    ? id
    : rejectWithValue(response.data.error ?? "Failed to delete rutina");
});

// Create rutina
export const createRutina = createAsyncThunk<
RutinaType,
{ rutina: RutinaType }, // Parameters type
{ state: RootState }
>("rutines/createRutina", async ({ rutina }, { rejectWithValue }) => {
  const response = await api.post("/rutines", rutina);
  return response.status == 200
    ? response.data.data
    : rejectWithValue(response.data.error ?? "Failed to create rutina");
});


const rutinesSlice = createSlice({
  name: "rutines",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRutinesEntrenador.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getRutinesEntrenador.fulfilled, (state, action: PayloadAction<RutinaType[]>) => {
        state.status = "succeeded";
        state.rutines = action.payload; // Update the rutines array
      })
      .addCase(getRutinesEntrenador.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Delete rutina
      .addCase(deleteRutina.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = "succeeded";
        state.rutines = state.rutines.filter(
          (rutina) => rutina.ID !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteRutina.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteRutina.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      //Create rutina
      .addCase(createRutina.fulfilled, (state, action: PayloadAction<RutinaType>) => {
        state.status = "succeeded";
        state.rutines.push(action.payload);
        state.error = null;
      })
      .addCase(createRutina.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(createRutina.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectAllRutines = (state: RootState) => state.rutines.rutines

export const selectRutinaById = (state: RootState, rutinaID: number) =>
  state.rutines.rutines.find(rutina => rutina.ID === rutinaID)

export const selectRutinesStatus = (state: RootState) => state.rutines.status
export const selectRutinesError = (state: RootState) => state.rutines.error
// Export the reducer
export default rutinesSlice.reducer;
