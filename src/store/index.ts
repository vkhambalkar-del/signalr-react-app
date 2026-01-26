import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './slices/employeesSlice';
import signalRReducer from './slices/signalRSlice';

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    signalR: signalRReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
