import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlumneType } from "../types/apiTypes";
import { api } from "@/app/api";
import { RootState } from ".";

interface AlumnesState {
  alumnes: AlumneType[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  action: "get" | "create" | "delete" | "assign" | "acabar" | "";
}

const initialState: AlumnesState = {
  alumnes: [],
  status: "idle",
  error: null,
  action: "",
};

//Fetch alumnes api
export const getAlumnes = createAsyncThunk<
  AlumneType[], // Expected result type
  void, // No parameters required here
  { state: RootState }
>("entrenador/getAlumnes", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/entrenador/alumnes");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message ?? "Failed to fetch rutines");
  }
});

//create alumne fictici
export const createAlumneFictici = createAsyncThunk<
  AlumneType, // Expected result type
  { nom: string }, // Parameters type
  { state: RootState }
>("entrenador/createAlumneFictici", async ({ nom }, { rejectWithValue }) => {
  const response = await api.post("/entrenador/usuarisFicticis", { nom });
  return response.status == 200
    ? response.data.data
    : rejectWithValue(response.data.error ?? "Failed to create alumne");
});

//Delete alumne
export const expulsarAlumne = createAsyncThunk<
  number, // Expected result type
  { id: number }, // Parameters type
  { state: RootState }
>("entrenador/expulsarAlumne", async ({ id }, { rejectWithValue }) => {
  const response = await api.delete(`/entrenador/alumnes/${id}`);
  return response.status == 200
    ? id
    : rejectWithValue(response.data.error ?? "Failed to delete alumne");
});

// Assign rutina
export const assignarRutina = createAsyncThunk<
  { rutinaID: number; alumneID: number }, // Expected result type
  { rutinaID: number; alumneID: number }, // Parameters type
  { state: RootState }
>(
  "entrenador/assignarRutina",
  async ({ rutinaID, alumneID }, { rejectWithValue }) => {
    const response = await api.post(`/entrenador/assignarRutina`, {
      rutinaID: rutinaID,
      alumneID: alumneID,
    });
    return response.status == 200
      ? { rutinaID: rutinaID, alumneID: alumneID }
      : rejectWithValue(response.data.error ?? "Failed to assign rutina");
  }
);

// Acabar rutina
export const acabarRutina = createAsyncThunk<
  number, // Expected result type
  { usuariID: number }, // Parameters type
  { state: RootState }
>("entrenador/acabarRutina", async ({ usuariID }, { rejectWithValue }) => {
  const response = await api.post(`/entrenador/acabarRutina`, {
    usuariID: usuariID,
  });
  return response.status == 200
    ? usuariID
    : rejectWithValue(response.data.error ?? "Failed to assign rutina");
});

const alumnesSlice = createSlice({
  name: "alumnes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get alumnes
      .addCase(getAlumnes.pending, (state) => {
        state.status = "pending";
        state.action = "get";
      })
      .addCase(
        getAlumnes.fulfilled,
        (state, action: PayloadAction<AlumneType[]>) => {
          state.status = "succeeded";
          state.alumnes = action.payload;
          state.action = "get";
        }
      )
      .addCase(getAlumnes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.action = "get";
      })
      // Create alumne
      .addCase(
        createAlumneFictici.fulfilled,
        (state, action: PayloadAction<AlumneType>) => {
          state.status = "succeeded";
          state.alumnes.push(action.payload);
          state.action = "create";
        }
      )
      .addCase(createAlumneFictici.pending, (state) => {
        state.status = "pending";
        state.action = "create";
      })
      .addCase(createAlumneFictici.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.action = "create";
      })
      // Delete alumne
      .addCase(
        expulsarAlumne.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.alumnes = state.alumnes.filter(
            (alumne) => alumne.ID !== action.payload
          );
          state.action = "delete";
          state.error = null;
        }
      )
      .addCase(expulsarAlumne.pending, (state) => {
        state.status = "pending";
        state.action = "delete";
        state.error = null;
      })
      // Assign rutina
      .addCase(
        assignarRutina.fulfilled,
        (
          state,
          action: PayloadAction<{ rutinaID: number; alumneID: number }>
        ) => {
          state.status = "succeeded";
          const alumne = state.alumnes.find(
            (alumne) => alumne.ID === action.payload.alumneID
          );
          if (alumne) {
            alumne.RutinaActual = action.payload.rutinaID;
          }
          state.action = "assign";
          state.error = null;
        }
      )
      .addCase(assignarRutina.pending, (state) => {
        state.status = "pending";
        state.action = "assign";
        state.error = null;
      })
      .addCase(assignarRutina.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.action = "assign";
      })
      // Acabar rutina
      .addCase(
        acabarRutina.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          const alumne = state.alumnes.find(
            (alumne) => alumne.ID === action.payload
          );
          if (alumne) {
            alumne.RutinaActual = null;
          }
          state.action = "acabar";
          state.error = null;
        }
      )
      .addCase(acabarRutina.pending, (state) => {
        state.status = "pending";
        state.action = "acabar";
        state.error = null;
      })
      .addCase(acabarRutina.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.action = "acabar";
        state.error = null;
      });
  },
});

export const selectAllAlumnes = (state: RootState) => state.alumnes.alumnes;

export const selectAlumneByID = (state: RootState, alumneID: number) =>
  state.alumnes.alumnes.find((alumne) => alumne.ID === alumneID);

export const selectAlumnesStatus = (state: RootState) => state.alumnes.status;
export const selectAlumnesError = (state: RootState) => state.alumnes.error;
export const selectAlumnesAction = (state: RootState) => state.alumnes.action;

export default alumnesSlice.reducer;
