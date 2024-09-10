import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
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
      addAlumne(
        state: AlumnesState,
        action: PayloadAction<{ id: number; data: AlumneType }>
      ) {
        const { id, data } = action.payload;
        state[id] = data;
      },
      updateAlumne(
        state: AlumnesState,
        action: PayloadAction<{ id: number; data: AlumneType }>
      ) {
        const { id, data } = action.payload;
        state[id] = data;
      },
      deleteAlumnne(
        state: AlumnesState,
        action: PayloadAction<{ id: number }>
      ){
        const { id } = action.payload;
        delete state[id];
      },
      updateAlumnes(
        state: AlumnesState,
        action: PayloadAction<{ data: AlumneType[] }>
      ) {
        const { data } = action.payload;
  
        // Si no hay datos, vaciamos el estado
        if (!data || data.length === 0) {
          Object.keys(state).forEach((key) => {
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
          Object.keys(state).forEach((key) => {
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

  export const { setAlumne, updateAlumne, updateAlumnes, deleteAlumnne, addAlumne } = alumnesSlice.actions;
  export default alumnesSlice.reducer;