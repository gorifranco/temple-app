import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservaType } from "../types/apiTypes";
import { RootState } from ".";

interface ReservesState {
  reserves: ReservaType[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReservesState = {
  reserves: [],
  status: "idle",
  error: null,
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
    console.log(data.data)
    return data.data;
  }
);

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
        state.status = "pending";
      })
      .addCase(
        getReserves.fulfilled,
        (state, action: PayloadAction<ReservaType[]>) => {
          state.status = "succeeded";
          state.reserves = action.payload;
        }
      )
      .addCase(getReserves.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create reserva
      .addCase(createReserva.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        createReserva.fulfilled,
        (state, action: PayloadAction<ReservaType>) => {
          state.status = "succeeded";
          state.reserves.push(action.payload);
        }
      )
      .addCase(createReserva.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectAllReserves = (state: RootState) => state.reserves.reserves;
export const selectReserveByID = (state: RootState, reservaID: number) =>
  state.reserves.reserves.find((reserva) => reserva.id === reservaID);

export const selectReservesStatus = (state: RootState) => state.reserves.status;
export const selectReservesError = (state: RootState) => state.reserves.error;
export const selectUpcomingReservesByAlumneID = createSelector(
  [selectAllReserves, (_, alumneID: number) => alumneID],
  (reserves, alumneID) => reserves.filter(
    (reserva) =>
      reserva.usuariID === alumneID &&
      new Date(reserva.hora).getTime() >= Date.now()
  )
);
export const { deleteReservesSlice } = reservesSlice.actions;
export default reservesSlice.reducer;
