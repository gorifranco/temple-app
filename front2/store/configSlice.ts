import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/app/api";
import { RootState } from ".";
import { ConfigType, HorariType } from "../types/apiTypes";

interface ConfigState {
  DuracioSessions: number|null;
  MaxAlumnesPerSessio: number|null;
  Horaris: HorariType[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  action: "get" | "";
}

const initialState: ConfigState = {
  DuracioSessions: null,
  MaxAlumnesPerSessio: null,
  Horaris: [],
  status: "idle",
  error: null,
  action: "",
};

// Fetch config api
export const getConfig = createAsyncThunk<
  ConfigType, // Expected result type
  void, // No parameters required here
  { state: RootState }
>("entrenador/getConfig", async (_, { rejectWithValue }) => {
  const response = await api.get("/configuracioEntrenador");
  return response.status == 200
    ? response.data.data
    : rejectWithValue(response.data.error ?? "Failed to create alumne");
});

// Guardar configuració
export const guardarConfiguracio = createAsyncThunk<
  {duracioSessions: number; maxAlumnesPerSessio: number}, // Expected result type
  { duracioSessions: number; maxAlumnesPerSessio: number }, // Parameters type
  { state: RootState }
>("entrenador/guardarConfiguracio", async ({ duracioSessions, maxAlumnesPerSessio }, { rejectWithValue }) => {
  const response = await api.post("/entrenador/guardarConfiguracioEntrenador", { duracioSessions, maxAlumnesPerSessio });
  return response.status == 200
    ? {duracioSessions, maxAlumnesPerSessio}
    : rejectWithValue(response.data.error ?? "Failed to create alumne");
});

export const guardarHoraris = createAsyncThunk<
  HorariType[], // Expected result type
  { horari: HorariType[] }, // Parameters type
  { state: RootState }
>("entrenador/guardarHorari", async ({ horari }, { rejectWithValue }) => {
  const response = await api.post("/entrenador/guardarHorariEntrenador", horari);
  return response.status == 200
    ? horari
    : rejectWithValue(response.data.error ?? "Failed to create alumne");
});

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConfig.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        getConfig.fulfilled,
        (state, action: PayloadAction<ConfigType>) => {
          state.status = "succeeded";
          state.DuracioSessions = action.payload.DuracioSessions;
          state.MaxAlumnesPerSessio = action.payload.MaxAlumnesPerSessio;
          state.Horaris = action.payload.Horaris;
        }
      )
      .addCase(getConfig.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(guardarConfiguracio.fulfilled, (state, action: PayloadAction<{duracioSessions: number; maxAlumnesPerSessio: number}>) => {
        state.status = "succeeded";
        state.DuracioSessions = action.payload.duracioSessions;
        state.MaxAlumnesPerSessio = action.payload.maxAlumnesPerSessio;
        state.error = null;
      })
      .addCase(guardarConfiguracio.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(guardarConfiguracio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(guardarHoraris.fulfilled, (state, action: PayloadAction<HorariType[]>) => {
        state.status = "succeeded";
        state.Horaris = action.payload;
        state.error = null;
      })
      .addCase(guardarHoraris.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(guardarHoraris.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectConfig = (state: RootState) => state.config
export const selectConfigStatus = (state: RootState) => state.config.status;
export const selectConfigError = (state: RootState) => state.config.error;

export default configSlice.reducer;
