import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/api";
import { loginRedux, logoutRedux } from "@/store/authSlice";
import { RootState } from "../store";
import { useDispatch } from "react-redux";

export const login = createAsyncThunk<
  boolean,
  { email: string; password: string },
  { state: RootState }
>("auth/login", async ({ email, password }, { dispatch, getState }) => {
  const response = await api.post("/login", { email, password });
  console.log(response.data.data)
  dispatch(loginRedux(response.data.data));
  return response.status == 200 ? true : false;
});

export function logout() {
  const dispatch = useDispatch();
  dispatch(logoutRedux());
}
