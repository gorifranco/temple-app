import { useAxios } from "@/app/api";
import { useDispatch } from "react-redux";
import { loginRedux, logoutRedux } from "@/store/authSlice";


export function login(email: string, password: string):boolean {
  const api = useAxios();
  const dispatch = useDispatch();

  api.post("/api/login", { email, password })
    .then((response) => {
      dispatch(loginRedux(response.data))
      return true
    })
    .catch(() => {
      return false;
    });

    return false;
}

export function logout() {
  const dispatch = useDispatch();
  dispatch(logoutRedux());
  return true;
}
