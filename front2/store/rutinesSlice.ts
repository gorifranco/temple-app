import {
    createSlice,
    PayloadAction,
  } from "@reduxjs/toolkit";
  import {
RutinaState,
RutinaType
  } from "../types/apiTypes";
  
  const rutinesSlice = createSlice({
      name: "rutines",
      initialState: {} as RutinaState,
      reducers: {
        setRutines(state: RutinaState, action: PayloadAction<RutinaState>) {
          return action.payload;
        },
        updateRutines(
          state: RutinaState,
          action: PayloadAction<{ data: RutinaType[] }>
        ) {
          const { data } = action.payload;
    
          // Si no hay datos, vaciamos el estado
          if (!data || data.length === 0) {
            Object.keys(state).forEach((key) => {
              delete state[Number(key)];
            });
          } else {
            // Primero, creamos un nuevo estado basado en los datos recibidos
            const newState: RutinaState = {};
    
            for (let i = 0; i < data.length; i++) {
              const rutina = data[i];
              newState[rutina.ID] = rutina;
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
        deleteRutina(
            state: RutinaState,
            action: PayloadAction<{ id: number }>
          ){
            const { id } = action.payload;
            delete state[id];
          },
      },
    });
    
    export const { setRutines, updateRutines, deleteRutina } = rutinesSlice.actions;
    export default rutinesSlice.reducer;