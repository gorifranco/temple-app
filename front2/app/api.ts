import axios from 'axios';
import { useContext } from 'react';
import AuthContext from './AuthContext';
import { AuthContextType } from './AuthContext';
import Toast from 'react-native-toast-message';

const api = axios.create({
  baseURL: 'http://192.168.130.67:8080/api',
  timeout: 10000,
});

export const useAxios = () => {
  const authContext = useContext<AuthContextType | undefined>(AuthContext);

  if (!authContext) {
    throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
  }
  const { user } = authContext;

  api.interceptors.request.use(
    (config) => {
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
}

export async function assignarRutinaAPI(rutinaID: number, alumneID: number):Promise<boolean> {
  const response = await api.post(`/entrenador/assignarRutina`, { rutinaID: rutinaID, alumneID: alumneID })
  if (response.status === 200) {
      Toast.show({
          type: 'success',
          text1: 'Rutina assignada',
          position: 'top',
      });
      return true
  } else {
      Toast.show({
          type: 'error',
          text1: 'Error assignant la rutina',
          position: 'top',
      });
      return false;
  }
}