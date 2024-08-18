import { createSlice, PayloadAction, combineReducers, createAsyncThunk } from '@reduxjs/toolkit';
import { SalaType, SalesState, AlumnesState, AlumneType } from '../types/apiTypes';

const alumnesSlice = createSlice({
  name: 'alumnes',
  initialState: {} as AlumnesState,
  reducers: {
    setAlumne(state: AlumnesState, action: PayloadAction<AlumnesState>) {
      return action.payload;
    },
    updateAlumne(state: AlumnesState, action: PayloadAction<{ id: number; data: AlumneType }>) {
      const { id, data } = action.payload;
      state[id] = data;
    },
    updateAlumnes(state: AlumnesState, action: PayloadAction<{ data: AlumneType[] }>) {
      const { data } = action.payload;
      for (let i = 0; i < data.length; i++) {
        const alumne = data[i];

        if (state[alumne.ID]) {
          state[alumne.ID].Nom = alumne.Nom;
          state[alumne.ID].entrenos = alumne.entrenos;
        } else {
          state[alumne.ID] = alumne;
        }
      }
    }
    
  },
})

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


export const { setSales, updateSala } = salesSlice.actions;
export const { setAlumne, updateAlumne, updateAlumnes } = alumnesSlice.actions;

const rootReducer = combineReducers({
  sales: salesSlice.reducer,
  alumnes: alumnesSlice.reducer,
});

export default rootReducer;
