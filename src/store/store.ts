import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import memberReducer from './memberSlice';
import bookRecordReducer from './bookRecordSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  member: memberReducer,
  bookRecord: bookRecordReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
