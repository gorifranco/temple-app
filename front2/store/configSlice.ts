import { ConfigState } from "../types/apiTypes";
import {
    createSlice,
    PayloadAction,
  } from "@reduxjs/toolkit";

const configSlice = createSlice({
    name: "config",
    initialState: {} as ConfigState,
    reducers: {
        setConfig(state: ConfigState, action: PayloadAction<ConfigState>) {
            return action.payload;
        },
    },
});

export const { setConfig } = configSlice.actions;
export default configSlice.reducer;