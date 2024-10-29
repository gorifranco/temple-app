import { createSlice } from "@reduxjs/toolkit";

interface UserInput {
  nom: string;
  email: string;
  tipusUsuari: string;
  codiEntrenador: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null as string | null,
    user: null as UserInput | null,
  },
  reducers: {
    loginRedux: (state, action) => {
      state.token = action.payload.token;
      const user:UserInput = {
        nom: action.payload.nom,
        email: action.payload.email,
        tipusUsuari: action.payload.tipusUsuari,
        codiEntrenador: action.payload.codiEntrenador,
      }
      state.user = user;
    },
    logoutRedux: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { loginRedux, logoutRedux } = authSlice.actions;
export default authSlice.reducer;
