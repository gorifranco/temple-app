import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000, // Tiempo máximo de espera para una petición
});

// Interceptores de petición
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from AsyncStorage', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptores de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo de errores globales
    if (error.response && error.response.status === 401) {
      // Manejo de errores de autenticación, por ejemplo
    }
    return Promise.reject(error);
  }
);

export default api;
