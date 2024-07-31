import axios from 'axios';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: 'https://tu-api.com/api',
  timeout: 10000, // Tiempo máximo de espera para una petición
});

// Interceptores de petición
api.interceptors.request.use(
  (config) => {
    // Puedes añadir headers comunes como tokens de autenticación aquí
    const token = 'tu-token-de-autenticacion'; // Reemplaza con tu lógica para obtener el token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
