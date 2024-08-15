import { createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit';
import { SalaType, SalesState, AlumnesState, AlumneType, EntrenoType } from '../types/apiTypes';

const salesSlice = createSlice({
  name: 'sales',
  initialState: {} as SalesState,
  reducers: {
    setSales(state: SalesState, action: PayloadAction<SalesState>) {
      return action.payload;
    },
    updateSala(state: SalesState, action: PayloadAction<{ id: number; data: SalaType }>) {
      const { id, data } = action.payload;
      state[id] = data;
    }
  },
});

const alumnesSlice = createSlice({
  name: 'alumnes',
  initialState: {} as AlumnesState,
  reducers: {
    setAlumnes(state: AlumnesState, action: PayloadAction<AlumnesState>) {
      return action.payload;
    },
    updateAlumne(state: AlumnesState, action: PayloadAction<{ id: number; data: AlumneType }>) {
      const { id, data } = action.payload;
      state[id] = data;
    }
  },
});

export const { setSales, updateSala } = salesSlice.actions;
export const { setAlumnes, updateAlumne} = alumnesSlice.actions;

const rootReducer = combineReducers({
  sales: salesSlice.reducer,
  alumnes: alumnesSlice.reducer,
});

export default rootReducer;