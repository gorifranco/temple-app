import axios from 'axios';
import { useContext } from 'react';
import AuthContext from './AuthContext';
import { AuthContextType } from './AuthContext';

const api = axios.create({
  baseURL: 'http://217.71.207.116:8082/api',
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
};