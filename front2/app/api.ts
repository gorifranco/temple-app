import { RootState } from "@/store";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export const api = axios.create({
  baseURL: "http://192.168.130.67:8080/api",
  timeout: 10000,
});

export const useAxios = () => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth) {
    throw new Error(
      "AuthProvider is missing. Please wrap your component tree with AuthProvider."
    );
  }

  api.interceptors.request.use(
    (config) => {
      if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

export async function assignarRutinaAPI(
  rutinaID: number,
  alumneID: number
): Promise<boolean> {
  const response = await api.post(`/entrenador/assignarRutina`, {
    rutinaID: rutinaID,
    alumneID: alumneID,
  });
  if (response.status === 200) {
    Toast.show({
      type: "success",
      text1: "Rutina assignada",
      position: "top",
    });
    return true;
  } else {
    Toast.show({
      type: "error",
      text1: "Error assignant la rutina",
      position: "top",
    });
    return false;
  }
}
