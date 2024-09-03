import { configureStore } from '@reduxjs/toolkit';
import exercicisReducer from './exercicisSlice';
import alumnesReducer from './alumnesSlice';
import reservesReducer from './reservesSlice';
import salesReducer from './salesSlice';
import rutinesReducer from './rutinesSlice';

const store = configureStore({
  reducer: {
      exercicis: exercicisReducer,
      alumnes: alumnesReducer,
      reserves: reservesReducer,
      sales: salesReducer,
      rutines: rutinesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;