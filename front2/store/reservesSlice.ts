import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { actions, ReservaType } from "@/types/apiTypes";
import { RootState } from ".";
import { DateData } from "react-native-calendars";
import { status } from "@/types/apiTypes";

interface ReservesState {
  reserves: ReservaType[];
  errors: { [key in actions]?: string | null };
  actionsStatus: { [key in actions]?: status };
}

const initialState: ReservesState = {
  reserves: [],
  errors: {
    [actions.index]: null,
    [actions.create]: null,
    [actions.createAsStudent]: null,
    [actions.getPerMonth]: null,
    [actions.finish]: null,
  },
  actionsStatus: {
    [actions.index]: status.idle,
    [actions.create]: status.idle,
    [actions.createAsStudent]: status.idle,
    [actions.getPerMonth]: status.idle,
    [actions.finish]: status.idle,
  },
};

// Fetch reserves API
export const getReserves = createAsyncThunk<
  ReservaType[], // Expected result type
  void, // No parameters required here
  { state: RootState }
>("entrenador/getReserves", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.user?.token;

  const response = await fetch(
    process.env.EXPO_PUBLIC_API_URL + "/entrenador/reserves",
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
    return rejectWithValue(data.error ?? "Failed getting reservations");
  }
  return data.data;
});

//Create reservation as a student
export const createReservaAlumne = createAsyncThunk<
  ReservaType, // Expected result type
  { hora: string }, // Parameters type
  { state: RootState }
>(
  "alumne/createReserva",
  async ({ hora }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;

    const response = await fetch(
      process.env.EXPO_PUBLIC_API_URL + "/reserves",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hora }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.error ?? "Failed to create reservation");
    }
    return data.data;
  }
);

// Create reservation
export const createReserva = createAsyncThunk<
  ReservaType, // Expected result type
  { usuariID: number; hora: string }, // Parameters type
  { state: RootState }
>(
  "entrenador/createReserva",
  async ({ usuariID, hora }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;

    const response = await fetch(
      process.env.EXPO_PUBLIC_API_URL + "/reserves",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuariID, hora }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.error ?? "Failed to create reservation");
    }
    return data.data;
  }
);

// Get reservations per month
export const getReservesPerMes = createAsyncThunk<
  ReservaType[], // Expected result type
  { mes: number; year: number }, // Parameters type
  { state: RootState }
>("entrenador/getReservesPerMes", async ({ mes, year }, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.user?.token;

  const response = await fetch(
    process.env.EXPO_PUBLIC_API_URL + "/entrenador/reserves/" + mes + "/" + year,
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
    return rejectWithValue(data.error ?? "Failed to fetch reserves");
  }
  return data.data;
});


//finish training
export const finishTraining = createAsyncThunk<
  ReservaType, // Expected result type
  { alumneID: number }, // Parameters type
  { state: RootState }
>(
  "entrenador/finishTraining", async ({ alumneID }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;

    const response = await fetch(
      process.env.EXPO_PUBLIC_API_URL + "/entrenador/guardarExercicisRutina",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ alumneID }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.error ?? "Failed to finish training");
    }
    return data.data;
  }
)


