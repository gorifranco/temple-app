import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
ReservaType,
ReservesState,
} from "../types/apiTypes";

const reservesSlice = createSlice({
    name: "reserves",
    initialState: {} as ReservesState,
    reducers: {
      setReserves(state: ReservesState, action: PayloadAction<ReservesState>) {
        return action.payload;
      },
      updateReserva(
        state: ReservesState,
        action: PayloadAction<{ id: number; data: ReservaType }>
      ) {
        const { id, data } = action.payload;
        state[id] = data;
      },
      updateReserves(
        state: ReservesState,
        action: PayloadAction<{ data: ReservaType[] }>
      ) {
        const { data } = action.payload;
  
        // Si no hay datos, vaciamos el estado
        if (!data || data.length === 0) {
          Object.keys(state).forEach((key) => {
            delete state[Number(key)];
          });
        } else {
          // Primero, creamos un nuevo estado basado en los datos recibidos
          const newState: ReservesState = {};
  
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

export const { setReserves, updateReserva, updateReserves } = reservesSlice.actions;
export default reservesSlice.reducer;