import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  SalaType,
  SalesState,
} from "../types/apiTypes";


const salesSlice = createSlice({
  name: "sales",
  initialState: {} as SalesState,
  reducers: {
    setSales(state: SalesState, action: PayloadAction<SalesState>) {
      return action.payload;
    },
    updateSala(
      state: SalesState,
      action: PayloadAction<{ id: number; data: SalaType }>
    ) {
      const { id, data } = action.payload;
      state[id] = data;
    },
  },
});

export const { setSales, updateSala } = salesSlice.actions;
export default salesSlice.reducer;