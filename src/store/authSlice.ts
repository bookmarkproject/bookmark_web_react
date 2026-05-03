import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  changePasswordToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  changePasswordToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },
    setChangePasswordToken(state, action: PayloadAction<string>) {
      state.changePasswordToken = action.payload;
    },
    clearChangePasswordToken(state) {
      state.changePasswordToken = null;
    },
  },
});

export const { setTokens, clearTokens, setChangePasswordToken, clearChangePasswordToken } =
  authSlice.actions;
export default authSlice.reducer;
