import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { RutinaType } from "../types/apiTypes";
import * as env_constants from '@/constants/env.config';

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
  void, // No parameters required here
  { state: RootState }
>("rutines/getRutinesEntrenador", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.user?.token;

  const response = await fetch(
    env_constants.EXPO_PUBLIC_API_URL + "/rutines/rutinesEntrenador",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.error ?? "Failed to fetch rutines");
  }
  return data.data;
});

//Delete rutina
export const deleteRutina = createAsyncThunk<
  number, // Expected result type
  { id: number }, // Parameters type
  { state: RootState }
>("rutines/deleteRutina", async ({ id }, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.user?.token;

  const response = await fetch(`${env_constants.EXPO_PUBLIC_API_URL}/rutines/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.error ?? "Failed to delete rutina");
  }
  return id;
});

// Create rutina
export const createRutina = createAsyncThunk<
  RutinaType,
  { rutina: RutinaType }, // Parameters type
  { state: RootState }
>("rutines/createRutina", async ({ rutina }, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.user?.token;
  const response = await fetch(env_constants.EXPO_PUBLIC_API_URL + "/rutines", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rutina),
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.error ?? "Failed to create rutina");
  }
  return data.data;
});

// update rutina
export const updateRutina = createAsyncThunk<
  RutinaType,
  { rutina: RutinaType }, // Parameters type
  { state: RootState }
>("rutines/updateRutina", async ({ rutina }, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.user?.token;
  const response = await fetch(
    env_constants.EXPO_PUBLIC_API_URL + "/rutines/" + rutina.id,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rutina),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.error ?? "Failed to create rutina");
  }
  return data.data;
});

const rutinesSlice = createSlice({
  name: "rutines",
  initialState,
  reducers: {
    deleteRutinesSlice: (state) => {
      state.rutines = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRutinesEntrenador.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        getRutinesEntrenador.fulfilled,
        (state, action: PayloadAction<RutinaType[]>) => {
          state.rutines = action.payload; // Update the rutines array
          state.status = "succeeded";
        }
      )
      .addCase(getRutinesEntrenador.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete rutina
      .addCase(
        deleteRutina.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.rutines = state.rutines.filter(
            (rutina) => rutina.id !== action.payload
          );
          state.error = null;
        }
      )
      .addCase(deleteRutina.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(deleteRutina.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      //Create rutina
      .addCase(
        createRutina.fulfilled,
        (state, action: PayloadAction<RutinaType>) => {
          state.status = "succeeded";
          state.rutines.push(action.payload);
          state.error = null;
        }
      )
      .addCase(createRutina.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(createRutina.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      //Update Rutina
      .addCase(
        updateRutina.fulfilled,
        (state, action: PayloadAction<RutinaType>) => {
          state.status = "succeeded";
          const index = state.rutines.findIndex(
            (rutina) => rutina.id === action.payload.id
          );
          if (index !== -1) {
            state.rutines[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(updateRutina.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(updateRutina.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectAllRutines = (state: RootState) => state.rutines.rutines;

export const selectRutinaById = (state: RootState, rutinaID: number) =>
  state.rutines.rutines.find((rutina) => rutina.id === rutinaID);

export const selectRutinesStatus = (state: RootState) => state.rutines.status;
export const selectRutinesError = (state: RootState) => state.rutines.error;
export const { deleteRutinesSlice } = rutinesSlice.actions;
// Export the reducer
export default rutinesSlice.reducer;