const reservesSlice = createSlice({
  name: "reserves",
  initialState,
  reducers: {
    deleteReservesSlice: (state) => {
      state.reserves = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get reserves
      .addCase(getReserves.pending, (state) => {
        state.actionsStatus[actions.index] = status.pending;
      })
      .addCase(
        getReserves.fulfilled,
        (state, action: PayloadAction<ReservaType[]>) => {
          state.actionsStatus[actions.index] = status.succeeded;
          state.reserves = action.payload;
        }
      )
      .addCase(getReserves.rejected, (state, action) => {
        state.actionsStatus[actions.index] = status.failed;
        state.errors[actions.index] = action.payload as string;
      })
      // Get reserves per month
      .addCase(getReservesPerMes.pending, (state) => {
        state.actionsStatus[actions.getPerMonth] = status.pending;
      })
      .addCase(
        getReservesPerMes.fulfilled,
        (state, action: PayloadAction<ReservaType[]>) => {
          state.actionsStatus[actions.getPerMonth] = status.succeeded;

          const existingIds = new Set(state.reserves.map(reserva => reserva.id));
          const newReserves = action.payload.filter(reserva => !existingIds.has(reserva.id));

          state.reserves = [...state.reserves, ...newReserves];
        }
      )
      .addCase(getReservesPerMes.rejected, (state, action) => {
        state.actionsStatus[actions.index] = status.failed;
        state.errors[actions.index] = action.payload as string;
      })
      // Create reserva
      .addCase(createReserva.pending, (state) => {
        state.actionsStatus[actions.create] = status.pending;
      })
      .addCase(
        createReserva.fulfilled,
        (state, action: PayloadAction<ReservaType>) => {
          state.actionsStatus[actions.create] = status.succeeded;
          state.reserves.push(action.payload);
        }
      )
      .addCase(createReserva.rejected, (state, action) => {
        state.actionsStatus[actions.create] = status.failed;
        state.errors[actions.create] = action.payload as string;
      })
      // Finish training
      .addCase(finishTraining.pending, (state) => {
        state.actionsStatus[actions.finish] = status.pending;
      })
      .addCase(
        finishTraining.fulfilled,
        (state, action: PayloadAction<ReservaType>) => {
          state.actionsStatus[actions.finish] = status.succeeded;
          state.reserves = state.reserves.filter(reserve => reserve.id !== action.payload.id);
        }
      )
      .addCase(finishTraining.rejected, (state, action) => {
        state.actionsStatus[actions.finish] = status.failed;
        state.errors[actions.finish] = action.payload as string;
      });
  },
});

export const selectAllReserves = (state: RootState) => state.reserves.reserves;
export const selectUpcomingReserves = createSelector(
  [selectAllReserves],
  (reserves) => {
    const currentTimeMinusTwoHours = Date.now() - 1.5 * 60 * 60 * 1000; // substract 2 hours

    return reserves.filter(
      (reserva) => new Date(reserva.hora).getTime() >= currentTimeMinusTwoHours
    );
  }
);

export const selectReserveByID = (state: RootState, reservaID: number) =>
  state.reserves.reserves.find((reserva) => reserva.id === reservaID);

export const selectReservesStatus = (state: RootState) => state.reserves.actionsStatus;
export const selectReservesError = (state: RootState) => state.reserves.errors;
export const selectUpcomingReservesByAlumneID = createSelector(
  [selectAllReserves, (_, alumneID: number) => alumneID],
  (reserves, alumneID) =>
    reserves.filter(
      (reserva) =>
        reserva.usuariID === alumneID &&
        new Date(reserva.hora).getTime() >= Date.now()
    )
);
export const selectReservesByMesAndUser = createSelector(
  [
    selectAllReserves,
    (_: RootState, mes: DateData) => mes,
    (_: RootState, __: DateData, userID: number) => userID,
  ],
  (reserves, mes, userID) =>
    reserves.filter(
      (reserva) =>
        new Date(reserva.hora).getFullYear() === mes.year &&
        new Date(reserva.hora).getMonth() === mes.month - 1 &&
        reserva.usuariID === userID
    )
);
export const selectReservaByDayAndUser = createSelector(
  [
    selectAllReserves,
    (_: RootState, day: DateData) => day,
    (_: RootState, __: DateData, userID: number) => userID,
  ],
  (reserves, day, userID) =>
    reserves.find(
      (reserva) =>
        new Date(reserva.hora).getTime() >= new Date(day.timestamp).getTime() &&
        new Date(reserva.hora).getTime() < new Date(day.timestamp).getTime() + 24 * 60 * 60 * 1000 &&
        reserva.usuariID === userID
    ),
)
export const selectReservesByDay = createSelector(
  [selectAllReserves, (_, day: DateData) => day],
  (reserves, day) =>
    reserves
      .filter(
        (reserva) =>
          new Date(reserva.hora).getFullYear() == day.year && new Date(reserva.hora).getMonth() == day.month - 1 &&
          new Date(reserva.hora).getDate() == day.day
      )
      .sort((a, b) => new Date(a.hora).getTime() - new Date(b.hora).getTime())
);

export const selectReservesByMes = createSelector(
  [selectAllReserves, (_, day: DateData) => day],
  (reserves, day) =>
    reserves.filter(
      (reserva) =>
        new Date(reserva.hora).getFullYear() === day.year &&
        new Date(reserva.hora).getMonth() === day.month - 1
    )
);
export const { deleteReservesSlice } = reservesSlice.actions;
export default reservesSlice.reducer;
