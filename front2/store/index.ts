import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Action, combineReducers } from 'redux';
import exercicisReducer from './exercicisSlice';
import alumnesReducer from './alumnesSlice';
import reservesReducer from './reservesSlice';
import rutinesReducer from './rutinesSlice';
import configReducer from './configSlice';
import authReducer from './authSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // El almacenamiento local
};

// Combina los reducers
const rootReducer = combineReducers({
  exercicis: exercicisReducer,
  alumnes: alumnesReducer,
  reserves: reservesReducer,
  rutines: rutinesReducer,
  config: configReducer,
  auth: authReducer,
});

// Aplica persistencia a los reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

// Crea el persistor
export const persistor = persistStore(store);

// Tipos de estado y dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>

export default store;
