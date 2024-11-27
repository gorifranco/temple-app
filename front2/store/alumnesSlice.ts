import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/index";
import { actions, status, AlumneType } from "@/types/apiTypes";

interface AlumnesState {
  alumnes: AlumneType[];
  errors: { [key in actions]?: string | null };
  actionsStatus: { [key in actions]?: status };
}

const initialState: AlumnesState = {
  alumnes: [],
  errors: {
    [actions.index]: null,
    [actions.create]: null,
    [actions.delete]: null,
    [actions.assign]: null,
    [actions.acabar]: null,
  },
  actionsStatus: {
    [actions.index]: status.idle,
    [actions.create]: status.idle,
    [actions.delete]: status.idle,
    [actions.assign]: status.idle,
    [actions.acabar]: status.idle,
  },
};

// Fetch alumnes API
export const getAlumnes = createAsyncThunk<
  AlumneType[], // Expected result type
  void, // No parameters required here
  { state: RootState }
>("entrenador/getAlumnes", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.user?.token;

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/entrenador/alumnes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData?.error ?? "Failed to fetch alumnes");
    }

    const data = await response.json();
    console.log('fetch alumnes')
    console.log(data.data)
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.message ?? "Failed to fetch alumnes");
  }
});

//create alumne fictici
export const createAlumneFictici = createAsyncThunk<
  AlumneType, // Expected result type
  { nom: string }, // Parameters type
  { state: RootState }
>(
  "entrenador/createAlumneFictici",
  async ({ nom }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/entrenador/usuarisFicticis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ nom }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData?.error ?? "Failed to fetch alumnes");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message ?? "Failed to fetch alumnes");
    }
  }
);

//Delete alumne
export const expulsarAlumne = createAsyncThunk<
  number, // Expected result type
  { id: number }, // Parameters type
  { state: RootState }
>(
  "entrenador/expulsarAlumne",
  async ({ id }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/entrenador/alumnes/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData?.error ?? "Failed to delete alumne");
    }

    const data = await response.json();
    return id;
  }
);

// Assign rutina
export const assignarRutina = createAsyncThunk<
  { rutinaID: number; alumneID: number }, // Expected result type
  { rutinaID: number; alumneID: number }, // Parameters type
  { state: RootState }
>(
  "entrenador/assignarRutina",
  async ({ rutinaID, alumneID }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/entrenador/assignarRutina`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ rutinaID, alumneID }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData?.error ?? "Failed to assign rutina");
    }

    const data = await response.json();
    return { rutinaID, alumneID };
  }
);

// Acabar rutina
export const acabarRutina = createAsyncThunk<
  {UsuariID: number}, // Expected result type
  {UsuariID: number}, // Parameters type
  { state: RootState }
>(
  "entrenador/acabarRutina",
  async (UsuariID, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/entrenador/acabarRutina`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ UsuariID }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData?.error ?? "Failed to assign rutina");
    }

    return UsuariID;
  }
);

const alumnesSlice = createSlice({
  name: "alumnes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get alumnes
      .addCase(getAlumnes.pending, (state) => {
        state.actionsStatus[actions.index] = status.pending;
      })
      .addCase(
        getAlumnes.fulfilled,
        (state, action: PayloadAction<AlumneType[]>) => {
          state.actionsStatus[actions.index] = status.succeeded;
          state.alumnes = action.payload;
        }
      )
      .addCase(getAlumnes.rejected, (state, action) => {
        state.actionsStatus[actions.index] = status.failed;
        state.errors[actions.index] = action.payload as string;
      })
      // Create alumne
      .addCase(
        createAlumneFictici.fulfilled,
        (state, action: PayloadAction<AlumneType>) => {
          state.actionsStatus[actions.create] = status.succeeded;
          state.alumnes.push(action.payload);
        }
      )
      .addCase(createAlumneFictici.pending, (state) => {
        state.actionsStatus[actions.create] = status.pending;
      })
      .addCase(createAlumneFictici.rejected, (state, action) => {
        state.actionsStatus[actions.create] = status.failed;
        state.errors[actions.create] = action.payload as string;
      })
      // Delete alumne
      .addCase(
        expulsarAlumne.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.actionsStatus[actions.delete] = status.succeeded;
          state.alumnes = state.alumnes.filter(
            (alumne) => alumne.id !== action.payload
          );
        }
      )
      .addCase(expulsarAlumne.pending, (state) => {
        state.actionsStatus[actions.delete] = status.pending;
      })
      // Assign rutina
      .addCase(
        assignarRutina.fulfilled,
        (
          state,
          action: PayloadAction<{ rutinaID: number; alumneID: number }>
        ) => {
          state.actionsStatus[actions.assign] = status.succeeded;
          const alumne = state.alumnes.find(
            (alumne) => alumne.id === action.payload.alumneID
          );
          if (alumne) {
            alumne.rutinaActual = action.payload.rutinaID;
          }
        }
      )
      .addCase(assignarRutina.pending, (state) => {
        state.actionsStatus[actions.assign] = status.pending;
      })
      .addCase(assignarRutina.rejected, (state, action) => {
        state.actionsStatus[actions.assign] = status.failed;
        state.errors[actions.assign] = action.payload as string;
      })
      // Acabar rutina
      .addCase(
        acabarRutina.fulfilled,
        (state, action: PayloadAction<{UsuariID: number}>) => {
          state.actionsStatus[actions.acabar] = status.succeeded;
          const alumne = state.alumnes.find(
            (alumne) => alumne.id === action.payload.UsuariID
          );
          if (alumne) {
            alumne.rutinaActual = null;
          }
        }
      )
      .addCase(acabarRutina.pending, (state) => {
        state.actionsStatus[actions.acabar] = status.pending;
      })
      .addCase(acabarRutina.rejected, (state, action) => {
        state.actionsStatus[actions.acabar] = status.failed;
        state.errors[actions.acabar] = action.payload as string;
      });
  },
});

export const selectAllAlumnes = (state: RootState) => state.alumnes.alumnes;

export const selectAlumneByID = (state: RootState, alumneID: number) =>
  state.alumnes.alumnes.find((alumne) => alumne.id === alumneID);

export const selectAlumnesStatus = (state: RootState) => state.alumnes.actionsStatus;
export const selectAlumnesError = (state: RootState) => state.alumnes.errors;

export default alumnesSlice.reducer;
