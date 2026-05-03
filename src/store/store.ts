import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import memberReducer from './memberSlice';
import bookRecordReducer from './bookRecordSlice';

// accessToken은 메모리에만, refreshToken만 localStorage에 유지
const authPersistConfig = {
  key: 'bookmark-auth',
  storage,
  whitelist: ['refreshToken'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  member: memberReducer,
  bookRecord: bookRecordReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
