import { RmType } from "@/types/apiTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { actions, ReservaType } from "@/types/apiTypes";
import { status } from "@/types/apiTypes";
import * as env_constants from '@/constants/env.config';

interface StatsState {
  rms: RmType[];
  actionsStatus: { [key in actions]?: status };
  errors: { [key in actions]?: string | null };
}

const initialState: StatsState = {
  rms: [],
  actionsStatus: {
    [actions.index]: status.idle,
    [actions.update]: status.idle,
  },
  errors: {
    [actions.index]: null,
    [actions.update]: null,
  },
};

// Fetch rms entrenador api
export const getRmsEntrenador = createAsyncThunk<
  RmType[], // Expected result type
  void, // No parameters required here
  { state: RootState }
>("rms/getRmsEntrenador", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.auth.user?.token;

  const response = await fetch(
    env_constants.EXPO_PUBLIC_API_URL + "/rms",
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

export const updateRm = createAsyncThunk<
  RmType, // Expected result type
  { usuariID: number; exerciciID: number; pes: number }, // Parameters type
  { state: RootState }
>(
  "rms/updateRm",
  async ({ usuariID, exerciciID, pes }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.user?.token;
    const response = await fetch(
      `${env_constants.EXPO_PUBLIC_API_URL}/rms`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuariID,
          exerciciID,
          pes,
        }),
      }
    );
    const r = await response.json();
    if (!response.ok) {
      return rejectWithValue(r.error ?? "Failed to update rm");
    }
    return r.data;
  }
);

const rmsSlice = createSlice({
  name: "rms",
  initialState,
  reducers: {
    deleteRmsSlice: (state) => {
      state.rms = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get rms
      .addCase(getRmsEntrenador.pending, (state) => {
        state.actionsStatus[actions.index] = status.pending;
      })
      .addCase(
        getRmsEntrenador.fulfilled,
        (state, action: PayloadAction<RmType[]>) => {
          state.actionsStatus[actions.index] = status.succeeded;
          state.rms = action.payload;
        }
      )
      .addCase(getRmsEntrenador.rejected, (state, action) => {
        state.actionsStatus[actions.index] = status.failed;
        state.errors[actions.index] = action.payload as string;
      })
      // Update rm
      .addCase(updateRm.pending, (state) => {
        state.actionsStatus[actions.update] = status.pending;
      })
      .addCase(
        updateRm.fulfilled,
        (state, action: PayloadAction<RmType>) => {
          state.actionsStatus[actions.update] = status.succeeded;
          const oldRm = state.rms.find(
            (rm) => rm.usuariID === action.payload.usuariID && rm.exerciciID === action.payload.exerciciID
          );
          if (!oldRm) {
          state.rms.push(action.payload);
          } else {
            state.rms.with(state.rms.findIndex(rm => rm.usuariID === action.payload.usuariID && rm.exerciciID === action.payload.exerciciID), action.payload);
          }
        }
      )
      .addCase(updateRm.rejected, (state, action) => {
        state.actionsStatus[actions.update] = status.failed;
        state.errors[actions.update] = action.payload as string;
      });
  },
});

export const selectAllRms = (state: RootState) => state.rms.rms;
export const selectRmsStatus = (state: RootState) => state.rms.actionsStatus;
export const selectRmsError = (state: RootState) => state.rms.errors;

export const { deleteRmsSlice } = rmsSlice.actions;
export default rmsSlice.reducer;
