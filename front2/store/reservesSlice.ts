import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
ReservaType,
} from "../types/apiTypes";
import { api } from "@/app/api";
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

// Define the async thunk
export const getReserves = createAsyncThunk<
  ReservaType[], // Expected result type
  void, // No parameters required here
  { state: RootState }
>("entrenador/getReserves", async (_, { rejectWithValue }) => {
    const response = await api.get("/entrenador/reserves");
    return response.status == 200 ? response.data.data : rejectWithValue(response.data.error ?? "Failed getting reservations");
});

export const createReserva = createAsyncThunk<
  ReservaType, // Expected result type
  { data: {usuariID: number, hora: string} }, // Parameters type
  { state: RootState }
>("entrenador/createReserva", async ({ data }, { rejectWithValue }) => {
    const response = await api.post("/entrenador/reserves", data);
    return response.status == 200 ? response.data.data : rejectWithValue(response.data.error ?? "Failed to create reservation");
});

const reservesSlice = createSlice({
    name: "reserves",
    initialState,
    reducers: {
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
        .addCase(createReserva.fulfilled, (state, action: PayloadAction<ReservaType>) => {
          state.status = "succeeded";
          state.reserves.push(action.payload);
        })
        .addCase(createReserva.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload as string;
        });
    },
  });

export const selectAllReserves = (state: RootState) => state.reserves.reserves;
export const selectReserveByID = (state: RootState, reservaID: number) =>
  state.reserves.reserves.find((reserva) => reserva.ID === reservaID);

export const selectReservesStatus = (state: RootState) => state.reserves.status;
export const selectReservesError = (state: RootState) => state.reserves.error;
export default reservesSlice.reducer;