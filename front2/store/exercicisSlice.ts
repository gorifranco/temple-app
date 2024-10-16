import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
ExercicisState,
ExerciciType
} from "../types/apiTypes";

const exercicisSlice = createSlice({
    name: "exercicis",
    initialState: {} as ExercicisState,
    reducers: {
      setExercicis(state: ExercicisState, action: PayloadAction<ExercicisState>) {
        return action.payload;
      },
      updateReserves(
        state: ExercicisState,
        action: PayloadAction<{ data: ExerciciType[] }>
      ) {
        const { data } = action.payload;
  
        // Si no hay datos, vaciamos el estado
        if (!data || data.length === 0) {
          Object.keys(state).forEach((key) => {
            delete state[Number(key)];
          });
        } else {
          // Primero, creamos un nuevo estado basado en los datos recibidos
          const newState: ExercicisState = {};
  
          for (let i = 0; i < data.length; i++) {
            const reserva = data[i];
            newState[reserva.ID] = reserva;
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

  export function getExerciciByID (state: ExercicisState, exerciciID: number) {
    return state[exerciciID];
};
  
  export const { setExercicis } = exercicisSlice.actions;
  export default exercicisSlice.reducer;