import {
  createSlice,
  PayloadAction,
  combineReducers,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  SalaType,
  SalesState,
  AlumnesState,
  AlumneType,
} from "../types/apiTypes";

const alumnesSlice = createSlice({
  name: "alumnes",
  initialState: {} as AlumnesState,
  reducers: {
    setAlumne(state: AlumnesState, action: PayloadAction<AlumnesState>) {
      return action.payload;
    },
    updateAlumne(
      state: AlumnesState,
      action: PayloadAction<{ id: number; data: AlumneType }>
    ) {
      const { id, data } = action.payload;
      state[id] = data;
    },
    updateAlumnes(
      state: AlumnesState,
      action: PayloadAction<{ data: AlumneType[] }>
    ) {
      const { data } = action.payload;
    
      // Si no hay datos, vaciamos el estado
      if (!data || data.length === 0) {
        Object.keys(state).forEach(key => {
          delete state[Number(key)];
        });
      } else {
        // Primero, creamos un nuevo estado basado en los datos recibidos
        const newState: AlumnesState = {};
    
        for (let i = 0; i < data.length; i++) {
          const alumne = data[i];
          newState[alumne.ID] = alumne;
        }
    
        // Reemplazamos el estado anterior con el nuevo
        Object.keys(state).forEach(key => {
          const numericKey = Number(key);
          if (!newState[numericKey]) {
            delete state[numericKey];
          }
        });
    
        // Ahora asignamos el nuevo estado (actualizado) al estado actual
        Object.assign(state, newState);
      }
    },
    
  },
});

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
export const { setAlumne, updateAlumne, updateAlumnes } = alumnesSlice.actions;

const rootReducer = combineReducers({
  sales: salesSlice.reducer,
  alumnes: alumnesSlice.reducer,
});

export default rootReducer;
