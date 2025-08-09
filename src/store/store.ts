import { configureStore } from '@reduxjs/toolkit';
import formsReducer from './formsSlice';

export const store = configureStore({
  reducer: {
    forms: formsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
