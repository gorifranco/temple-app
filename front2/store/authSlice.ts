import { createSlice } from "@reduxjs/toolkit";

interface UserInput {
  ID: number;
  Nom: string;
  Email: string;
  TipusUsuari: string;
  CodiEntrenador: string;
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
        ID: action.payload.user.id,
        Nom: action.payload.user.nom,
        Email: action.payload.user.email,
        TipusUsuari: action.payload.user.tipusUsuari,
        CodiEntrenador: action.payload.user.codiEntrenador,
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
