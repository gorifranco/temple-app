import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { ConfigType, HorariType, ReducedConfigType } from "../types/apiTypes";
import * as env_constants from '@/constants/env.config';

interface ConfigState {
  duracioSessions: number;
  maxAlumnesPerSessio: number;
  horaris: HorariType[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  action: "get" | "";
}

const initialState: ConfigState = {
  duracioSessions: 0,
  maxAlumnesPerSessio: 0,
  horaris: [],
  status: "idle",
  error: null,
  action: "",
};

// Fetch config api
export const getConfig = createAsyncThunk<
  ConfigType, // Expected result type
  void, // No parameters required here
  { state: RootState }
>("entrenador/getConfig", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.user?.token;

  const response = await fetch(
    env_constants.EXPO_PUBLIC_API_URL + "/configuracioEntrenador",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.error ?? "Failed to fetch config");
  }
  return data.data;
});

// Guardar configuració
export const guardarConfiguracio = createAsyncThunk<
  ReducedConfigType, // Expected result type
  { config: ReducedConfigType }, // Parameters type
  { state: RootState }
>(
  "entrenador/guardarConfiguracio",
  async (config, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;

    const response = await fetch(
      `${env_constants.EXPO_PUBLIC_API_URL}/entrenador/guardarConfiguracioEntrenador`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(config.config),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData?.error ?? "Failed to update config");
    }
    return config.config;
  }
);

export const guardarHoraris = createAsyncThunk<
  HorariType[], // Expected result type
  { horari: HorariType[] }, // Parameters type
  { state: RootState }
>(
  "entrenador/guardarHorari",
  async ({ horari }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;

    const response = await fetch(
      `${env_constants.EXPO_PUBLIC_API_URL}/entrenador/guardarHorariEntrenador`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(horari),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData?.error ?? "Failed to create alumne");
    }
    return horari;
  }
);

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
          state.duracioSessions = action.payload.duracioSessions;
          state.maxAlumnesPerSessio = action.payload.maxAlumnesPerSessio;
          state.horaris = action.payload.horaris;
        }
      )
      .addCase(getConfig.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        guardarConfiguracio.fulfilled,
        (
          state,
          action
        ) => {
          state.status = "succeeded";
          state.duracioSessions = action.payload.duracioSessions ?? null;
          state.maxAlumnesPerSessio = action.payload.maxAlumnesPerSessio ?? null;
          state.error = null;
        }
      )
      .addCase(guardarConfiguracio.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(guardarConfiguracio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        guardarHoraris.fulfilled,
        (state, action: PayloadAction<HorariType[]>) => {
          state.status = "succeeded";
          state.horaris = action.payload;
          state.error = null;
        }
      )
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

export const selectConfig = (state: RootState) => state.config;
export const selectConfigStatus = (state: RootState) => state.config.status;
export const selectConfigError = (state: RootState) => state.config.error;

export default configSlice.reducer;
