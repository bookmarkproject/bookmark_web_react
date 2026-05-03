import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  changePasswordToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  changePasswordToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    clearAccessToken(state) {
      state.accessToken = null;
    },
    setChangePasswordToken(state, action: PayloadAction<string>) {
      state.changePasswordToken = action.payload;
    },
    clearChangePasswordToken(state) {
      state.changePasswordToken = null;
    },
  },
});

export const { setAccessToken, clearAccessToken, setChangePasswordToken, clearChangePasswordToken } =
  authSlice.actions;
export default authSlice.reducer;
